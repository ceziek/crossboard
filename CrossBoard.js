class CrossBoard {

  constructor() {
    this.board = [];

    this.wordToMatch = '';
    this.words =
      ['mama', 'antylopa', 'akronim', 'beata', 'kartofel', 'opale', 'samochod', 'fory', 'amfora', 'raki', 'ptak', 'kapiszon',
        'tata', 'bydlo', 'kicz', 'joanna', 'ziemniak', 'polska', 'bartek', 'katedra', 'smerf', 'osilek', 'goniec', 'zara'];

    let randomIndex = Math.floor(Math.random() * 5);

    this.board[0] = [...this.words[randomIndex]];

    this.machesFailed = 0;
    this.matchedPosition = {};

    this.generate();

  }

  matchCharacter() {
    this.matchedPosition = {};
    let charsToMatch = [...this.wordToMatch];

    return this.board.some((row, posY) => {

      return row.some((tile, posX) => {

        return charsToMatch.some((char, index) => {

          if (char === tile) {
            this.matchedPosition = {
              matchedWordIndex: index,
              matchedWordLength: this.wordToMatch.length,
              boardLength: this.board.length,
              posY: posY,
              posX: posX
            };

            return true;
          }
        })
      })
    });
  }

  writeBoardVertical() {

    let firstElementIndex = this.matchedPosition.posY - this.matchedPosition.matchedWordIndex;
    let lastElementIndex = this.matchedPosition.posY + this.wordToMatch.length - 1 - this.matchedPosition.matchedWordIndex;

    while (firstElementIndex < 0) {
      this.board.unshift(new Array(this.board[0].length).fill(' '));
      firstElementIndex++;
      lastElementIndex++;
      this.matchedPosition.posY++;
    }

    while (lastElementIndex > this.board.length - 1) {
      this.board.push(new Array(this.board[0].length).fill(' '));
    }

    [...this.wordToMatch].forEach((char, index) => {
      this.board[firstElementIndex + index][this.matchedPosition.posX] = char;
    });
  }

  checkSurroundings() {
    let chars = [...this.wordToMatch];
    let isValid = true;

    const firstElementPosition = {
      posY: this.matchedPosition.posY - this.matchedPosition.matchedWordIndex,
      posX: this.matchedPosition.posX
    };

    const lastElementPosition = {
      posY: firstElementPosition.posY + chars.length - 1,
      posX: firstElementPosition.posX
    }

    if (
      this.board[firstElementPosition.posY - 1] &&
      this.board[firstElementPosition.posY - 1][firstElementPosition.posX] &&
      this.board[firstElementPosition.posY - 1][firstElementPosition.posX] !== ' '
    ) {
      isValid = false;
    }

    if (
      this.board[lastElementPosition.posY + 1] &&
      this.board[lastElementPosition.posY + 1][lastElementPosition.posX] &&
      this.board[lastElementPosition.posY + 1][lastElementPosition.posX] !== ' '
    ) {
      isValid = false;
    }

    chars.forEach((char, index) => {
      if (
        this.board[firstElementPosition.posY + index] &&
        this.matchedPosition.matchedWordIndex !== index &&
        char !== this.board[firstElementPosition.posY + index][firstElementPosition.posX]
      ) {
        if (
          this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX - 1] !== ' '
        ) {
          isValid = false;
        }

        if (
          this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] &&
          this.board[firstElementPosition.posY + index][firstElementPosition.posX + 1] !== ' '
        ) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  rotate() {
    let rotatedBoard = [];
    const height = this.board.length;
    const width = this.board[0].length;

    for (let i = 0; i < width; i++) {
      rotatedBoard[i] = [];

      for (let j = 0; j < height; j++) {
        rotatedBoard[i][j] = this.board[j][i];
      }
    }


    this.board = rotatedBoard;
  }

  generate() {
    let done = false;

    do {
      let buffer = [];

      this.words.forEach((word, index) => {
        const randomIndex = Math.floor(Math.random() * this.words.length);
        this.wordToMatch = this.words[randomIndex];

        const isMatched = this.matchCharacter();
        const isValid = this.checkSurroundings();



        if (isMatched && isValid) {
          this.writeBoardVertical();
          this.rotate();
        } else {
          this.rotate();

          if (isMatched && isValid) {
            this.writeBoardVertical();
            this.rotate();
          } else {
            this.machesFailed++;
            buffer.push(word);
          }
        }

      });

      if (buffer.length && buffer.length !== this.words.length) {
        this.words = [...buffer];
      } else {
        console.log('Niedopasowane : ', this.words.length);
        done = true;
      }
    } while (!done)

    this.output();
  }

  output() {
    for (let i = 0; i < this.board.length; i++) {
      console.log(this.board[i].toString())
    }
  }
}


let crossBoard = new CrossBoard();