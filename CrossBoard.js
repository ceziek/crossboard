class CrossBoard {
  constructor(words) {
    this.words = words;

    this.board = [];
    this.emptyTile = '_';
    this.wordToMatch = '';

    this.matchedCharProperties = {
      matchedCharIndex: null,
      matchedWordLength: null,
      boardHeight: null,
      posY: null,
      posX: null
    };
  }

  getRandomWord() {
    let randomIndex = Math.floor(Math.random() * this.words.length);

    this.board[0] = [...this.words[randomIndex]];
    this.words.splice(randomIndex, 1);
  }

  matchCharacter() {
    this.matchedCharProperties = {};

    return this.board.some((row, posY) => {
      return row.some((tile, posX) => {

        if (tile === this.emptyTile) {
          return false;
        }

        return [...this.wordToMatch].some((char, index) => {

          if (char === tile) {
            this.matchedCharProperties = {
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

    const firstElementPosition = {
      posY: this.matchedCharProperties.posY - this.matchedCharProperties.matchedCharIndex,
      posX: this.matchedCharProperties.posX
    };

    const lastElementPosition = {
      posY: firstElementPosition.posY + this.wordToMatch.length - 1,
      posX: firstElementPosition.posX
    };

    if (
      this.board[firstElementPosition.posY - 1] &&
      this.board[firstElementPosition.posY - 1][firstElementPosition.posX] &&
      this.board[firstElementPosition.posY - 1][firstElementPosition.posX] !== this.emptyTile
    ) {
      isValid = false;
    }

    if (
      this.board[lastElementPosition.posY + 1] &&
      this.board[lastElementPosition.posY + 1][lastElementPosition.posX] &&
      this.board[lastElementPosition.posY + 1][lastElementPosition.posX] !== this.emptyTile
    ) {
      isValid = false;
    }

    [...this.wordToMatch].forEach((char, index) => {
      if (
        this.matchedCharProperties.matchedCharIndex !== index &&
        this.board[firstElementPosition.posY + index] &&
        this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] &&
        this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] !== this.emptyTile
      ) {
        isValid = false;
      }

      if (
        this.matchedCharProperties.matchedCharIndex !== index &&
        this.board[firstElementPosition.posY + index] &&
        this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] &&
        this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] !== this.emptyTile
      ) {
        isValid = false;
      }

      if (
        (
          this.matchedCharProperties.matchedCharIndex === index &&
          this.board[firstElementPosition.posY + index + 1] &&
          this.board[firstElementPosition.posY + index + 1][firstElementPosition.posX] &&
          this.board[firstElementPosition.posY + index + 1][firstElementPosition.posX] !== this.emptyTile
        )
        ||
        (
          this.matchedCharProperties.matchedCharIndex === index &&
          this.board[firstElementPosition.posY + index - 1] &&
          this.board[firstElementPosition.posY + index - 1][firstElementPosition.posX] &&
          this.board[firstElementPosition.posY + index - 1][firstElementPosition.posX] !== this.emptyTile
        )
      ) {
        isValid = false;
      }

      if (
        (
          this.matchedCharProperties.matchedCharIndex === index &&
          this.board[firstElementPosition.posY + index] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] === this.emptyTile
        )
        ||
        (
          this.matchedCharProperties.matchedCharIndex === index &&
          this.board[firstElementPosition.posY + index] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] === this.emptyTile
        )
      ) {
        isValid = false;
      }
    });

    return isValid;

  }

  checkWordSurroundings2() {
    let isValid = true;

    const firstElementPosition = {
      posY: this.matchedCharProperties.posY - this.matchedCharProperties.matchedCharIndex,
      posX: this.matchedCharProperties.posX
    };

    const lastElementPosition = {
      posY: firstElementPosition.posY + this.wordToMatch.length - 1,
      posX: firstElementPosition.posX
    };

    if (
      this.board[firstElementPosition.posY - 1] &&
      this.board[firstElementPosition.posY - 1][firstElementPosition.posX] &&
      this.board[firstElementPosition.posY - 1][firstElementPosition.posX] !== this.emptyTile
    ) {
      isValid = false;
    }

    if (
      this.board[lastElementPosition.posY + 1] &&
      this.board[lastElementPosition.posY + 1][lastElementPosition.posX] &&
      this.board[lastElementPosition.posY + 1][lastElementPosition.posX] !== this.emptyTile
    ) {
      isValid = false;
    }

    [...this.wordToMatch].forEach((char, index) => {
      if (
        this.board[firstElementPosition.posY + index] &&
        this.matchedCharProperties.matchedCharIndex !== index &&
        char !== this.board[firstElementPosition.posY + index][firstElementPosition.posX]
      ) {
        if (
          this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] !== this.emptyTile
        ) {
          isValid = false;
        }

        if (
          this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] !== this.emptyTile
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
      let emptyArray = new Array(this.board[0].length).fill(this.emptyTile);

      this.board.unshift(emptyArray);
      firstElementIndex++;
      lastElementIndex++;
      this.matchedCharProperties.posY++;
    }

    while (lastElementIndex > this.board.length - 1) {
      let emptyArray = new Array(this.board[0].length).fill(this.emptyTile);

      this.board.push(emptyArray);
    }

    [...this.wordToMatch].forEach((char, index) => {
      this.board[firstElementIndex + index][this.matchedCharProperties.posX] = char;
    });

    console.log(this.wordToMatch);

    this.output();

    console.log('----------------')

    this.matchedCharProperties = {};
  }

  turnRight() {
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
  }

  turnLeft() {
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
          this.turnRight();

          const isMatchedRotated = this.matchCharacter();

          if (isMatchedRotated) {
            this.writeBoard();
            this.turnLeft();
          } else {
            buffer.push(this.wordToMatch);
            this.turnLeft();
          }
        }
      }

      if (this.words.length && buffer.length && buffer.length !== this.words.length) {
        this.words = [...buffer];
        console.log(this.words.toString(), 'Buffer')
      } else {
        console.log('Niedopasowane : ', buffer.length);
        console.log('Niedopasowane : ', buffer);
        done = true;
      }
    } while (!done);

  }

  output() {
    for (let i = 0; i < this.board.length; i++) {
      console.log(this.board[i].toString())
    }
  }

  getBoard() {
    return this.board;
  }
}
