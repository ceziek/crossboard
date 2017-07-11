import { CrossBoard } from './CrossBoard';
import axios from 'axios';
import './style.css';

function buildBoard(pairs) {
  const crossBoard = new CrossBoard(pairs);
  crossBoard.generate();

  const generatedBoard = crossBoard.getBoard();
  const boardContainer = document.querySelector('#crossboard');

  let questions = [];

  generatedBoard.forEach((row) => {
    let boardRow = document.createElement('DIV');

    row.forEach((tile) => {
      let boardTile = document.createElement('SPAN');

      if (tile.content === crossBoard.emptyTile.content) {
        boardTile.classList.add('empty')
      } else {
        boardTile.innerHTML = tile.content;
        boardTile.classList.add('mask');
      }

      if (tile.isFirst) {
        questions.push(tile.questions);
        boardTile.setAttribute('question', `${questions.length}`);
        boardTile.classList.add('first-tile');
      }

      boardTile.addEventListener('click', (event) => {
        event.target.classList.remove('mask');
      });

      boardRow.appendChild(boardTile);
    });

    boardContainer.appendChild(boardRow)
  });

  let questionsContainer = document.getElementById('questions');
  let questionList = document.createElement('UL');

  questions.forEach((questionArray, index) => {

    questionArray.forEach((question) => {
      let questionListElement = document.createElement('LI');
      questionListElement.innerHTML = `${index + 1}: ${question}`;
      questionList.appendChild(questionListElement);
    });
  });

  questionsContainer.appendChild(questionList);
}

function renderBoard() {
  axios.get('http://localhost:9000/crosswords.json')
    .then((response) => {
      let pairs = response.data.pairs;
      buildBoard(pairs);
    })
    .catch((error) => console.log(error));
}

document.addEventListener('DOMContentLoaded', function () {
  renderBoard();
});