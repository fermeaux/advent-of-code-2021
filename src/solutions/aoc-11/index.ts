import { isValidBoardDirection } from '../../lib/helper'
import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  octopus: number[][]
  visited: any;

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    let result = 0
    this.octopus = this.lines.map(line => line.split('').map(octopus => +octopus))
    for (let step = 0; step < 100; step++) {
      this.visited = {}
      for (let y = 0; y < this.octopus.length; y++) {
        for (let x = 0; x < this.octopus[y].length; x++) {
          this.addPoint(x, y)
        }
      }
      result = result + Object.keys(this.visited).length
    }
    logger.result(result)
  }

  flash (x, y) {
    this.visited[`${x}-${y}`] = true
    this.octopus[y][x] = 0
    this.flashPoint(x, y, { x: -1, y: -1 })
    this.flashPoint(x, y, { x: 0, y: -1 })
    this.flashPoint(x, y, { x: -1, y: 0 })
    this.flashPoint(x, y, { x: 1, y: -1 })
    this.flashPoint(x, y, { x: 1, y: 0 })
    this.flashPoint(x, y, { x: 1, y: 1 })
    this.flashPoint(x, y, { x: 0, y: 1 })
    this.flashPoint(x, y, { x: -1, y: 1 })
  }

  flashPoint (x, y, dir) {
    if (!isValidBoardDirection(this.octopus, { x, y }, dir)) return
    this.addPoint(x + dir.x, y + dir.y)
  }

  addPoint (x, y) {
    if (this.visited[`${x}-${y}`]) return
    this.octopus[y][x]++
    if (this.octopus[y][x] > 9) {
      this.flash(x, y)
    }
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    this.octopus = this.lines.map(line => line.split('').map(octopus => +octopus))
    for (let step = 0; true; step++) {
      this.visited = {}
      for (let y = 0; y < this.octopus.length; y++) {
        for (let x = 0; x < this.octopus[y].length; x++) {
          this.addPoint(x, y)
        }
      }
      if (this.octopus.length * this.octopus[0].length === Object.keys(this.visited).length) {
        logger.result(step + 1)
        return
      }
    }
  }
}

const day = '11'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
