
import { flow, map, split } from 'lodash/fp'
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
    const fishes = parseInput(input)

    for (let day = 0; day < 80; day++) {
      this.doCompleteDay(fishes)
    }

    return fishes.length
  }

  private doCompleteDay (fishes: number[]): void {
    const newFishes: number[] = []
    for (let i = 0; i < fishes.length; i++) {
      if (fishes[i] === 0) {
        newFishes.push(8)
        fishes[i] = 6
      } else {
        fishes[i] = fishes[i] - 1
      }
    }

    fishes.push(...newFishes)
  }
}

const parseInput = flow(
  split(','),
  map(Number)
)
