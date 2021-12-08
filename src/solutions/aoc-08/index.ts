import { groupBy, isOneOf, matchAllCharacters, removeElement, reverseMap, sortCharacters, sortStringKeys } from '../../lib/helper'
import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  lines: string[]
  values: [string[], string[]][]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.lines = this.file.split('\n')
    this.values = this.lines
      .map(line => line.split(' | '))
      .map(([signals, outputs]) => ([signals.split(' '), outputs.split(' ')]))
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    const result = this.values.reduce((acc, [_, outputs]) => {
      return acc + outputs.reduce((accOutputs, output) => {
        if (isOneOf(output.length, [2, 3, 4, 7])) {
          accOutputs++
        }
        return accOutputs
      }, 0)
    }, 0)
    logger.result(result)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const result = this.values.reduce((acc, [signals, outputs]) => {
      const amountSide = signals.reduce((accSide, signal) => {
        signal.split('').forEach(signalChar => {
          if (!accSide[signalChar]) {
            accSide[signalChar] = 0
          }
          accSide[signalChar]++
        })
        return accSide
      }, {})
      const strByLength = groupBy(signals, 'length')
      let decoded: Record<any, any> = {
        1: signals.find(signal => signal.length === 2),
        4: signals.find(signal => signal.length === 4),
        7: signals.find(signal => signal.length === 3),
        8: signals.find(signal => signal.length === 7)
      }
      const [key2] = Object.entries(amountSide).find(([_, value]) => value === 9)
      decoded[2] = signals.find(signal => !signal.includes(key2))
      removeElement(strByLength[5], decoded[2])
      decoded[5] = strByLength[5].find(side => !(matchAllCharacters(side, decoded[1])))
      removeElement(strByLength[5], decoded[5])
      decoded[3] = strByLength[5][0]
      decoded[6] = strByLength[6].find(side => !(matchAllCharacters(side, decoded[1])))
      removeElement(strByLength[6], decoded[6])
      decoded[0] = strByLength[6].find(side => !(matchAllCharacters(side, decoded[4])))
      removeElement(strByLength[6], decoded[0])
      decoded[9] = strByLength[6][0]
      decoded = reverseMap(decoded)
      decoded = sortStringKeys(decoded)
      const str = outputs.reduce((accOutputs, output) => {
        output = sortCharacters(output)
        return accOutputs + `${decoded[output]}`
      }, '')
      return acc + +str
    }, 0)
    logger.result(result)
  }
}

const day = '08'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
