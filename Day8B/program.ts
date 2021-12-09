import permutations from 'just-permutations'
import { flow, map, split, thru } from 'lodash/fp'
import { performance } from 'perf_hooks'
import { Entry } from './models'

/*
 *   0:      1:      2:      3:      4:
 *  aaaa    ....    aaaa    aaaa    ....
 * b    c  .    c  .    c  .    c  b    c
 * b    c  .    c  .    c  .    c  b    c
 *  ....    ....    dddd    dddd    dddd
 * e    f  .    f  e    .  .    f  .    f
 * e    f  .    f  e    .  .    f  .    f
 *  gggg    ....    gggg    gggg    ....
 *
 *   5:      6:      7:      8:      9:
 *  aaaa    aaaa    aaaa    aaaa    aaaa
 * b    .  b    .  .    c  b    c  b    c
 * b    .  b    .  .    c  b    c  b    c
 *  dddd    dddd    ....    dddd    dddd
 * .    f  e    f  .    f  e    f  .    f
 * .    f  e    f  .    f  e    f  .    f
 *  gggg    gggg    ....    gggg    gggg
*/

const defaultMap = Object.freeze([
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg'
])

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

    let totalOutput = 0
    for (const entry of entries) {
      for (const map of this.generateMappings()) {
        if (checkMap(entry, map)) {
          const output: string = entry.output
            .map(d => getDigit(d, map))
            .join('')
          totalOutput += Number(output)
          break
        }
      }
    }

    return totalOutput
  }

  private * generateMappings (): Generator<Map<string, string>> {
    for (const p of permutations('abcdefg'.split(''))) {
      yield new Map<string, string>([
        ['a', p[0]],
        ['b', p[1]],
        ['c', p[2]],
        ['d', p[3]],
        ['e', p[4]],
        ['f', p[5]],
        ['g', p[6]]
      ])
    }
  }
}

const sortString = (s: string): string => s.split('').sort().join('') // Should have used Set instead...

const applyMap = (s: string, map: Map<string, string>): string => s
  .split('')
  .map(c => map.get(c) ?? 'x')
  .sort()
  .join('')

const checkMap = (entry: Entry, map: Map<string, string>): boolean =>
  entry.input.every(d => defaultMap.includes(applyMap(d, map)))

const getDigit = (s: string, map: Map<string, string>): number =>
  defaultMap.indexOf(sortString(applyMap(s, map)))

/** Split input to a list of lines */
const parseInput = flow(
  split('\n'),
  map(flow(
    split(' | '),
    map(split(' ')),
    thru(([input, output]) => ({ input, output }))
  ))
)
