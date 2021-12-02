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

    let last = -1
    const result = this.lines.reduce((acc, cur) => {
      if (last > 0 && +cur > last) {
        acc++
      }
      last = +cur
      return acc
    }, 0)
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)

    let a = -1
    let b = -1
    let c = -1
    const result = this.lines.reduce((acc, cur) => {
      if (a > 0 && b > 0 && c > 0 && +cur + b + c > a + b + c) {
        acc++
      }
      a = b
      b = c
      c = +cur
      return acc
    }, 0)
    logger.result(result)
  }
}

const day = '01'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
