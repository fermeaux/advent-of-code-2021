import { reverseMap } from '../../lib/helper'
import { Logger } from '../../lib/log'
import { parseFile, parseLine } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  pairs = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>'
  }

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const points = {
      ')': 3,
      ']': 57,
      '}': 1197,
      '>': 25137
    }
    const result = this.lines.reduce((acc, line) => {
      const chars = line.split('')
      const stack = []
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        if (this.pairs[char] != null) {
          stack.push(char)
        } else if (this.pairs[stack[stack.length - 1]] === char) {
          stack.pop()
        } else {
          return acc + points[char]
        }
      }
      return acc
    }, 0)
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const points = {
      ')': 1,
      ']': 2,
      '}': 3,
      '>': 4
    }
    const result = this.lines.reduce((acc, line) => {
      const chars = line.split('')
      let stack = []
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i]
        if (this.pairs[char] != null) {
          stack.push(char)
        } else if (this.pairs[stack[stack.length - 1]] === char) {
          stack.pop()
        } else {
          return acc
        }
      }
      stack = stack.reverse()
      const count = stack.reduce((accStack, char) => {
        return accStack * 5 + points[this.pairs[char]]
      }, 0)
      acc.push(count)
      return acc
    }, [])
    result.sort((a, b) => a - b)
    logger.result(result[Math.floor(result.length / 2)])
  }
}

const day = '10'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
