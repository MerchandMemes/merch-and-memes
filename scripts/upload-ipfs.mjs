import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const BUCKET = process.env.FILEBASE_BUCKET_NAME
const ROOT = 'out'

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://s3.filebase.io',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY_ID,
    secretAccessKey: process.env.FILEBASE_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
})

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
}

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const files = await walk(ROOT)
console.log(`Uploading ${files.length} files to ${BUCKET}`)

let done = 0
for (const file of files) {
  const key = path.relative(ROOT, file).split(path.sep).join('/')
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: await readFile(file),
      ContentType: MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
    })
  )
  done++
  if (done % 25 === 0) console.log(`${done}/${files.length}`)
}

console.log('Upload complete')
