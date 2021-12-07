
import { orderBy } from 'lodash'
import { flow, map, range, split, sum } from 'lodash/fp'
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
    const hPositions = parseInput(input)

    const minPos = Math.min(...hPositions)
    const maxPos = Math.max(...hPositions)

    // Lazy way because lodash/fp and TypeScript were not cooperating
    const fuels = orderBy(
      range(minPos, maxPos + 1).map(dest => [dest, sum(hPositions.map(start => Math.abs(start - dest)))]),
      d => d[1]
    )

    return fuels[0][1]
  }
}

const parseInput = flow(
  split(','),
  map(Number)
)
