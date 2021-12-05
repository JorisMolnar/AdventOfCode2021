import { countBy, filter, flatten, flow, map, pickBy, range, split, thru, toPairs } from 'lodash/fp'
import { performance } from 'perf_hooks'
import { Line, Point } from './models'

export class Program {
  main (input: string): void {
    const t0 = performance.now()
    const result = this.calcResult(input)
    const t1 = performance.now()
    console.log(`Calc took ${t1 - t0} milliseconds.`)
    console.log('Answer:', result)
  }

  private calcResult (input: string): number {
    const lines = parseCleanInput(input)
    const unsafePoints = flow(
      mapToPoints,
      flatten,
      countBy(p => `${p.x},${p.y}`),
      pickBy(c => c > 1),
      toPairs
    )(lines)

    return unsafePoints.length
  }
}

/** NOTE: Assumes `a` to have the smaller coordinates */
function toPoints (l: Line): Point[] {
  if (isHorizontal(l)) {
    return range(l.a.x, l.b.x + 1).map(x => ({ x, y: l.a.y }))
  } else {
    return range(l.a.y, l.b.y + 1).map(y => ({ x: l.a.x, y }))
  }
}

const isHorizontal = (l: Line): boolean => l.a.y === l.b.y
const isVertical = (l: Line): boolean => l.a.x === l.b.x

/** Returns true if line is either horizontal or vertical */
const filterManhattan = filter((l: Line): boolean => isHorizontal(l) || isVertical(l))
const mapToPoints = map(toPoints)

/** Split input to a list of lines */
const parseInput = flow(
  split('\n'),
  map(flow(
    split(' -> '),
    map(flow(
      split(','),
      map(Number)
    )),
    map(([x, y]) => ({ x, y }))
  )),
  map(([a, b]) => ({ a, b }))
)

/** Parse input, filtering only horizontal and vertical lines and ordering `a` and `b` to always be ascending */
const parseCleanInput = flow(
  thru(parseInput),
  filterManhattan,
  map((l: Line): Line =>
    (l.a.x > l.b.x || l.a.y > l.b.y)
      ? { a: l.b, b: l.a } // swap a and b
      : l
  )
)
