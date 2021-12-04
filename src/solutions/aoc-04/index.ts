import { Logger } from '../../lib/log'
import { parseFile, parseLine } from '../../lib/parser'

class Resolver {
  day: string
  file: string
  parts: string[]
  numbers: number[]
  cards: any[]

  constructor ({ day, testing }: { day: string, testing: boolean}) {
    this.day = day
    this.file = parseFile(day, testing ? 'test' : 'data')
    this.cards = []
    this.parts = this.file.split('\n\n')
    this.parts.forEach((part, index) => {
      if (index === 0) {
        this.numbers = this.parts[0].split(',').map(nb => +nb)
      } else {
        const lines = part.split('\n')
        this.cards[index - 1] = []
        lines.forEach(line => {
          const { a1, a2, a3, a4, a5 } = parseLine(line, /(?<a1>\d+)\s+(?<a2>\d+)\s+(?<a3>\d+)\s+(?<a4>\d+)\s+(?<a5>\d+)/)
          this.cards[index - 1].push([{ nb: +a1, found: false }, { nb: +a2, found: false }, { nb: +a3, found: false }, { nb: +a4, found: false }, { nb: +a5, found: false }])
        })
      }
    })
  }

  solve1 () {
    const logger = new Logger(`Day${this.day}-1`)
    for (let nbIndex = 0; nbIndex < this.numbers.length; nbIndex++) {
      const nb = this.numbers[nbIndex]
      for (let player = 0; player < this.cards.length; player++) {
        const card = this.cards[player]
        for (let y = 0; y < card.length; y++) {
          const line = card[y]
          for (let x = 0; x < line.length; x++) {
            const place = line[x]
            if (nb === place.nb) {
              place.found = true
              if (this.checkWin(card, x, y)) {
                logger.result(nb * this.computeScore(card))
                return
              }
            }
          }
        }
      }
    }
  }

  checkWin (card, x, y) {
    return this.checkWinRow(card, y) || this.checkWinColumn(card, x)
  }

  checkWinRow (card, y) {
    for (let xx = 0; xx < 5; xx++) {
      if (!card[y][xx].found) {
        return false
      }
    }
    return true
  }

  checkWinColumn (card, x) {
    for (let yy = 0; yy < 5; yy++) {
      if (!card[yy][x].found) {
        return false
      }
    }
    return true
  }

  computeScore (card) {
    return card.reduce((lineAcc, line) => {
      return lineAcc + line.reduce((nbAcc, place) => {
        if (place.found) return nbAcc
        return nbAcc + place.nb
      }, 0)
    }, 0)
  }

  solve2 () {
    const logger = new Logger(`Day${this.day}-2`)
    const cards = this.cards
    for (let nbIndex = 0; nbIndex < this.numbers.length; nbIndex++) {
      const nb = this.numbers[nbIndex]
      for (let player = 0; player < cards.length; player++) {
        const card = cards[player]
        for (let y = 0; y < card.length; y++) {
          const line = card[y]
          for (let x = 0; x < line.length; x++) {
            const place = line[x]
            if (nb === place.nb) {
              place.found = true
              if (this.checkWin(card, x, y)) {
                if (cards.length === 1) {
                  logger.result(nb * this.computeScore(card))
                  return
                }
                cards.splice(player--, 1)
              }
            }
          }
        }
      }
    }
  }
}

const day = '04'
const testing = false

const resolver = new Resolver({ day, testing })
resolver.solve1()
resolver.solve2()
