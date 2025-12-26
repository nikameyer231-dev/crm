// After build, copy manifest.json and public files to dist
import fs from 'fs'
import path from 'path'
const root = process.cwd()
const srcManifest = path.join(root, 'manifest.json')
const dist = path.join(root, 'dist')

if (!fs.existsSync(dist)) fs.mkdirSync(dist)
fs.copyFileSync(srcManifest, path.join(dist, 'manifest.json'))

// copy public
const publicDir = path.join(root, 'public')
if (fs.existsSync(publicDir)) {
  const copyRec = (src, dest) => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
    for (const name of fs.readdirSync(src)) {
      const s = path.join(src, name)
      const d = path.join(dest, name)
      if (fs.lstatSync(s).isDirectory()) copyRec(s, d)
      else fs.copyFileSync(s, d)
    }
  }
  copyRec(publicDir, dist)
}
console.log('manifest and public assets copied to dist/')