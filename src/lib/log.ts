export class Logger {
  private context: string

  constructor (context: string) {
    this.context = context
    this.start()
  }

  info (...message: any[]): void {
    console.log('# ', ...message)
  }

  result (result: string | number): void {
    console.log('#                                                          #')
    const resultDisplayed = `${this.context} = ${result}`
    const spaces = ' '.repeat(Math.max(0, 56 - resultDisplayed.length))
    console.log(`# ${resultDisplayed}${spaces} #`)
    this.printBar()
  }

  private start (): void {
    this.printBar()
    const nbSpace = Math.max(0, (56 - this.context.length) / 2)
    const spaceBefore = ' '.repeat(Math.floor(nbSpace))
    const spaceAfter = ' '.repeat(Math.ceil(nbSpace))
    console.log(`# ${spaceBefore}${this.context}${spaceAfter} #`)
  }

  printBar (): void {
    console.log('############################################################')
  }
}
