import { countBy, groupBy } from 'lodash'
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

    let g = ''
    let y = ''

    for (let i = 0; i < values[0].length; i++) {
      const c = countBy(values.map(v => v[i]))

      if (c['0'] > c['1']) {
        g += '0'
        y += '1'
      } else {
        g += '1'
        y += '0'
      }
    }

    return parseInt(g, 2) * parseInt(y, 2)
  }

  private parseInput (input: string): string[] {
    return input.split('\n')
  }
}
