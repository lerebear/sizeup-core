export class Stack {
  store: number[]

  constructor() {
    this.store = []
  }

  push(elem: number): number {
    return this.store.push(elem)
  }

  peek(): number | undefined {
    return this.store[this.store.length - 1]
  }

  pop(): number | undefined {
    return this.store.pop()
  }

  size(): number {
    return this.store.length
  }
}
