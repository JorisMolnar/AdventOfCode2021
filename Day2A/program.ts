import { groupBy, sumBy } from 'lodash'
import { performance } from 'perf_hooks'
import { Move } from './models'

export class Program {
  main (input: string): void {
    const t0 = performance.now()
    const result = this.calcResult(input)
    const t1 = performance.now()

    console.log(`Calc took ${t1 - t0} milliseconds.`)
    console.log('Answer:', result)
  }

  private calcResult (input: string): number {
    const moves = this.parseInput(input)

    const groups = groupBy(moves, 'dir')

    const forward = sumBy(groups.forward, 'amount')
    const up = sumBy(groups.up, 'amount')
    const down = sumBy(groups.down, 'amount')

    return forward * (down - up)
  }

  private parseInput (input: string): Move[] {
    return input.split('\n')
      .map(s => s.split(' '))
      .map(s => ({ dir: s[0], amount: Number(s[1]) }))
  }
}
