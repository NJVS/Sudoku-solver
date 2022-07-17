
import '../../src/styles/main.css';
import Solver from './_solver.js';

// document.addEventListener('DOMContentLoaded', () => {
  // create tiles
  const sudokuBoard = document.querySelector('#sudokuBoard');

  for (let i = 0; i < 81; i++) {
    const inpElement = document.createElement('input');
    inpElement.setAttribute('type', 'number');
    inpElement.id = i + 1;

    inpElement.addEventListener('input', event => {
      (event.data === '0') ? event.target.value = 1 : event.target.value = event.data;
    });

    if (
      ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
      ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
      ((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && (i > 27 && i < 53)) ||
      ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
      ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
    ) { inpElement.classList.add('bg-gray') }

    sudokuBoard.append(inpElement);
  }

  // resset board
  document.querySelector('#btn-reset').addEventListener('click', Solver.resetBoard)
  // solve board
  document.querySelector('#btn-solve').addEventListener('click', Solver.solveBoard);
// });