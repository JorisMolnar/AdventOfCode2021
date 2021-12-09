import { flow, map, split, sum, thru } from 'lodash/fp'
import { performance } from 'perf_hooks'
import { Point } from './models'

export class Program {
  main (input: string): void {
    const t0 = performance.now()
    const result = this.calcResult(input)
    const t1 = performance.now()
    console.log(`Calc took ${t1 - t0} milliseconds.`)
    console.log('Answer:', result)
  }

  private calcResult (input: string): number {
    const floor: number[][] = parseInput(input)

    const lowPoints: Point[] = []
    for (let y = 0; y < floor.length; y++) {
      for (let x = 0; x < floor[y].length; x++) {
        const curr = floor[y][x]
        const top = floor[y - 1]?.[x] ?? 10 // Because of the input, no value can be higher than 9
        const bottom = floor[y + 1]?.[x] ?? 10
        const left = floor[y][x - 1] ?? 10
        const right = floor[y][x + 1] ?? 10

        if (curr < top && curr < bottom && curr < left && curr < right) {
          lowPoints.push({ x, y })
        }
      }
    }

    const totalRiskLevel = flow(
      map((p: Point) => floor[p.y][p.x] + 1),
      sum
    )(lowPoints)

    return totalRiskLevel
  }
}

const parseInput = flow(
  split('\n'),
  map(flow(
    split(''),
    map(Number)
  ))
)
