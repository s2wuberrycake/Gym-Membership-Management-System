import { app, BrowserWindow } from "electron"
import path from "path"
import { fileURLToPath } from "url"
import { spawn } from "child_process"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

let serverProcess = null

function isDev() {
  return process.env.NODE_ENV === "development"
}

function getServerEntry() {
  return path.join(__dirname, "server", "server.js")
}

function startServer() {
  if (isDev()) {
    return
  }
  if (process.env.SERVER_CHILD === "true") {
    return
  }

  const nodeExec = process.platform === "win32" ? "node.exe" : "node"
  const serverPath = getServerEntry()

  console.log("Spawning server at:", nodeExec, serverPath, "with cwd:", __dirname)
  console.log("Checking server entry exists:", fs.existsSync(serverPath))

  serverProcess = spawn(nodeExec, [serverPath], {
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: "production", SERVER_CHILD: "true", PATH: process.env.PATH },
    stdio: ["ignore", "pipe", "pipe"]
  })

  serverProcess.stdout.on("data", (data) => {
    console.log("SERVER OUT:", data.toString())
  })

  serverProcess.stderr.on("data", (data) => {
    console.error("SERVER ERR:", data.toString())
  })

  serverProcess.on("close", (code) => {
    console.log("Server exited with code", code)
  })
}

function getPreloadPath() {
  return path.join(__dirname, "preload.cjs")
}

function getIndexURL() {
  if (isDev()) {
    return "http://localhost:5173"
  } else {
    const indexPath = path.join(__dirname, "client", "dist", "index.html")
    return `file://${indexPath}`
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  win.maximize()
  win.loadURL(getIndexURL())
  win.webContents.on("did-finish-load", () => {
    win.webContents.setZoomLevel(-2)
  })
}

app.whenReady().then(() => {
  startServer()
  createWindow()
})

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill()
  if (process.platform !== "darwin") app.quit()
})
