import { dec2bin } from '../../lib/helper'
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
    const decoded = this.file.split('').map(char => dec2bin(parseInt(char, 16)).padStart(4, '0')).join('')
    const subpackets = {
      0: { values: [], version: 0 }
    }
    let i = 0
    let currentSubpacket = 0
    let maxSubpacketLength = 0
    let countSubPacket = 0
    while (i < decoded.length - 6) {
      const v = parseInt(decoded.slice(i, i + 3), 2)
      const t = parseInt(decoded.slice(i + 3, i + 6), 2)
      i += 6
      if (t === 4) {
        let nbStr = ''
        do {
          i += 5
          nbStr += decoded.slice(i - 4, i)
        } while (i < decoded.length && decoded[i - 5] !== '0')
        countSubPacket++
        if (countSubPacket > maxSubpacketLength) {
          currentSubpacket = 0
          maxSubpacketLength = 0
          countSubPacket = 0
        }
        subpackets[currentSubpacket].values.push({ version: v, value: parseInt(nbStr, 2) })
      } else {
        const lengthTypeId = decoded[i++] === '0' ? 15 : 11
        maxSubpacketLength = parseInt(decoded.slice(i, i + lengthTypeId), 2)
        i += lengthTypeId
        currentSubpacket = i
        countSubPacket = 0
        subpackets[currentSubpacket] = { version: v, values: [] }
      }
    }
    logger.result(Object.values(subpackets).reduce((acc, subpacket) => {
      return acc + subpacket.version + subpacket.values.reduce((acc2, tmp) => {
        return acc2 + tmp.version
      }, 0)
    }, 0))
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const decoded = this.file.split('').map(char => dec2bin(parseInt(char, 16)).padStart(4, '0')).join('')
    const root = { values: [], type: 0, max: 1000 }
    let i = 0
    while (i < decoded.length - 6) {
      const v = parseInt(decoded.slice(i, i + 3), 2)
      const t = parseInt(decoded.slice(i + 3, i + 6), 2)
      i += 6
      if (t === 4) {
        let nbStr = ''
        do {
          i += 5
          nbStr += decoded.slice(i - 4, i)
        } while (i < decoded.length && decoded[i - 5] !== '0')
        const parent = this.findPacket(root)
        parent.values.push({ value: parseInt(nbStr, 2), type: t })
      } else {
        const lengthTypeId = decoded[i++] === '0' ? 15 : 11
        const max = parseInt(decoded.slice(i, i + lengthTypeId), 2)
        logger.info(t, max)
        i += lengthTypeId
        const parent = this.findPacket(root)
        parent.values.push({ values: [], type: t, max })
      }
    }
    // logger.info(JSON.stringify(root))
    logger.result(this.computeValue(root))
  }

  findPacket (packet) {
    if (packet.values.length > 0) {
      const searched = packet.values.find(tmp => tmp.type !== 4 && tmp.values.length < tmp.max)
      if (searched) return this.findPacket(searched)
    }
    return packet
  }

  computeValue (packet) {
    let output = 0
    if (packet.type === 0) {
      output = packet.values.reduce((acc2, tmp) => {
        const value = tmp.type === 4 ? tmp.value : this.computeValue(tmp)
        return acc2 + value
      }, 0)
    }
    if (packet.type === 1) {
      output = packet.values.reduce((acc2, tmp) => {
        const value = tmp.type === 4 ? tmp.value : this.computeValue(tmp)
        return acc2 * value
      }, 1)
    }
    if (packet.type === 2) {
      output = Math.min(...packet.values.map(tmp => {
        const value = tmp.type === 4 ? tmp.value : this.computeValue(tmp)
        return value
      }))
    }
    if (packet.type === 3) {
      output = Math.max(...packet.values.map(tmp => {
        const value = tmp.type === 4 ? tmp.value : this.computeValue(tmp)
        return value
      }))
    }
    if (packet.type === 5) {
      console.log(packet)
      const left = packet.values[0].type === 4 ? packet.values[0].value : this.computeValue(packet.values[0])
      const right = packet.values[1].type === 4 ? packet.values[1].value : this.computeValue(packet.values[1])
      output = left > right ? 1 : 0
    }
    if (packet.type === 6) {
      const left = packet.values[0].type === 4 ? packet.values[0].value : this.computeValue(packet.values[0])
      const right = packet.values[1].type === 4 ? packet.values[1].value : this.computeValue(packet.values[1])
      output = left < right ? 1 : 0
    }
    if (packet.type === 7) {
      const left = packet.values[0].type === 4 ? packet.values[0].value : this.computeValue(packet.values[0])
      const right = packet.values[1].type === 4 ? packet.values[1].value : this.computeValue(packet.values[1])
      output = left === right ? 1 : 0
    }
    return output
  }
}

const day = '16'
const testing = false

const resolver = new Resolver({ day, testing })
// resolver.solve1()
resolver.solve2()
