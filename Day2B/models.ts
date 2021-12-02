export interface Move {
  dir: Dir
  amount: number
}

export type Dir = 'forward' | 'down' | 'up'
