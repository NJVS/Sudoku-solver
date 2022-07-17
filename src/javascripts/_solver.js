
export default class Solver {
  //////////////////////////// BOARD ////////////////////////////
  static resetBoard() {
    document.querySelectorAll('input[type=number]').forEach(inp => {
      inp.removeAttribute('disabled');
      inp.removeAttribute('style');
      inp.value = '';
    });
  }
  static solveBoard() {
    // get board values 
    const initialBoard = [[]]; // (9)[Array(9), ....]
    const tiles = document.querySelectorAll('input[type=number]');
    let row = 0;
    tiles.forEach((tile, index) => {
      if (index % 9 === 0 && index !== 0) {
        initialBoard.push([]); // add new row
        row++;
      }
      (tile.value) ? initialBoard[row].push(parseInt(tile.value)) : initialBoard[row].push(null);
    });
    // check if the initial board is solvable, we dont need to run the whole algorithm
    // if the board has an identical value within its row, column or box.
    if (!Solver.isValidBoard(initialBoard)) {
      alert('The Board is unsolvable.');
    } else {
      const answer = Solver.solve(initialBoard);
      Solver.updateBoard(answer, tiles);
    }
  }
  static updateBoard(answer, tiles) {
    // => fillsup the answer to the board
    answer = [].concat.apply([], answer);// combine into single array

    for (let i = 0; i < tiles.length; i++) {
      // disable all tile and highlight tile/s whose the user input
      tiles[i].setAttribute('disabled', '');
      if (tiles[i].value === '') tiles[i].style.color = 'rgb(128, 128, 128)';

      tiles[i].value = answer[i]; // fill up board
    }
  }









  //////////////////////////// SOLVER ////////////////////////////
  static isSolved(board) {
    // => Boolean
    // check for empty tile
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  }

  static solve(board) {
    // => Solved Board
    // search for solution until the board is solved
    if (Solver.isSolved(board)) {
      return board;
    } else {
      const possibilities = Solver.generatePossibilities(board);
      const validBoards = Solver.removeInvalidBoards(possibilities);
      return Solver.tryPath(validBoards);
    }
  }

  static generatePossibilities(board) {
    // => (9)[board, ...]
    // find the first empty tile then fill with 1-9 then create a board for each posibiities
    // this will create a children of different posibilieties of the "board"
    const possibilities = [];
    const emptyTile = Solver.firstEmptyTileIndex(board);

    if (emptyTile !== undefined) {
      const rowIndex = emptyTile[0];
      const colIndex = emptyTile[1];

      for (let possibleTileValue = 1; possibleTileValue <= 9; possibleTileValue++) {
        let newBoard = [...board]; // create a copy of board
        let row = [...newBoard[rowIndex]]; // create a copy of the row with the first empty tile
        row[colIndex] = possibleTileValue; // add value to first empty tile

        newBoard[rowIndex] = row; // replace value inside the newBoard with the new copy of the row
        possibilities.push(newBoard); // push new possibility board
      }
    }

    return possibilities;
  }

  static removeInvalidBoards(boards) {
    // => (Valid only)[board, ...]
    const validBoards = [];

    boards.forEach(board => { // loop through boards
      if (Solver.isValidBoard(board)) {
        validBoards.push(board); // push valid board
      }
    });

    return validBoards;
  }

  static tryPath(boards) {
    // => Boards or until false
    if (boards.length <= 0) {
      return false;
    } else {
      const firstBoard = boards.shift();
      const _tryPath = Solver.solve(firstBoard); // backtrack search
      if (_tryPath !== false) {
        return _tryPath;
      } else {
        return Solver.tryPath(boards); // recursion
      }
    }
  }

  static firstEmptyTileIndex(board) {
    // => [row, col] or undefined (index of the first empty tile)
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === null) {
          return [row, col];
        } 
      }
    }
  }


  
  
  








  //////////////////////////// VERIFIER ////////////////////////////
  static isValidBoard(board) {
    // => Boolean
    // rows, columns and boxes must all true
    return Solver.validateRows(board) && Solver.validateCols(board) && Solver.validateBoxs(board);
  }
  static validateRows(board) {
    // => Boolean
    // check for identical value for each row
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      let _arr = [];
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        if (_arr.includes(board[rowIndex][colIndex])) {
          // Solver.highlightInvalidTile(rowIndex, colIndex);
          return false;
        } else if (board[rowIndex][colIndex] !== null) {
          _arr.push(board[rowIndex][colIndex]);
        }
      }
    }
    return true
  }
  static validateCols(board) {
    // => Boolean
    // check for identical value for each column
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      let _arr = [];
      for (let colIndex = 0; colIndex < 9; colIndex++) {
        if (_arr.includes(board[colIndex][rowIndex])) {
          // Solver.highlightInvalidTile(colIndex, rowIndex);
          return false
        } else if (board[colIndex][rowIndex] !== null) {
          _arr.push(board[colIndex][rowIndex]);
        }
      }
    }
    return true;
  }
  static validateBoxs(board) {
    // => Bolean
    // check for identical value for each box
    const boxCoordinates = [ // coordinates for each boxes
      [0, 0], [0, 1], [0, 2],
      [1, 0], [1, 1], [1, 2],
      [2, 0], [2, 1], [2, 2],
    ];

    // move every three(3) tiles to move to next box
    for (let yCoords = 0; yCoords < 9; yCoords += 3) {
      for (let xCoords = 0; xCoords < 9; xCoords += 3) {
        let _arr = [];
        // loop for boxCoordinates
        for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
          let _boxCoordinates = [...boxCoordinates[boxIndex]];
          _boxCoordinates[0] += yCoords; // first index
          _boxCoordinates[1] += xCoords; // second index

          if (_arr.includes(board[_boxCoordinates[0]][_boxCoordinates[1]])) {
            // Solver.highlightInvalidTile(_boxCoordinates[0], _boxCoordinates[1]);
            return false;
          } else if (board[_boxCoordinates[0]][_boxCoordinates[1]]) {
            _arr.push(board[_boxCoordinates[0]][_boxCoordinates[1]]);
          }
        }
      }
    }
    return true;
  }
  static highlightInvalidTile(rowIndex, colIndex) {
    const tiles = document.querySelectorAll('input[type=number]');
    const sort = (arr, size) => {
      return arr.length > size
        ? [arr.slice(0, size), ...sort(arr.slice(size), size)]
        : [arr];
    }
    const board = sort(Array.from(tiles), 9);

    board[rowIndex][colIndex].style.color = 'red';
  }
}