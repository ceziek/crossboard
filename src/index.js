import { CrossBoard } from './CrossBoard';
import './style.css';

function renderBoard() {

  let answers = [];

  fetch('/crosswords.json')
    .then((response) => response.json())
    .then(function (json) {
      let pairs = json.pairs;
      let crossBoard = new CrossBoard(pairs);

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
          } else {
            boardTile.classList.add('mask');
          }

          boardTile.addEventListener('click', (event) => {
            event.target.classList.remove('mask');
          });

          boardRow.appendChild(boardTile);
        });

        boardContainer.appendChild(boardRow)
      })

    });



}


document.addEventListener('DOMContentLoaded', function () {
  renderBoard();
});