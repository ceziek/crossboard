import { CrossBoard } from './CrossBoard';
import './style.css';

function renderBoard() {

  fetch('/crosswords.json')
    .then((response) => response.json())
    .then(function (json) {
      let pairs = json.pairs;
      let crossBoard = new CrossBoard(pairs);

      crossBoard.generate();

      let board = crossBoard.getBoard();
      let boardContainer = document.querySelector('#crossboard');

      let questions = [];

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

          if (tile.isFirst) {
            questions.push(tile.question);
            boardTile.setAttribute('question', `${questions.length}`);
            boardTile.classList.add('first-tile');
          }

          boardTile.addEventListener('click', (event) => {
            event.target.classList.remove('mask');
          });

          boardRow.appendChild(boardTile);
        });

        boardContainer.appendChild(boardRow)
      })

      let questionsContainer = document.getElementById('questions');

      let questionsList = document.createElement('UL');

      questions.forEach((question) => {
        console.log(question);
        let questionListElement = document.createElement('LI');
        questionListElement.innerHTML = question;
        questionsList.appendChild(questionListElement);
      });

      questionsContainer.appendChild(questionsList);



    });



}


document.addEventListener('DOMContentLoaded', function () {
  renderBoard();
});