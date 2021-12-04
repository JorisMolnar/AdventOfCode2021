import { flow, sum, flatten, filter, map, every, some, range, tap, eq } from 'lodash/fp'
import { performance } from 'perf_hooks'
import { Board, Field } from './models'

export class Program {
  main (input: string): void {
    const t0 = performance.now()
    const result = this.calcResult(input)
    const t1 = performance.now()
    console.log(`Calc took ${t1 - t0} milliseconds.`)
    console.log('Answer:', result)
  }

  private readonly checkLine = every((f: Field) => f.marked)

  private readonly isWin = flow(
    (b: Board) => [...b, ...range(0, 5).map(i => b.map(row => row[i]))], // Create rows and columns
    map(this.checkLine),
    some(x => x)
  )

  private readonly sumBoard = flow(
    flatten,
    filter((f: Field) => !f.marked),
    map(f => f.value),
    sum
  )

  private readonly calculateScore = (b: Board, d: number): number => this.sumBoard(b) * d

  private calcResult (input: string): number {
    const { draws, boards } = this.parseInput(input)

    const boardsWon: Board[] = []
    for (const draw of draws) {
      for (const board of boards) {
        this.applyDraw(board, draw)

        if (this.isWin(board) && !boardsWon.includes(board)) {
          boardsWon.push(board)

          if (boardsWon.length === boards.length) {
            return this.calculateScore(board, draw)
          }
        }
      }
    }

    throw new Error('No boards won!')
  }

  private applyDraw (board: Board, draw: number): void {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x].value === draw) {
          board[y][x].marked = true
        }
      }
    }
  }

  private parseInput (input: string): {
    draws: number[]
    boards: Board[]
  } {
    const data = input.split('\n\n')
    const draws = data.shift()?.split(',').map(Number) ?? []

    const boards: Board[] = data
      .map(b => b
        .split('\n')
        .map(row => row
          .trim()
          .split(/\s+/)
          .map(f => ({ value: Number(f), marked: false }))))

    return { draws, boards }
  }
}
