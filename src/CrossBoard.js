class Tile {
  constructor() {
    this.content = '_';
    this.fillOrientation = '';
    this.fullFilled = false;
    this.isFirst = false;
    this.question = '';
  }
}

export class CrossBoard {
  constructor(pairs) {
    this.pairs = pairs;

    this.board = [];
    this.emptyTile = new Tile();
    this.pairToMatch = '';

    this.matchedCharProperties = {
      matchedCharIndex: null,
      matchedWordLength: null,
      boardHeight: null,
      posY: null,
      posX: null
    };

    this.vertical = 'vertical';
    this.horizontal = 'horizontal';

    this.orientation = this.vertical;
  }

  getRandomWord() {
    const randomIndex = Math.floor(Math.random() * this.pairs.length);
    const pair = this.pairs[randomIndex];
    const word = pair.answer;

    this.board[0] = [...word].map((char) => {
      let tile = new Tile();

      tile.fillOrientation = this.horizontal;
      tile.content = char;
      tile.question = pair.question;

      return tile;
    });

    this.pairs.splice(randomIndex, 1);
  }

  matchCharacter() {
    this.matchedCharProperties = {};
    let word = this.pairToMatch.answer;

    return this.board.some((row, posY) => {
      return row.some((tile, posX) => {

        if (
          tile.fullFilled ||
          tile.content === this.emptyTile.content ||
          tile.fillOrientation === this.orientation
        ) {
          return false;
        }

        return [...word].some((char, index) => {

          if (tile.content === char) {
            this.matchedCharProperties = {
              matchedChar: char,
              matchedCharIndex: index,
              matchedWordLength: word.length,
              boardHeight: this.board.length,
              posY: posY,
              posX: posX
            };

            return this.checkWordSurroundings();
          }
        })
      })
    });
  }

  checkWordSurroundings() {
    let isValid = true;
    let wordToMatch = this.pairToMatch.answer;

    const firstCharPosition = {
      posY: this.matchedCharProperties.posY - this.matchedCharProperties.matchedCharIndex,
      posX: this.matchedCharProperties.posX
    };

    const lastCharPosition = {
      posY: firstCharPosition.posY + wordToMatch.length - 1,
      posX: firstCharPosition.posX
    };




    if (
      this.board[firstCharPosition.posY - 1] &&
      this.board[firstCharPosition.posY - 1][firstCharPosition.posX] &&
      this.board[firstCharPosition.posY - 1][firstCharPosition.posX].content !== this.emptyTile.content
    ) {
      isValid = false;
    }

    if (
      this.board[lastCharPosition.posY + 1] &&
      this.board[lastCharPosition.posY + 1][lastCharPosition.posX] &&
      this.board[lastCharPosition.posY + 1][lastCharPosition.posX].content !== this.emptyTile.content
    ) {
      isValid = false;
    }

    [...wordToMatch].forEach((char, index) => {
      let boardMatchY = firstCharPosition.posY + index;
      let boardMatchX = firstCharPosition.posX;

      if (this.board[boardMatchY] && this.board[boardMatchY][boardMatchX]) {
        if (
          this.board[boardMatchY][boardMatchX].fillOrientation === this.orientation
        ) {
          isValid = false;
        }

        if (
          this.board[boardMatchY][boardMatchX].content !== char &&
          this.board[boardMatchY][boardMatchX].content !== this.emptyTile.content
        ) {
          isValid = false;
        }

        if (
          this.board[boardMatchY][boardMatchX].content === char &&
          this.board[boardMatchY][boardMatchX - 1] &&
          this.board[boardMatchY][boardMatchX - 1].fillOrientation === this.orientation
        ) {
          isValid = false;
        }

        if (
          this.board[boardMatchY][boardMatchX].content === char &&
          this.board[boardMatchY][boardMatchX + 1] &&
          this.board[boardMatchY][boardMatchX + 1].fillOrientation === this.orientation
        ) {
          isValid = false;
        }

        if (
          this.board[boardMatchY][boardMatchX].content === this.emptyTile.content &&
          this.board[boardMatchY][boardMatchX - 1] &&
          this.board[boardMatchY][boardMatchX - 1].content !== this.emptyTile.content
        ) {
          isValid = false;
        }

        if (
          this.board[boardMatchY][boardMatchX].content === this.emptyTile.content &&
          this.board[boardMatchY][boardMatchX + 1] &&
          this.board[boardMatchY][boardMatchX + 1].content !== this.emptyTile.content
        ) {
          isValid = false;
        }
      }
    });

    return isValid;

  }

  writeBoard() {
    let wordToMatch = this.pairToMatch.answer;
    let firstElementIndex = this.matchedCharProperties.posY - this.matchedCharProperties.matchedCharIndex;
    let lastElementIndex = this.matchedCharProperties.posY + wordToMatch.length - 1 - this.matchedCharProperties.matchedCharIndex;

    while (firstElementIndex < 0) {
      let newArray = [];

      for (let i = 0; i < this.board[0].length; i++) {
        let tile = new Tile();
        newArray.push(tile)
      }

      this.board.unshift(newArray);
      firstElementIndex++;
      lastElementIndex++;
      this.matchedCharProperties.posY++;
    }

    while (lastElementIndex > this.board.length - 1) {
      let newArray = [];

      for (let i = 0; i < this.board[0].length; i++) {
        let tile = new Tile();
        newArray.push(tile)
      }

      this.board.push(newArray);
    }

    [...wordToMatch].forEach((char, index) => {
      if(index === 0) {
        this.board[firstElementIndex + index][this.matchedCharProperties.posX].isFirst = true;
        this.board[firstElementIndex + index][this.matchedCharProperties.posX].question = this.pairToMatch.question
      }
      if (this.board[firstElementIndex + index][this.matchedCharProperties.posX].content === char) {
        this.board[firstElementIndex + index][this.matchedCharProperties.posX].fullFilled = true;
      } else {
        this.board[firstElementIndex + index][this.matchedCharProperties.posX].fillOrientation = this.orientation;
        this.board[firstElementIndex + index][this.matchedCharProperties.posX].content = char;
      }
    });

    this.matchedCharProperties = {};
  }

  turnBoardRight() {
    const height = this.board.length;
    const width = this.board[0].length;

    let rotatedBoard = [];

    for (let i = 0; i < width; i++) {
      rotatedBoard[i] = [];

      for (let j = 0; j < height; j++) {
        rotatedBoard[i][j] = this.board[j][i];
      }
      rotatedBoard[i] = rotatedBoard[i].reverse();
    }

    this.board = rotatedBoard;

    this.orientation = this.horizontal;
  }

  turnBoardLeft() {
    const height = this.board.length;
    const width = this.board[0].length;

    let rotatedBoard = [];

    for (let i = 0; i < width; i++) {
      rotatedBoard[i] = [];

      for (let j = 0; j < height; j++) {
        rotatedBoard[i][j] = this.board[j][width - 1 - i];
      }
    }

    this.board = rotatedBoard;

    this.orientation = this.vertical;

  }

  generate() {
    let done = false;

    const pairs = this.pairs;

    this.getRandomWord();

    do {
      let buffer = [];
      let numberOfPairs = this.pairs.length;

      for (let i = 0; i < numberOfPairs; i++) {
        const randomIndex = Math.floor(Math.random() * this.pairs.length);
        this.pairToMatch = this.pairs[randomIndex];
        this.pairs.splice(randomIndex, 1);

        const isMatched = this.matchCharacter();

        if (isMatched) {
          this.writeBoard();
        } else {
          this.turnBoardRight();

          const isMatchedRotated = this.matchCharacter();

          if (isMatchedRotated) {
            this.writeBoard();
            this.turnBoardLeft();
          } else {
            buffer.push(this.pairToMatch);
            this.turnBoardLeft();
          }
        }
      }

      if (this.pairs.length === buffer.length) {
        done = true;
      }
      this.pairs = [...buffer];
    } while (!done);


    this.pairs = pairs;

  }

  getBoard() {
    return this.board;
  }
}
