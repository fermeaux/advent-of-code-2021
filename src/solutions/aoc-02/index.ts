import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    let x = 0
    let y = 0
    this.lines.forEach(line => {
      const [instruction, depth] = line.split(' ')
      if (instruction === 'forward') {
        x += +depth
      }
      if (instruction === 'down') {
        y += +depth
      }
      if (instruction === 'up') {
        y -= +depth
      }
    })
    const result = x * y
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    let x = 0
    let y = 0
    let aim = 0
    this.lines.forEach(line => {
      const [instruction, depth] = line.split(' ')
      if (instruction === 'forward') {
        y += +depth * aim
        x += +depth
      }
      if (instruction === 'down') {
        aim += +depth
      }
      if (instruction === 'up') {
        aim -= +depth
      }
    })
    const result = x * y
    logger.result(result)
  }
}

const day = '02'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
