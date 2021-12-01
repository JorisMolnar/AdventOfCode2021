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
    const numbers = this.parseInput(input)

    let count = 0
    for (let i = 0; i < numbers.length - 1; i++) {
      const [n1, n2] = numbers.slice(i)
      if (n2 > n1) count++
    }

    console.log(count)
    return count
  }

  private parseInput (input: string): number[] {
    return input.split('\n').map(s => Number(s))
  }
}
