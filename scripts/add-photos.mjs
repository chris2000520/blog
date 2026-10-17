#!/usr/bin/env node
// 用法: node scripts/add-photos.mjs <图片URL> [更多URL...]
// 自动读取图片宽高，插入 photos.json 最前面。
// title/location/date/camera 留空，由作者后续在 photos.json 里填写。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataFile = path.resolve(__dirname, '../docs/gallery/photos.json')

function parseJpeg(buf) {
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++
      continue
    }
    const m = buf[i + 1]
    if (m === 0xd8 || m === 0xd9 || m === 0x01 || (m >= 0xd0 && m <= 0xd7)) {
      i += 2
      continue
    }
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m))
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) }
    const len = buf.readUInt16BE(i + 2)
    if (len < 2)
      break
    i += 2 + len
  }
  return null
}

async function getSize(url) {
  const res = await fetch(url, { headers: { Range: 'bytes=0-131071' } })
  const buf = Buffer.from(await res.arrayBuffer())
  return parseJpeg(buf)
}

const urls = process.argv.slice(2)
if (!urls.length) {
  console.error('用法: node scripts/add-photos.mjs <图片URL> [更多URL...]')
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
const newItems = []

for (const url of urls) {
  const size = await getSize(url)
  if (!size) {
    console.error('无法读取尺寸，已跳过:', url)
    continue
  }
  newItems.push({
    title: '',
    location: '',
    date: '',
    camera: '',
    width: size.width,
    height: size.height,
    src: url,
  })
}

const merged = [...newItems, ...data]
fs.writeFileSync(dataFile, JSON.stringify(merged, null, 2) + '\n')
console.log(`已添加 ${newItems.length} 张，当前共 ${merged.length} 张`)
