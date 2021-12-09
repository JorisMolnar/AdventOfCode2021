import { countBy, filter, flatten, flow, map, pickBy, range, reduce, split, thru, toPairs } from 'lodash/fp'
import { performance } from 'perf_hooks'
import { Entry } from './models'
import { log } from './util/fp'

export class Program {
  main (input: string): void {
    const t0 = performance.now()
    const result = this.calcResult(input)
    const t1 = performance.now()
    console.log(`Calc took ${t1 - t0} milliseconds.`)
    console.log('Answer:', result)
  }

  private calcResult (input: string): number {
    const entries: Entry[] = parseInput(input)

    const count = flow(
      map((e: Entry) => e.output),
      flatten,
      filter(d => [2, 3, 4, 7].includes(d.length)),
      reduce((prev) => prev + 1, 0)
    )(entries)

    return count
  }
}

/** Split input to a list of lines */
const parseInput = flow(
  split('\n'),
  map(flow(
    split(' | '),
    map(split(' ')),
    thru(([input, output]) => ({ input, output }))
  )),
  log
)
