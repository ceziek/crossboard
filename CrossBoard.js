class Tile {
  constructor() {
    this.content = '_';
    this.fillOrientation = '';
    this.fullFilled = false;
  }
}

class CrossBoard {
  constructor(words) {
    this.words = words;

    this.board = [];
    this.emptyTile = new Tile();
    this.wordToMatch = '';

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
    const randomIndex = Math.floor(Math.random() * this.words.length);
    const wordArray = [...this.words[randomIndex]];

    this.board[0] = wordArray.map((char) => {
      let tile = new Tile();

      tile.fillOrientation = this.horizontal;
      tile.content = char;

      return tile;
    });

    this.words.splice(randomIndex, 1);
  }

  matchCharacter() {
    this.matchedCharProperties = {};

    return this.board.some((row, posY) => {
      return row.some((tile, posX) => {

        if (
          tile.fullFilled ||
          tile.content === this.emptyTile.content ||
          tile.fillOrientation === this.orientation
        ) {
          return false;
        }

        return [...this.wordToMatch].some((char, index) => {

          if (tile.content === char) {
            this.matchedCharProperties = {
              matchedChar: char,
              matchedCharIndex: index,
              matchedWordLength: this.wordToMatch.length,
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

    const firstCharPosition = {
      posY: this.matchedCharProperties.posY - this.matchedCharProperties.matchedCharIndex,
      posX: this.matchedCharProperties.posX
    };

    const lastCharPosition = {
      posY: firstCharPosition.posY + this.wordToMatch.length - 1,
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

    [...this.wordToMatch].forEach((char, index) => {
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
    let firstElementIndex = this.matchedCharProperties.posY - this.matchedCharProperties.matchedCharIndex;
    let lastElementIndex = this.matchedCharProperties.posY + this.wordToMatch.length - 1 - this.matchedCharProperties.matchedCharIndex;

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

    [...this.wordToMatch].forEach((char, index) => {
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

    this.getRandomWord();

    do {
      let buffer = [];
      let numberOfWords = this.words.length;

      for (let i = 0; i < numberOfWords; i++) {
        const randomIndex = Math.floor(Math.random() * this.words.length);
        this.wordToMatch = this.words[randomIndex];
        this.words.splice(randomIndex, 1);

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
            buffer.push(this.wordToMatch);
            this.turnBoardLeft();
          }
        }
      }

      if (this.words.length === buffer.length) {
        done = true;
      }
      this.words = [...buffer];
    } while (!done);

    const emptyBoardTiles = this.board.map((row) => row.filter((tile) => tile.content === '_'));
    const emptyBoardTilesFlatten = [].concat.apply([], emptyBoardTiles);
    const emptyTilesNumber = emptyBoardTilesFlatten.length;



    console.log(emptyBoardTilesFlatten)



  }

  getBoard() {
    return this.board;
  }
}
