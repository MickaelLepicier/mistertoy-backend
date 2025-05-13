import fs from 'fs'

export const utilService = {
  readJsonFile,
}

function readJsonFile(path) {
  const str = fs.readFileSync(path, 'utf8')
  const json = JSON.parse(str)
  return json
}

export function isValidObjectId(id){
  if(typeof id !== 'string') return false
  if(id.length !== 24) return false

  const hexRegex = /^[0-9a-fA-F]$/
  return hexRegex.test(id)
}

export function makeId(length = 5) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}