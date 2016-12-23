import { advanceUniverse, createUniverse, universeToString } from './conway'

const print = (string) =>
  document.getElementsByTagName('pre')[0].innerText = string

const run = (universe, speed) => {
  print(universeToString(universe))

  const nextUniverse = advanceUniverse(universe)

  return window.setTimeout(run, speed, nextUniverse)
}

const universe = createUniverse(100, 60)

run(universe, 150)
