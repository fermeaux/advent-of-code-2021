import { Logger } from '../../lib/log'
import { parseFile, parseLine } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  vents: any[]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
    this.vents = []
    this.lines.forEach(line => {
      const { x1, x2, y1, y2 } = parseLine(line, /(?<x1>\d+),(?<y1>\d+) -> (?<x2>\d+),(?<y2>\d+)/)
      this.vents.push({ x1: +x1, x2: +x2, y1: +y1, y2: +y2 })
    })
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const map = {}
    let result = 0
    for (let i = 0; i < this.vents.length; i++) {
      const vent = this.vents[i]
      if (vent.x1 === vent.x2) {
        const iStart = Math.min(vent.y1, vent.y2)
        const iEnd = Math.max(vent.y1, vent.y2)
        const x = vent.x1
        for (let y = iStart; y <= iEnd; y++) {
          if (map[y] == null) {
            map[y] = {}
          }
          if (map[y][x] == null) {
            map[y][x] = 1
          } else {
            if (++map[y][x] === 2) {
              result++
            }
          }
        }
      } else if (vent.y1 === vent.y2) {
        const iStart = Math.min(vent.x1, vent.x2)
        const iEnd = Math.max(vent.x1, vent.x2)
        const y = vent.y1
        for (let x = iStart; x <= iEnd; x++) {
          if (map[y] == null) {
            map[y] = {}
          }
          if (map[y][x] == null) {
            map[y][x] = 1
          } else {
            if (++map[y][x] === 2) {
              result++
            }
          }
        }
      }
    }
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const map = {}
    let result = 0
    for (let i = 0; i < this.vents.length; i++) {
      const vent = this.vents[i]
      if (vent.x1 === vent.x2) {
        const iStart = Math.min(vent.y1, vent.y2)
        const iEnd = Math.max(vent.y1, vent.y2)
        const x = vent.x1
        for (let y = iStart; y <= iEnd; y++) {
          if (map[y] == null) {
            map[y] = {}
          }
          if (map[y][x] == null) {
            map[y][x] = 1
          } else {
            if (++map[y][x] === 2) {
              result++
            }
          }
        }
      } else if (vent.y1 === vent.y2) {
        const iStart = Math.min(vent.x1, vent.x2)
        const iEnd = Math.max(vent.x1, vent.x2)
        const y = vent.y1
        for (let x = iStart; x <= iEnd; x++) {
          if (map[y] == null) {
            map[y] = {}
          }
          if (map[y][x] == null) {
            map[y][x] = 1
          } else {
            if (++map[y][x] === 2) {
              result++
            }
          }
        }
      } else if (Math.abs(vent.x2 - vent.x1) === Math.abs(vent.y2 - vent.y1)) {
        const xInc = vent.x1 < vent.x2 ? 1 : -1
        const yInc = vent.y1 < vent.y2 ? 1 : -1
        let x = vent.x1
        let y = vent.y1

        for (let j = 0; j <= Math.max(vent.x1, vent.x2) - Math.min(vent.x1, vent.x2); j++) {
          if (map[y] == null) {
            map[y] = {}
          }
          if (map[y][x] == null) {
            map[y][x] = 1
          } else {
            if (++map[y][x] === 2) {
              result++
            }
          }
          x += xInc
          y += yInc
        }
      }
    }
    logger.result(result)
  }
}

const day = '05'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
