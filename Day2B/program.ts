import { performance } from 'perf_hooks'
import { Dir, Move } from './models'

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

    let x = 0
    let y = 0
    let aim = 0

    for (const m of moves) {
      switch (m.dir) {
        case 'down':
          aim += m.amount
          break
        case 'up':
          aim -= m.amount
          break
        case 'forward':
          x += m.amount
          y += aim * m.amount
          break

        default:
          break
      }
    }

    return x * y
  }

  private parseInput (input: string): Move[] {
    return input.split('\n')
      .map(s => s.split(' '))
      .map(s => ({ dir: s[0] as Dir, amount: Number(s[1]) }))
  }
}
