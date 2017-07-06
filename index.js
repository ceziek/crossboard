function renderBoard() {
  let wordsArray =
    ['mama', 'antylopa', 'akronim', 'beata', 'kartofel', 'opale', 'samochod', 'fory', 'zamachowiec', 'komisja',
      'sciana', 'zupa', 'siusiak', 'kamasutra', 'konstanty', 'motor', 'prezydent', 'telewizja', 'kontrola',
      'grot', 'encyklopedia', 'gwint', 'trampek', 'palac', 'ksiazka', 'pasztet', 'kawa', 'portfel', 'eklerka', 'batuta',
  'kafka', 'syrop', 'pakistan', 'taczpad', 'programowanie', 'niepierdol', 'chujowytekst', 'sikiweroniki', 'koka'];

  let words = ['kamasutra', 'konstanty', 'motor', 'prezydent', 'telewizja', 'kontrola',
    'grot', 'encyklopedia', 'gwint', 'trampek', 'palac', 'ksiazka', 'pasztet', 'kawa', 'portfel', 'eklerka'];
  let crossBoard = new CrossBoard(words);

  crossBoard.generate();

  let board = crossBoard.getBoard();
  let boardContainer = document.querySelector('#crossboard');

  board.forEach((row) => {
    let boardRow = document.createElement('DIV');

    row.forEach((tile) => {
      let boardTile = document.createElement('SPAN');
      boardTile.innerHTML = tile.content;

      if (boardTile.innerHTML === crossBoard.emptyTile.content) {
        boardTile.classList.add('empty')
      }
      boardRow.appendChild(boardTile);
    });

    boardContainer.appendChild(boardRow)
  })

}


document.addEventListener('DOMContentLoaded', function() {
  renderBoard();
});