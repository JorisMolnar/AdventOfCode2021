import { filter, flow, map, orderBy, sortBy, split, sum, thru } from 'lodash/fp'
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
    const lines = parseInput(input)

    const score = flow(
      map(this.autocomplete),
      filter(s => s !== null),
      map(calcScore),
      sortBy(s => s),
      thru(getMiddle)
    )(lines)

    return score
  }

  private autocomplete (line: string): string[] | null {
    const openChunks: string[] = []

    for (const c of line) {
      if (isOpen(c)) {
        openChunks.push(c)
      } else {
        if (isMatch(openChunks.slice(-1)[0], c)) {
          openChunks.pop()
        } else {
          return null // corrupt
        }
      }
    }

    return openChunks.reverse()
  }
}

const isOpen = (s: string): boolean => ['(', '[', '{', '<'].includes(s)
const getMiddle = <T>(a: T[]): T => a[Math.floor(a.length / 2)]

const calcScore = (auto: string[]): number => auto.reduce(
  (prev: number, curr: string) => {
    prev *= 5
    switch (curr) {
      case '(':
        prev += 1
        break
      case '[':
        prev += 2
        break
      case '{':
        prev += 3
        break
      case '<':
        prev += 4
        break
      default:
        throw new Error('Unrecognized char')
    }
    return prev
  },
  0
)

function isMatch (open: string, close: string): boolean {
  switch (open) {
    case '(':
      return close === ')'
    case '[':
      return close === ']'
    case '{':
      return close === '}'
    case '<':
      return close === '>'
    default:
      throw new Error('Unrecognized char')
  }
}

/** Split input to a list of lines */
const parseInput = split('\n')
