import { sumOfFirst } from '../../lib/helper'
import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const crabs = this.file.split(',').map(tmp => +tmp)
    const min = Math.min(...crabs)
    const max = Math.max(...crabs)
    let bestValue = 0
    for (let i = min; i <= max; i++) {
      const fuel = crabs.reduce((acc, crab) => acc + Math.abs(crab - i), 0)
      if (fuel < bestValue || i === min) {
        bestValue = fuel
      }
    }
    logger.result(bestValue)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const crabs = this.file.split(',').map(tmp => +tmp)
    const min = Math.min(...crabs)
    const max = Math.max(...crabs)
    let best = 0
    for (let i = min; i <= max; i++) {
      const fuel = crabs.reduce((acc, crab) => acc + sumOfFirst(Math.abs(crab - i)), 0)
      if (fuel < best || i === min) {
        best = fuel
      }
    }
    logger.result(best)
  }
}

const day = '07'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
