import { Logger } from '../../lib/log'
import { parseFile, parseLine } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  area: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    const { minX, maxX, minY, maxY } = parseLine(this.file, /target area: x=(?<minX>.+)\.\.(?<maxX>.+), y=(?<minY>.+)\.\.(?<maxY>.+)/)
    this.area = { minX: +minX, maxX: +maxX, minY: +minY, maxY: +maxY }
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const xPossibilities = this.computeXPossibilities()
    const best = this.findBestY(xPossibilities)
    logger.result(best.bestPos)
  }

  computeXPossibilities () {
    const possibilities = []
    for (let i = 1; i < this.area.minX / 2; i++) {
      let step = 0
      let position = 0
      let velocity = i
      let startStep = null
      while (velocity > 0 && position <= this.area.maxX) {
        step++
        position += velocity
        velocity = Math.max(0, --velocity)
        if (startStep === null && position >= this.area.minX && position <= this.area.maxX) {
          startStep = step
        }
        if (velocity === 0 && position >= this.area.minX && position <= this.area.maxX) {
          possibilities.push({ force: i, step, startStep })
        }
      }
    }
    return possibilities
  }

  findBestY (xPossibilities) {
    let best = null
    for (let x = 0; x < xPossibilities.length; x++) {
      const xPossibility = xPossibilities[x]
      for (let i = 0; i < Math.abs(this.area.minY); i++) {
        let step = 0
        let position = 0
        let velocity = i
        let bestPos = 0
        while (position >= this.area.minY) {
          step++
          position += velocity--
          if (velocity === 0) {
            bestPos = position
          }
          if (step >= xPossibility.startStep && position >= this.area.minY && position <= this.area.maxY && (best === null || best.bestPos < bestPos)) {
            best = { step, x: xPossibility.force, y: i, bestPos }
          }
        }
      }
    }
    return best
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const xPossibilities = this.findXPossibilities()
    const possibilities = this.findYPossibilities(xPossibilities)
    logger.result(possibilities.length)
  }

  findXPossibilities () {
    const possibilities = []
    for (let i = 1; i <= this.area.maxX; i++) {
      let step = 0
      let position = 0
      let velocity = i
      let item = null
      while (velocity > 0 && position <= this.area.maxX) {
        step++
        position += velocity
        velocity = Math.max(0, --velocity)
        if (item === null && position >= this.area.minX && position <= this.area.maxX) {
          item = { force: i, startStep: step }
        }
        if (velocity === 0 && position >= this.area.minX && position <= this.area.maxX) {
          item.infinite = true
        }
      }
      if (item && !item.infinite) {
        item.endStep = step - 1
      }
      if (item) possibilities.push(item)
    }
    return possibilities
  }

  findYPossibilities (xPossibilities) {
    const possibilities = []
    for (let x = 0; x < xPossibilities.length; x++) {
      const xPossibility = xPossibilities[x]
      for (let i = this.area.minY; i < Math.abs(this.area.minY); i++) {
        let step = 0
        let position = 0
        let velocity = i
        let done = false
        while (position >= this.area.minY && (step < xPossibility.endStep || xPossibility.infinite) && !done) {
          step++
          position += velocity--
          if (step >= xPossibility.startStep && position >= this.area.minY && position <= this.area.maxY) {
            done = true
            possibilities.push({ x: xPossibility.force, y: i })
          }
        }
      }
    }
    return possibilities
  }
}

const day = '17'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
