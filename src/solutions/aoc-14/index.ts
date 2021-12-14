import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  parts: string[]
  lines: string[]
  template: string
  formulas: any

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    const [template, formulas] = this.file.split('\n\n')
    this.template = template
    this.formulas = formulas.split('\n').map(formula => {
      const [input, output] = formula.split(' -> ')
      return { input, output }
    }).reduce((acc, formula) => {
      const [left, right] = formula.input.split('')
      if (!acc[left]) acc[left] = {}
      acc[left][right] = formula.output
      return acc
    }, {})
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    let result = this.template
    for (let step = 0; step < 10; step++) {
      let newResult = ''
      newResult += result[0]
      for (let i = 0; i < result.length - 1; i++) {
        newResult += this.formulas[result[i]][result[i + 1]] + result[i + 1]
      }
      result = newResult
    }
    const count = this.getCountFromStr(result)
    const minMax = this.getMinMax(count)
    logger.result(count[minMax.max] - count[minMax.min])
  }

  getCountFromStr (str) {
    const count = {}
    for (let i = 0; i < str.length; i++) {
      if (!count[str[i]]) count[str[i]] = 0
      count[str[i]]++
    }
    return count
  }

  getMinMax (count) {
    const minMax = Object.entries(count).reduce((acc, [key, value]) => {
      if (acc.min === null || count[acc.min] > value) {
        acc.min = key
      }
      if (acc.max === null || count[acc.max] < value) {
        acc.max = key
      }
      return acc
    }, { min: null, max: null })
    return minMax
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    let pairs = this.initPairs()
    for (let step = 0; step < 40; step++) {
      pairs = Object.entries(pairs).reduce((acc, [key, value]) => {
        const [left, right] = key.split('')
        const char = this.formulas[left][right]
        if (!acc[left + char]) acc[left + char] = 0
        if (!acc[char + right]) acc[char + right] = 0
        acc[left + char] += value
        acc[char + right] += value
        return acc
      }, {})
    }
    const count = this.getCountFromPairs(pairs)
    const minMax = this.getMinMax(count)
    logger.result(count[minMax.max] - count[minMax.min])
  }

  initPairs () {
    const pairs = {}
    for (let i = 1; i < this.template.length; i++) {
      const key = this.template[i - 1] + this.template[i]
      if (!pairs[key]) pairs[key] = 0
      pairs[key]++
    }
    return pairs
  }

  getCountFromPairs (pairs) {
    const entries = Object.entries(pairs)
    const count = {}
    for (let i = 0; i < entries.length; i++) {
      const [left, right] = entries[i][0].split('')
      if (!count[left]) count[left] = 0
      if (!count[right]) count[right] = 0
      count[left] += entries[i][1]
    }
    count[this.template[this.template.length - 1]]++
    return count
  }
}

const day = '14'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
