const randomState = () => Math.floor(Math.random() * (1 - 0 + 1))

const cell = randomState

const alive = (cell) => cell === 1

const stateAlive = () => '●'

const stateDead = () => '○'

const cellToString = ifElse(alive, stateAlive, stateDead)

const rowToString = compose(join(''), map(cellToString))

const universeToString = compose(join('\n'), map(rowToString))

const createRow = (width) => {
  return gt(width, 0)
    ? [cell(), ...createRow(dec(width))]
    : []
}

const createUniverse = (width, height) => {
  return gt(height, 0)
    ? [createRow(width), ...createUniverse(width, dec(height))]
    : []
}

const universeWidth = (universe) => universe[0].length

const universeHeight = (universe) => universe.length

const ltZero = gt(0)

const wrapsTop = compose(ltZero, add)

const bottomWrap = (offset, y, height) =>
  add(y, offset.y) > dec(height)

const wrapsLeft = compose(ltZero, add)

const rightWrap = (offset, x, width) =>
  add(x, offset.x) > dec(width)

const neighbourY = (offset, y, height) =>
  wrapsTop(offset.y, y)
    ? dec(height)
    : (bottomWrap(offset, y, height)
        ? 0
        : add(y, offset.y))

const neighbourX = (offset, x, width) =>
  wrapsLeft(offset.x, x)
    ? dec(width)
    : (rightWrap(offset, x, width)
        ? 0
        : add(x, offset.x))

const getNeighbourCoords = (universe, x, y, offset) => {
  const width = universeWidth(universe)
  const height = universeHeight(universe)

  return {
    x: neighbourX(offset, x, width),
    y: neighbourY(offset, y, height)
  }
}

const neighbours = (universe, x, y) => {
  const neighbourOffsets = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 0, y: 1},
    {x: -1, y: 1},
    {x: -1, y: 0}
  ]

  return map((offset) => {
    const neighbourCoords = getNeighbourCoords(universe, x, y, offset)

    return universe[neighbourCoords.y][neighbourCoords.x]
  }, neighbourOffsets)
}

const neighboursAlive = compose(filter(alive), neighbours)

const noOfNeighboursAlive = compose(prop('length'), neighboursAlive)

const getCell = (universe, x, y) => universe[y][x]

const underPolulation = (noOfNeighboursAlive) => {
  return lt(noOfNeighboursAlive, 2)
}

const overPopulation = (noOfNeighboursAlive) => {
  return gt(noOfNeighboursAlive, 3)
}

const normalPopulation = (noOfNeighboursAlive) => {
  return !underPolulation(noOfNeighboursAlive) && !overPopulation(noOfNeighboursAlive)
}

const dies = (alive, noOfNeighboursAlive) => {
  return alive && !normalPopulation(noOfNeighboursAlive)
}

const reborn = (alive, noOfNeighboursAlive) => {
  return and(!alive, equals(noOfNeighboursAlive, 3))
}

const livesOn = (alive, noOfNeighboursAlive) => {
  return and(
    alive,
    or(
      equals(noOfNeighboursAlive, 2),
      equals(noOfNeighboursAlive, 3)
    )
  )
}

const isAlive = compose(alive, getCell)

const advanceCell = (universe, x, y) => {
  // Will die because of under-population
  const state1 = dies(isAlive(universe, x, y), noOfNeighboursAlive(universe, x, y))

  // Will live on
  const state2 = livesOn(isAlive(universe, x, y), noOfNeighboursAlive(universe, x, y))

  // Will be reborn as if by reproduction
  const state3 = reborn(isAlive(universe, x, y), noOfNeighboursAlive(universe, x, y))

  return (!state1 && (state2 || state3)) ? 1 : 0
}

const advanceUniverse = (universe) => {
  const width = universeWidth(universe)
  const height = universeHeight(universe)

  const next = createUniverse(width, height)
    .map((row, y) => row.map((cell, x) => advanceCell(universe, x, y)))

  return next
}

export { advanceUniverse, createUniverse, universeToString }
