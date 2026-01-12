// Mock implementation for @db/index
// This module exports a mutable db object that tests can configure

interface MockSelectChain {
  from: () => MockSelectChain
  innerJoin: () => MockSelectChain
  where: () => MockSelectChain | Promise<unknown[]>
  limit: () => Promise<unknown[]>
}

interface MockDb {
  select: () => MockSelectChain
  _setMockSelect: (fn: () => MockSelectChain) => void
}

let mockSelectFn: () => MockSelectChain = () => ({
  from: function () {
    return this
  },
  innerJoin: function () {
    return this
  },
  where: function () {
    return this
  },
  limit: async () => [],
})

export const db: MockDb = {
  select: () => mockSelectFn(),
  _setMockSelect: (fn: () => MockSelectChain) => {
    mockSelectFn = fn
  },
}

export const pool = {
  query: async () => ({ rows: [] }),
  end: async () => {},
}
