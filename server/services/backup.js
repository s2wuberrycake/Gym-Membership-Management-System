import { spawn, exec as execCb } from "child_process"
import { pipeline } from "stream/promises"
import { createWriteStream, existsSync, mkdirSync, readdirSync, unlinkSync, createReadStream, statSync } from "fs"
import path from "path"
import zlib from "zlib"
import { fileURLToPath } from "url"
import util from "util"
import { getToday, formatDate, TIMEZONE } from "../utils/date.js"
import { DateTime } from "luxon"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const exec = util.promisify(execCb)

const backupsDir = path.resolve(__dirname, "../backups")

const MYSQL_CLI = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe"`
const MYSQLDUMP_CLI = `"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe"`

function ensureBackupsDir() {
  if (!existsSync(backupsDir)) {
    mkdirSync(backupsDir, { recursive: true })
  }
}

export async function backupDatabase({ prefix = "backup" } = {}) {
  ensureBackupsDir()

  const dateStr = formatDate(getToday())
  const timeStr = DateTime.now().setZone(TIMEZONE).toFormat("HHmmss")
  const filename = `${prefix}-${dateStr}-${timeStr}.sql.gz`
  const filepath = path.join(backupsDir, filename)

  const args = [
    "-h", process.env.DB_HOST,
    "-u", process.env.DB_USER,
    `-p${process.env.DB_PASSWORD}`,
    "--single-transaction",
    "--routines",
    "--events",
    "--add-drop-table",
    process.env.DB_DEFAULT_NAME
  ]

  const dump = spawn(MYSQLDUMP_CLI, args, { shell: true })
  const gzip = zlib.createGzip()
  const out = createWriteStream(filepath)
  await pipeline(dump.stdout, gzip, out)

  const allFiles = readdirSync(backupsDir).filter(f => f.endsWith(".sql.gz"))
  const filesWithTimes = allFiles.map(name => {
    const fullPath = path.join(backupsDir, name)
    const { mtimeMs } = statSync(fullPath)
    return { name, time: mtimeMs }
  })

  filesWithTimes.sort((a, b) => a.time - b.time)

  if (filesWithTimes.length > 8) {
    const toRemove = filesWithTimes.slice(0, filesWithTimes.length - 8)
    toRemove.forEach(({ name }) => {
      try {
        unlinkSync(path.join(backupsDir, name))
      } catch (err) {
        console.warn("Could not delete old backup", name, err)
      }
    })
  }

  return { filepath, filename }
}

export async function restoreDatabase(filename) {
  ensureBackupsDir()
  const db = process.env.DB_DEFAULT_NAME
  const backupPath = path.join(backupsDir, filename)

  const dropCreateCmd =
    `${MYSQL_CLI} -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ` +
    `-e "DROP DATABASE IF EXISTS \`${db}\`; CREATE DATABASE \`${db}\`;"`

  await exec(dropCreateCmd)

  const mysqlProc = spawn(
    MYSQL_CLI,
    [
      "-h", process.env.DB_HOST,
      "-u", process.env.DB_USER,
      `-p${process.env.DB_PASSWORD}`,
      db
    ],
    { shell: true }
  )

  const gunzipStream = createReadStream(backupPath).pipe(zlib.createGunzip())
  await pipeline(gunzipStream, mysqlProc.stdin)

  return new Promise((resolve, reject) => {
    mysqlProc.on("error", reject)
    mysqlProc.on("close", code => {
      if (code === 0) resolve()
      else reject(new Error(`mysql exited with code ${code}`))
    })
  })
}

export function listBackups() {
  ensureBackupsDir()

  return readdirSync(backupsDir)
    .filter(f => f.endsWith(".sql.gz"))
    .map(name => {
      const full = path.join(backupsDir, name)
      return { name, mtime: statSync(full).mtimeMs }
    })
    .sort((a, b) => b.mtime - a.mtime)
    .map(f => f.name)
}
