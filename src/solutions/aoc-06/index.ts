import { Logger } from '../../lib/log'
import { parseFile } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  fishes: any[]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.fishes = this.file.split(',').map(tmp => +tmp)
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    this.fishes = this.file.split(',').map(tmp => +tmp)
    for (let day = 0; day < 80; day++) {
      const pool = []
      for (let i = 0; i < this.fishes.length; i++) {
        const fish = this.fishes[i]
        if (fish === 0) {
          pool.push(8)
          pool.push(6)
        } else {
          pool.push(fish.rday - 1)
        }
      }
      this.fishes = pool
    }
    const count = this.fishes.length
    logger.result(count)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const currentFish = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.fishes.forEach(fish => {
      currentFish[fish]++
    })
    for (let i = 0; i < 256; i++) {
      const newFish = currentFish.shift()
      currentFish.push(newFish)
      currentFish[6] += newFish
    }
    const count = currentFish.reduce((acc, fish) => acc + fish)
    logger.result(count)
  }
}

const day = '06'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
