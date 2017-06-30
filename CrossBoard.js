class CrossBoard {
  constructor(words) {
    this.words = words;

    this.board = [];
    this.emptyTile = '_';
    this.wordToMatch = '';

    this.generate();
    this.output();
  }

  getRandomWord() {
    let randomIndex = Math.floor(Math.random() * this.words.length);

    this.board[0] = [...this.words[randomIndex]];
    this.words.splice(randomIndex, 1);
  }

  matchCharacter() {
    this.matchedPosition = {};

    return this.board.some((row, posY) => {
      return row.some((tile, posX) => {

        if (tile === this.emptyTile) {
          return false;
        }

        return [...this.wordToMatch].some((char, index) => {

          if (char === tile) {
            this.matchedPosition = {
              matchedWordIndex: index,
              matchedWordLength: this.wordToMatch.length,
              boardLength: this.board.length,
              posY: posY,
              posX: posX
            };

            return this.checkSurroundings();
          }
        })
      })
    });
  }

  checkSurroundings() {
    let isValid = true;

    const firstElementPosition = {
      posY: this.matchedPosition.posY - this.matchedPosition.matchedWordIndex,
      posX: this.matchedPosition.posX
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
        this.matchedPosition.matchedWordIndex !== index &&
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

    let firstElementIndex = this.matchedPosition.posY - this.matchedPosition.matchedWordIndex;
    let lastElementIndex = this.matchedPosition.posY + this.wordToMatch.length - 1 - this.matchedPosition.matchedWordIndex;

    while (firstElementIndex < 0) {
      this.board.unshift(new Array(this.board[0].length).fill(this.emptyTile));
      firstElementIndex++;
      lastElementIndex++;
      this.matchedPosition.posY++;
    }

    while (lastElementIndex > this.board.length - 1) {
      this.board.push(new Array(this.board[0].length).fill(this.emptyTile));
    }

    [...this.wordToMatch].forEach((char, index) => {
      this.board[firstElementIndex + index][this.matchedPosition.posX] = char;
    });
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

      this.words.forEach((word, index) => {
        // const randomIndex = Math.floor(Math.random() * this.words.length);
        // this.wordToMatch = this.words[randomIndex];

        this.wordToMatch = word;

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
            buffer.push(word);
            this.turnLeft();
          }
        }

      });

      if (buffer.length && buffer.length !== this.words.length) {
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
}

let words =
  ['mama', 'antylopa', 'akronim', 'beata', 'kartofel', 'opale', 'samochod', 'fory', 'zamachowiec', 'komisja',
    'sciana', 'zupa', 'siusiak', 'kamasutra', 'konstanty', 'motor', 'prezydent', 'telewizja', 'kontrola',
    'grot', 'encyklopedia', 'gwint', 'trampek', 'palac', 'ksiazka'];


let crossBoard = new CrossBoard(words);