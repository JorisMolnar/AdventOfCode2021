
import { range } from 'lodash'
import { countBy, flow, map, split, sum, thru } from 'lodash/fp'
import { performance } from 'perf_hooks'
import { Fishes } from './models'

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

    for (let day = 0; day < 256; day++) {
      this.doCompleteDay(fishes)
    }

    return countFishies(fishes)
  }

  private doCompleteDay (fishes: Fishes): void {
    const freshFish = fishes.get(0) ?? 0

    for (let i = 0; i < 8; i++) {
      fishes.set(i, fishes.get(i + 1) ?? 0)
    }

    fishes.set(6, freshFish + (fishes.get(6) ?? 0))
    fishes.set(8, freshFish)
  }
}

const parseInput: (s: string) => Fishes = flow(
  split(','),
  map(Number),
  countBy(x => x),
  thru(fishGroups => {
    const fishes: Fishes = new Map<number, number>(range(0, 9).map(n => [n, 0]))
    for (const fishGroup of Object.entries(fishGroups)) {
      fishes.set(Number(fishGroup[0]), fishGroup[1])
    }
    return fishes
  })
)

const countFishies = (f: Fishes): number => sum(Array.from(f.values()))
