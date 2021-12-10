import { filter, flow, map, split, sum } from 'lodash/fp'
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
      map(this.findCorruption),
      filter(s => s !== null),
      map(c => {
        switch (c) {
          case ')':
            return 3
          case ']':
            return 57
          case '}':
            return 1197
          case '>':
            return 25137
        }
      }),
      sum
    )(lines)

    return score
  }

  private findCorruption (line: string): string | null {
    const openChunks: string[] = []

    for (const c of line) {
      if (isOpen(c)) {
        openChunks.push(c)
      } else {
        if (isMatch(openChunks.slice(-1)[0], c)) {
          openChunks.pop()
        } else {
          return c
        }
      }
    }

    return null
  }
}

const isOpen = (s: string): boolean => ['(', '[', '{', '<'].includes(s)

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
