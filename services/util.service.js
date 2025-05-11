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