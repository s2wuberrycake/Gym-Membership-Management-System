import { spawn, exec as execCb } from "child_process"
import { pipeline } from "stream/promises"
import { createWriteStream, existsSync, mkdirSync, readdirSync, createReadStream } from "fs"
import path from "path"
import zlib from "zlib"
import { fileURLToPath } from "url"
import util from "util"
import { getToday, formatDate } from "../utils/date.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const exec = util.promisify(execCb)

const backupsDir = path.resolve(__dirname, "../backups")

function ensureBackupsDir() {
  if (!existsSync(backupsDir)) {
    mkdirSync(backupsDir, { recursive: true })
  }
}

export async function backupDatabase() {
  ensureBackupsDir()

  const dateStr = formatDate(getToday())
  const filename = `backup-${dateStr}.sql.gz`
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

  const dump = spawn("mysqldump", args, { shell: true })

  const gzip = zlib.createGzip()
  const out = createWriteStream(filepath)
  await pipeline(dump.stdout, gzip, out)

  return { filepath, filename }
}

export async function restoreDatabase(filename) {
  ensureBackupsDir()
  const db = process.env.DB_DEFAULT_NAME
  const backupPath = path.join(backupsDir, filename)

  const dropCreateCmd =
    `mysql -h ${process.env.DB_HOST} -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ` +
    `-e "DROP DATABASE IF EXISTS \`${db}\`; CREATE DATABASE \`${db}\`;"`
  await exec(dropCreateCmd)

  const mysqlProc = spawn(
    "mysql",
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
    .sort()
    .reverse()
}
