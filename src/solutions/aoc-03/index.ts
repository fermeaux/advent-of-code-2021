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
    const common = {}
    this.lines.forEach(line => {
      const bits = line.split('')
      bits.forEach((bit, index) => {
        if (!common[index]) {
          common[index] = {}
        }
        if (!common[index][bit]) {
          common[index][bit] = 0
        }
        common[index][bit]++
      })
    })
    let gammaRate = ''
    let epsilonRate = ''
    for (let i = 0; i < this.lines[0].length; i++) {
      if (common[i]['0'] > common[i]['1']) {
        gammaRate += '0'
        epsilonRate += '1'
      } else {
        gammaRate += '1'
        epsilonRate += '0'
      }
    }
    const result = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    let remainingCarbon = [...this.lines]
    let remainingOxygen = [...this.lines]
    for (let i = 0; i < this.lines[0].length; i++) {
      const commonOxygen = {}
      remainingOxygen.forEach(line => {
        const bits = line.split('')
        bits.forEach((bit, index) => {
          if (!commonOxygen[index]) {
            commonOxygen[index] = {}
          }
          if (!commonOxygen[index][bit]) {
            commonOxygen[index][bit] = 0
          }
          commonOxygen[index][bit]++
        })
      })
      if (remainingOxygen.length > 1) {
        remainingOxygen = remainingOxygen.filter(line => {
          if (commonOxygen[i]['0'] > commonOxygen[i]['1']) {
            return line[i] === '0'
          } else {
            return line[i] === '1'
          }
        })
      }
      const commonCarbon = {}
      remainingCarbon.forEach(line => {
        const bits = line.split('')
        bits.forEach((bit, index) => {
          if (!commonCarbon[index]) {
            commonCarbon[index] = {}
          }
          if (!commonCarbon[index][bit]) {
            commonCarbon[index][bit] = 0
          }
          commonCarbon[index][bit]++
        })
      })
      if (remainingCarbon.length > 1) {
        remainingCarbon = remainingCarbon.filter(line => {
          if (commonCarbon[i]['0'] > commonCarbon[i]['1']) {
            return line[i] === '1'
          } else {
            return line[i] === '0'
          }
        })
      }
    }
    const result = parseInt(remainingCarbon[0], 2) * parseInt(remainingOxygen[0], 2)
    logger.result(result)
  }
}

const day = '03'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
