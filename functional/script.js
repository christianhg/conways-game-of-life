const width = 100
const height = 60
const stateAlive = '●'
const stateDead = '○'
const speed = 150
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

function init () {
  const universe = createUniverse(width, height)
  return window.setTimeout(nextGeneration, speed, 0, universe)
}

function createUniverse (x, y) {
  return [...createRows([], x, y)]
}

function createRows (rows, x, y) {
  return y > 0
    ? [createCells([], x, y), ...createRows(rows, x, y - 1)]
    : rows
}

function createCells (cells, x, y) {
  return x > 0
    ? [randomState(), ...createCells(cells, x - 1, y)]
    : cells
}

function nextGeneration (generation, universe) {
  document.getElementsByTagName('pre')[0].innerText = universeToString(universe)

  return window.setTimeout(nextGeneration, speed, generation + 1, advanceUniverse(universe))
}

function advanceUniverse (universe) {
  return createUniverse(width, height)
    .map((row, y) => row.map((cell, x) => getNextCellState(universe, x, y)))
}

function getNextCellState (universe, x, y) {
  const alive = universe[y][x]
  const neighboursAlive = getNeighboursAlive(universe, x, y)

  // Will die because of under-population
  const state1 = alive && neighboursAlive < 2

  // Will live on
  const state2 = alive && (neighboursAlive === 2 || neighboursAlive === 3)

  // Will die because of over-population
  const state3 = alive && neighboursAlive > 3

  // Will be reborn as if by reproduction
  const state4 = !alive && neighboursAlive === 3

  const lives = (state2 || state4) && (!state1 || !state3)

  return lives ? 1 : 0
}

function getNeighboursAlive (universe, x, y) {
  return neighbourOffsets
    .map((offset) => {
      const topWrap = y + offset.y < 0
      const bottomWrap = y + offset.y > height - 1
      const leftWrap = x + offset.x < 0
      const rightWrap = x + offset.x > width - 1

      const offsetY = topWrap ? height - 1 : (bottomWrap ? 0 : y + offset.y)
      const offsetX = leftWrap ? width - 1 : (rightWrap ? 0 : x + offset.x)

      return universe[offsetY][offsetX]
    })
    .filter((cellState) => cellState)
    .length
}

function universeToString (universe) {
  return universe
    .map((row) => rowToString(row))
    .reduce((previousRow, currentRow) => {
      return previousRow === ''
        ? currentRow
        : `${previousRow}\n${currentRow}`
    }, '')
}

function rowToString (row) {
  return row
    .reduce((previousCell, currentCell) => {
      return `${previousCell}${cellToString(currentCell)}`
    }, '')
}

function cellToString (cell) {
  return cell === 1 ? stateAlive : stateDead
}

function randomState () {
  return Math.floor(Math.random() * (1 - 0 + 1))
}
