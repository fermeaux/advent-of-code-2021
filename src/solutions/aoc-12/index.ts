import { Logger } from '../../lib/log'
import { parseFile, parseLine } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  caves: any

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
    this.caves = this.lines.reduce((caves, line) => {
      const { left, right } = parseLine(line, /(?<left>.+)-(?<right>.+)/)
      if (!caves[left]) {
        caves[left] = { isBig: this.isBig(left), routes: [] }
      }
      if (!caves[right]) {
        caves[right] = { isBig: this.isBig(right), routes: [] }
      }
      caves[right].routes.push(left)
      caves[left].routes.push(right)
      return caves
    }, {})
  }

  isBig (cave: string): boolean {
    return cave !== cave.toLowerCase()
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const paths = this.findAllPaths()
    logger.result(paths.length)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const paths = this.findAllPaths(false)
    logger.result(paths.length)
  }

  findAllPaths (usedBonusSmallCave = true, path = ['start'], visited = {}) {
    const lastCave = path[path.length - 1]
    if (lastCave === 'end') {
      return [path]
    }
    const paths = []
    visited[lastCave] = true
    for (let i = 0; i < this.caves[lastCave].routes.length; i++) {
      const nextCave = this.caves[lastCave].routes[i]
      if (visited[nextCave] && !usedBonusSmallCave && nextCave !== 'start' && !this.caves[nextCave].isBig) {
        paths.push(...this.findAllPaths(true, [...path, nextCave], { ...visited }))
      } else if (!visited[nextCave] || this.caves[nextCave].isBig) {
        paths.push(...this.findAllPaths(usedBonusSmallCave, [...path, nextCave], { ...visited }))
      }
    }
    return paths
  }
}

const day = '12'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
