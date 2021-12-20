import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  image: number[][]
  header: number[]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    const [header, image] = this.file.split('\n\n')
    this.header = header.split('').map(char => +(char === '#'))
    this.image = image.split('\n').map(line => line.split('').map(char => +(char === '#')))
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const result = this.solve(2)
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const result = this.solve(50)
    logger.result(result)
  }

  solve (nbStep: number): number {
    let map = this.image
    for (let step = 0; step < nbStep; step++) {
      const newMap = []
      for (let y = -1; y < map.length + 1; y++) {
        const newLine = []
        for (let x = -1; x < map[0].length + 1; x++) {
          const pixels = []
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              pixels.push(map[y + dy]?.[x + dx] ?? this.header[0] & step % 2)
            }
          }
          const outputNb = parseInt(pixels.join(''), 2)
          newLine.push(this.header[outputNb])
        }
        newMap.push(newLine)
      }
      map = newMap
    }
    return map.flat().filter(Boolean).length
  }
}

const day = '20'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
