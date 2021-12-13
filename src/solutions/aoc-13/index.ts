import { Logger } from '../../lib/log'
import { parseFile, parseLine } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  points: any
  instructions: any[]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    const [points, instructions] = this.file.split('\n\n')
    this.points = points.split('\n').reduce((acc, point) => {
      const [x, y] = point.split(',')
      if (!acc[y]) acc[y] = {}
      acc[y][x] = true
      return acc
    }, {})
    this.instructions = instructions.split('\n').map(instruction => {
      const { axe, value } = parseLine(instruction, /fold along (?<axe>.)=(?<value>\d+)/)
      return { axe, value: +value }
    })
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const points = this.applyInstruction(this.instructions[0], { ...this.points })
    const result = Object.values(points).reduce((count: number, value) => {
      return count + Object.keys(value).length
    }, 0)
    logger.result(result)
  }

  applyInstruction (instruction, map) {
    const axe = instruction.value
    if (instruction.axe === 'x') {
      return Object.entries(map).reduce((newMap, [keyY, value]) => {
        return {
          ...newMap,
          ...Object.keys(value).reduce((acc, keyX) => {
            if (!acc[keyY]) acc[keyY] = {}
            if (+keyX < axe) {
              acc[keyY][keyX] = true
            } else if (+keyX > axe && axe - (+keyX - axe) >= 0) {
              const tmpKey = axe - (+keyX - axe)
              acc[keyY][tmpKey] = true
            }
            return acc
          }, {})
        }
      }, {})
    }
    if (instruction.axe === 'y') {
      return Object.entries(map).reduce((newMap, [key, value]) => {
        if (+key < axe) {
          if (!newMap[key]) newMap[key] = {}
          newMap[key] = { ...newMap[key], ...value }
        } else if (+key > axe && axe - (+key - axe) >= 0) {
          const tmpKey = axe - (+key - axe)
          if (!newMap[tmpKey]) newMap[tmpKey] = {}
          newMap[tmpKey] = { ...newMap[tmpKey], ...value }
        }
        return newMap
      }, {})
    }
    return {}
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const points = this.instructions.reduce((acc, instruction) => {
      return this.applyInstruction(instruction, acc)
    }, { ...this.points })
    this.displayMessage(points, logger)
    logger.printBar()
  }

  getMin (axe) {
    return this.instructions.reduce((min, instruction) => {
      return instruction.axe === axe && (min === null || min > instruction.value) ? instruction.value : min
    }, null)
  }

  displayMessage (points, logger) {
    const minX = this.getMin('x')
    const minY = this.getMin('y')
    logger.info('')
    for (let y = 0; y < minY; y++) {
      let message = ''
      for (let x = 0; x < minX; x++) {
        message += points[y] && points[y][x] ? '#' : ' '
      }
      logger.info(message)
    }
    logger.info('')
  }
}

const day = '13'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
