import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

const day = '{{day}}'
const testing = false

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
    logger.info('lines', this.lines)
    // const values = {}
    // this.lines.forEach(line => {
    //   const { name } = /(?<name>.+)/.exec(line).groups
    //   values[name] = 0
    // })

    const result = 0
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)

    const result = 0
    logger.result(result)
  }
}

const resolver = new Resolver({ day, testing })
resolver.solve1()
// resolver.solve2()
