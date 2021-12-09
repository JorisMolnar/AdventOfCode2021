import { flow, map, orderBy, reduce, split, take } from 'lodash/fp'
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

    const lowPoints = this.findLowPoints(floor)
    const answer = flow(
      map((p: Point) => this.getBasinSize(p, floor)),
      orderBy((s: number) => s, 'desc'),
      take(3),
      reduce((a: number, b: number) => a * b, 1)
    )(lowPoints)

    return answer
  }

  private getBasinSize (low: Point, floor: number[][]): number {
    const basin = new Set<string>()

    function getNeighbours (p: Point): void {
      traversePoint({ x: p.x, y: p.y - 1 }) // Top
      traversePoint({ x: p.x, y: p.y + 1 }) // Bottom
      traversePoint({ x: p.x - 1, y: p.y }) // Left
      traversePoint({ x: p.x + 1, y: p.y }) // Right
    }

    function traversePoint (p: Point): void {
      if (basin.has(`${p.x},${p.y}`)) return

      if (getHeight(p) !== 9) {
        basin.add(`${p.x},${p.y}`)
        getNeighbours(p)
      }
    }

    const getHeight = (p: Point): number => floor[p.y]?.[p.x] ?? 9 // Walls should be 9 too

    getNeighbours(low)
    return basin.size
  }

  private findLowPoints (floor: number[][]): Point[] {
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
    return lowPoints
  }
}

const parseInput = flow(
  split('\n'),
  map(flow(
    split(''),
    map(Number)
  ))
)
