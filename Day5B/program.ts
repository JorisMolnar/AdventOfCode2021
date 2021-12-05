
import { countBy, flatten, flow, map, pickBy, range, split, thru, toPairs } from 'lodash/fp'
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
      countBy(p => `${p.x},${p.y}`), // Proof that JavaScript isn't the best choice
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
  } else if (isVertical(l)) {
    return range(l.a.y, l.b.y + 1).map(y => ({ x: l.a.x, y }))
  } else if (isDiagonalUp(l)) {
    // Easy, just increment both
    return range(0, l.b.x - l.a.x + 1).map(delta => ({ x: l.a.x + delta, y: l.a.y + delta }))
  } else { // isDiagonalDown
    // Keep in mind to decrement Y
    return range(0, l.b.x - l.a.x + 1).map(delta => ({ x: l.a.x + delta, y: l.a.y - delta }))
  }
}

const isHorizontal = (l: Line): boolean => l.a.y === l.b.y
const isVertical = (l: Line): boolean => l.a.x === l.b.x
const isDiagonalUp = (l: Line): boolean => !isHorizontal(l) && !isVertical(l) && l.a.y < l.b.y

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

const cleanLine = (l: Line): Line =>
  (l.a.x > l.b.x || (l.a.y > l.b.y && isVertical(l)))
    ? { a: l.b, b: l.a } // swap a and b
    : l

/**
 * Parse input and ordering `a` and `b` to always be ascending, giving priority
 * to X-coordinate for diagonal lines. (So diagonal lines will always have
 * ascending X, but _might have_ descending Y)
 */
const parseCleanInput = flow(
  thru(parseInput),
  map(cleanLine)
)
