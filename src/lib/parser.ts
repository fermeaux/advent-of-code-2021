import fs from 'fs'
import path from 'path'

export function parseFile (day: string, fileName: string = 'data'): string {
  try {
    const data = fs.readFileSync(path.resolve(`./src/solutions/aoc-${day}/${fileName}.txt`), 'utf8')
    return data.replace(/\r\n/g, '\n')
  } catch (err) {
    console.error(err)
  }
  return ''
}
