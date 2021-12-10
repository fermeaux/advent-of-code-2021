import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  map: number[][];

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
    this.map = this.lines.map(line => line.split('').map(char => +char))
  }

  isLowestPoint (point): boolean {
    return this.isBottomLowest(point) && this.isTopLowest(point) && this.isLeftLowest(point) && this.isRightLowest(point)
  }

  getPoint (point, dir) {
    const newX = point.x + dir.x
    const newY = point.y + dir.y
    if (newX < 0 || newX >= this.map[0].length) {
      return null
    }
    if (newY < 0 || newY >= this.map.length) {
      return null
    }
    const newPoint = this.map[newY][newX]
    return { x: newX, y: newY, point: newPoint }
  }

  isBottomLowest (point): boolean {
    const bottom = this.getBottom(point)
    if (bottom == null) return true
    return point.point < bottom.point
  }

  getBottom (point) {
    return this.getPoint(point, { x: 0, y: 1 })
  }

  isTopLowest (point): boolean {
    const top = this.getTop(point)
    if (top == null) return true
    return point.point < top.point
  }

  getTop (point) {
    return this.getPoint(point, { x: 0, y: -1 })
  }

  isLeftLowest (point): boolean {
    const left = this.getLeft(point)
    if (left == null) return true
    return point.point < left.point
  }

  getLeft (point) {
    return this.getPoint(point, { x: -1, y: 0 })
  }

  isRightLowest (point): boolean {
    const right = this.getRight(point)
    if (right == null) return true
    return point.point < right.point
  }

  getRight (point) {
    return this.getPoint(point, { x: 1, y: 0 })
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const result = this.map.reduce((result, line, y) => {
      return result + line.reduce((accLine, point, x) => {
        if (this.isLowestPoint({ x, y, point })) {
          accLine += point + 1
        }
        return accLine
      }, 0)
    }, 0)
    logger.result(result)
  }

  findBassin (point, visited = {}) {
    if (point === null || point.point === 9 || visited[`${point.x}-${point.y}`]) {
      return 0
    }
    visited[`${point.x}-${point.y}`] = true
    let output = 1
    const top = this.getTop(point)
    const bottom = this.getBottom(point)
    const left = this.getLeft(point)
    const right = this.getRight(point)
    output += this.findBassin(top, visited)
    output += this.findBassin(bottom, visited)
    output += this.findBassin(left, visited)
    output += this.findBassin(right, visited)
    return output
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const lowestPoints = []
    this.map.forEach((line, y) => {
      line.forEach((point, x) => {
        if (this.isLowestPoint({ x, y, point })) {
          lowestPoints.push({ x, y, point })
        }
      })
    })
    const bassins = lowestPoints.map(lowPoint => this.findBassin(lowPoint))
    bassins.sort((a, b) => b - a)
    let result = 1
    for (let i = 0; i < 3; i++) {
      result *= bassins[i]
    }
    logger.result(result)
  }
}

const day = '09'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
