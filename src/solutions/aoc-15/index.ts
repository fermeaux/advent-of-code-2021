import { isValidBoardDirection } from '../../lib/helper'
import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  map: number[][]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    this.map = this.lines.map(line => line.split('').map(point => +point))
    logger.result(this.seekPath())
  }

  seekPath () {
    const paths = [{ x: 0, y: 0, score: 0 }]
    const visited = {}
    while (paths[0].x !== this.map[0].length - 1 || paths[0].y !== this.map.length - 1) {
      const path = paths.shift()
      if (!visited[`${path.x}-${path.y}`]) {
        visited[`${path.x}-${path.y}`] = true
        this.addInDir(paths, path, visited, { x: -1, y: 0 })
        this.addInDir(paths, path, visited, { x: 1, y: 0 })
        this.addInDir(paths, path, visited, { x: 0, y: -1 })
        this.addInDir(paths, path, visited, { x: 0, y: 1 })
        paths.sort((a, b) => a.score - b.score)
      }
    }
    return paths[0].score
  }

  addInDir (paths, current, visited, dir) {
    const newX = current.x + dir.x
    const newY = current.y + dir.y
    if (!visited[`${newX}-${newY}`] && isValidBoardDirection(this.map, current, dir)) {
      paths.push({
        x: newX,
        y: newY,
        score: current.score + this.map[newY][newX]
      })
    }
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    this.map = this.lines.map(line => line.split('').map(point => +point))
    this.enhanceMap()
    logger.result(this.seekPath())
  }

  enhanceMap () {
    const yLength = this.map.length
    const xLength = this.map[0].length
    for (let y = 0; y < yLength; y++) {
      for (let step = 1; step < 5; step++) {
        for (let x = 0; x < xLength; x++) {
          let nb = this.map[y][x] + step
          if (nb > 9) nb = nb - 9
          this.map[y].push(nb)
        }
      }
    }
    for (let step = 1; step < 5; step++) {
      for (let y = 0; y < yLength; y++) {
        const tmp = []
        for (let x = 0; x < this.map[y].length; x++) {
          let nb = this.map[y][x] + step
          if (nb > 9) nb = nb - 9
          tmp.push(nb)
        }
        this.map.push(tmp)
      }
    }
  }
}

const day = '15'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
