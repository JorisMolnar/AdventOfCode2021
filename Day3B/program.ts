import { countBy } from 'lodash'
import { performance } from 'perf_hooks'

export class Program {
  main (input: string): void {
    const t0 = performance.now()
    const result = this.calcResult(input)
    const t1 = performance.now()

    console.log(`Calc took ${t1 - t0} milliseconds.`)
    console.log('Answer:', result)
  }

  private calcResult (input: string): number {
    const values = this.parseInput(input)

    const o2 = this.findRating(values, false)
    const co2 = this.findRating(values, true)

    return parseInt(o2, 2) * parseInt(co2, 2)
  }

  private findRating(values: string[], flipBit: boolean): string {
    for (let i = 0; i < values[0].length; i++) {
      let crit = this.determineMostCommon(values.map(v => v[i]))

      if (flipBit){
        crit = this.reverseBit(crit);
      }

      values = values.filter(v => v[i] === crit)
      if (values.length === 1) break
    }

    return values[0]
  }

  private determineMostCommon(bits: string[]): '0' | '1' {
    const c = countBy(bits)
    return (c['0'] > c['1']) ? '0' : '1'
  }

  private reverseBit(bit: '0' | '1'): '0' | '1' {
    return bit === '0' ? '1' : '0'
  }

  private parseInput (input: string): string[] {
    return input.split('\n')
  }
}
