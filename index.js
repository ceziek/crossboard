let wordsToMatch = ['dupa', 'kupa', 'kontakt', 'antylopa','tartak', 'dosia', 'akronim', 'kopenhaga' ,'zestosteron', 'siena', 'jesionka', 'kolor', 'kicz', 'stymulant', 'seler'];
let word = wordsToMatch[Math.floor(Math.random() * 15)];

let board = [];

let done = true;

let matchedPosition = {
  matchedWordIndex: null,
  matchedWordLength: null,
  boardLength: null,
  boardY: null,
  boardX: null
};


function init() {
  board = [];
  board[0] = [...word];
}

function checkVertical(board, word) {

  matchCharacter(board, word);

  if (checkSurroundings(board, word, matchedPosition)) {
    writeBoardVertical(board, word, matchedPosition);
    return true;
  } else {
    return false;
  }
}

function matchCharacter(board, word) {
  let chars = [...word];

  chars.some((char, index) => {
    return board.some((row, boardY) => {
      return row.some((elem, boardX) => {
        if (char === elem) {

          matchedPosition = {
            matchedWordIndex: index,
            matchedWordLength: chars.length,
            boardLength: board.length,
            boardY: boardY,
            boardX: boardX
          };

          return true;
        }
      })
    })
  });
}

function writeBoardVertical(board, word, matchedPosition) {

  let firstElementIndex = matchedPosition.boardY - matchedPosition.matchedWordIndex;
  let lastElementIndex = matchedPosition.boardY + word.length - 1 - matchedPosition.matchedWordIndex ;

  while (firstElementIndex < 0) {
    board.unshift(new Array(board[0].length).fill(' '));
    firstElementIndex++;
    matchedPosition.boardY++;
    matchedPosition.boardLength++;
  }

  console.log(lastElementIndex, 'last element index');


  while (lastElementIndex > matchedPosition.boardLength - 1 ) {

    board.push(new Array(board[0].length).fill(' '));
    lastElementIndex--
  }

  [...word].forEach((char, index) => {
    console.log(`word[${index}] : ${char}`);
    console.log(matchedPosition);
    console.log(board);
    board[firstElementIndex + index][matchedPosition.boardX] = char;
  })
}

function rotate(board) {
  let rotatedBoard = [];

  board.forEach((row, index) => {
    row.forEach((char, i) => {
      if (!(rotatedBoard[i] instanceof Array)) {
        rotatedBoard[i] = [];
      }
      rotatedBoard[i][index] = char;
    })
  });

  return rotatedBoard;
}

function checkSurroundings(board, word, matchedElem) {
  let chars = [...word];
  let isValid = true;
  const firstElementPosition = {
    boardY: matchedElem.boardY - matchedElem.matchedWordIndex,
    boardX: matchedElem.boardX
  };

  const lastElementPosition = {
    boardY: firstElementPosition.boardY + chars.length - 1,
    boardX: firstElementPosition.boardX
  }


  if (
    board[firstElementPosition.boardY - 1] &&
    board[firstElementPosition.boardY - 1][firstElementPosition.boardX] &&
    board[firstElementPosition.boardY - 1][firstElementPosition.boardX] !== ' '
  ) {
    console.log('1 IF false : ', word);
    isValid = false;
  }

  if (
    board[lastElementPosition.boardY + 1] &&
    board[lastElementPosition.boardY + 1][lastElementPosition.boardX] &&
    board[lastElementPosition.boardY + 1][lastElementPosition.boardX] !== ' '
  ) {
    console.log('2 IF false : ', word);
    isValid = false;
  }

  chars.forEach((char, index) => {
    if (
      board[firstElementPosition.boardY + index] &&
      matchedElem.matchedWordIndex !== index &&
      char !== board[firstElementPosition.boardY + index][firstElementPosition.boardX]
    ) {
      if (
        board[firstElementPosition.boardY + index][firstElementPosition.boardX - 1] &&
        board[firstElementPosition.boardY + index][firstElementPosition.boardX - 1] !== ' '
      ) {
        console.log('1 IF LOOP false : ', word);
        isValid = false;
      }

      if (
        board[firstElementPosition.boardY + index][firstElementPosition.boardX + 1] &&
        board[firstElementPosition.boardY + index][firstElementPosition.boardX + 1] !== ' '
      ) {
        console.log('2 IF LOOP false : ', word);
        isValid = false;
      }
    }
  });

  return isValid;
}

let stopper = 0;

function start() {
  init();

  do  {
    let buffer = [];

    wordsToMatch.forEach((word) => {
      if (!checkVertical(board, word)) {
        //board = rotate(board);
        if (!checkVertical(board, word)) {
          done = false;
          buffer.push(word);
        }
      }
    });


    if (buffer.length !== wordsToMatch.length) {
      wordsToMatch = [...buffer];
    } else {
      console.log('Niedopasowane : ', wordsToMatch.length);
      done = true;
    }
  } while (!done);

  if (wordsToMatch.length > 3 && stopper < 50) {
    stopper++;
    start();
  }
}

start();


if (wordsToMatch.length)
board.forEach((row) => {
  console.log(row);
})



