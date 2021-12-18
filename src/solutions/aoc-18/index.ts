import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: any

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    let line = this.lines[0]
    for (let fishI = 1; fishI < this.lines.length; fishI++) {
      line = `[${line},${this.lines[fishI]}]`
      let isDirty = true
      while (isDirty) {
        isDirty = false
        const leftBracketStack = []
        for (let i = 0; i < line.length; i++) {
          if (line[i] === '[') {
            leftBracketStack.push(i)
          } else if (line[i] === ']') {
            const leftBracketI = leftBracketStack.pop()
            if (leftBracketStack.length >= 4) {
              let left = line.substring(0, leftBracketI)
              const middle = line.substring(leftBracketI + 1, i)
              let right = line.substring(i + 1, line.length)

              const [leftAdd, rightAdd] = middle.split(',')
              left = this.addLeft(left, +leftAdd)
              right = this.addRight(right, +rightAdd)
              line = `${left}0${right}`
              isDirty = true
              break
            }
          }
        }
        if (isDirty) continue
        if (line.match(/[0-9][0-9]+/) !== null) {
          const parsedNb = parseInt(line.match(/([0-9][0-9]+)/), 10)
          line = line.replace(/[0-9][0-9]+/, `[${Math.floor(parsedNb / 2)},${Math.ceil(parsedNb / 2)}]`)
          isDirty = true
        }
      }
    }
    while (line.match(/,/)) {
      line = line.replace(/\[([0-9]+),([0-9]+)\]/, (_, left, right) => `${+left * 3 + +right * 2}`)
    }
    logger.result(line)
  }

  addLeft (line, add) {
    return line.replace(/[0-9]+(?!.*[0-9])/, parseInt(line.match(/[0-9]+(?!.*[0-9])/), 10) + add)
  }

  addRight (line, add) {
    return line.replace(/[0-9]+/, parseInt(line.match(/[0-9]+/), 10) + add)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)

    let bestPair = null
    for (let i = 0; i < this.lines.length - 1; i++) {
      for (let j = i + 1; j < this.lines.length; j++) {
        let pair = this.computePair(this.lines[i], this.lines[j])
        if (bestPair === null || bestPair.score < pair.score) {
          bestPair = pair
        }
        pair = this.computePair(this.lines[j], this.lines[i])
        if (bestPair === null || bestPair.score < pair.score) {
          bestPair = pair
        }
      }
    }
    logger.result(bestPair.score)
  }

  computePair (left, right) {
    let line = `[${left},${right}]`
    const pair: { score: number, line: string } = { line, score: 0 }
    let isDirty = true
    while (isDirty) {
      isDirty = false
      const leftBracketStack = []
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '[') {
          leftBracketStack.push(i)
        } else if (line[i] === ']') {
          const leftBracketI = leftBracketStack.pop()
          if (leftBracketStack.length >= 4) {
            let left = line.substring(0, leftBracketI)
            const middle = line.substring(leftBracketI + 1, i)
            let right = line.substring(i + 1, line.length)

            const [leftAdd, rightAdd] = middle.split(',')
            left = this.addLeft(left, +leftAdd)
            right = this.addRight(right, +rightAdd)
            line = `${left}0${right}`
            isDirty = true
            break
          }
        }
      }
      if (isDirty) continue
      if (line.match(/[0-9][0-9]+/) !== null) {
        const parsedNb = parseInt(line.match(/([0-9][0-9]+)/), 10)
        line = line.replace(/[0-9][0-9]+/, `[${Math.floor(parsedNb / 2)},${Math.ceil(parsedNb / 2)}]`)
        isDirty = true
      }
    }
    while (line.match(/,/)) {
      line = line.replace(/\[([0-9]+),([0-9]+)\]/, (_, left, right) => `${+left * 3 + +right * 2}`)
    }
    pair.score = +line
    return pair
  }
}

const day = '18'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
