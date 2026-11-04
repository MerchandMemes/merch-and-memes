import { S3Client, PutBucketTaggingCommand } from '@aws-sdk/client-s3'
import { appendFileSync } from 'node:fs'

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

const command = new PutBucketTaggingCommand({
  Bucket: process.env.FILEBASE_BUCKET_NAME,
  Tagging: {
    TagSet: [{ Key: 'generateBucketCid', Value: 'true' }],
  },
})

let cid = ''
command.middlewareStack.add(
  (next) => async (args) => {
    const response = await next(args)
    cid = response.response.headers['x-amz-meta-cid'] || ''
    return response
  },
  { step: 'build' }
)

await client.send(command)

if (!cid) {
  console.error('No x-amz-meta-cid header returned')
  process.exit(1)
}

console.log(`BUCKET_CID=${cid}`)
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `cid=${cid}\n`)
