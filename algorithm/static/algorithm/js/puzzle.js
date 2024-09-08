// import winSound from "./sound";


const app = document.getElementById('app');
const play = document.getElementById('play');
const movesEl = document.getElementById('moves');
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const moveSequenceBox = document.getElementById("moveSequence");
const solutionBtn = document.getElementById("solution-button");
const solutionView = false;


var gridSize = 3;
// check the tile design used in Luke LaValva
let moves = 0;

// If the size is 3, then we'll have a 3 by 3 matrix
var board = {
    x_size: gridSize,
    y_size: gridSize, 
}

var moveSequence = [];
const generateMatrix = (size, sequence = '') =>{
  counter = 0;
  let __matrix = []
  if(sequence === ''){

    for(let i = 1; i <= size; i++){
      row = [];
      for(let j = 1; j <= size; j++){
        counter++;
        if (i === size && j === size){

          row.push('');
        } else {
          row.push(counter.toString());
        }
      }
      __matrix.push(row);
    }
  } else {
    let sequenceList = sequence.split(",");
    for(let i = 1; i <= size; i++){
      row = [];
      for(let j = 1; j <= size; j++){
        if (sequenceList[counter] == "0"){
          row.push('');
        } else {
          row.push(sequenceList[counter]);
        }
        counter++;
      }
      __matrix.push(row);
    }
  }
  return __matrix;
}

var matrix = generateMatrix(gridSize);

const toggleLast = () => {
  for (let el of matrix.flat()){
    if(el.innerText !== ''){
      el.classList.remove("last");
      el.classList.add("el");
    }
  }
}

// train the ai by generating millions of possible combinations
// 
const up = (matrix, x, y, steps = 1) => {
  if(y > 0){
    toggleLast();
    for(i = 0; i < steps; i++){

      [matrix[y - i][x], matrix[y - i - 1][x]] = [matrix[y - i - 1][x], matrix[y -i][x]]
      temp = matrix[y - i - 1][x].id;
      matrix[y - i - 1][x].id = matrix[y -i][x].id;
      matrix[y -i][x].id = temp;
      matrix[y -i][x].classList.toggle("last");
      matrix[y -i][x].classList.toggle("el");
    }
  }
};


const down = (matrix, x, y, steps = 1) => {
  if(y < gridSize - 1){
    toggleLast();

    for(i = 0; i < steps; i++){

      [matrix[y + i][x], matrix[y + 1 + i][x]] = [matrix[y + 1 + i][x], matrix[y + i][x]]
      temp = matrix[y + 1 + i][x].id
      matrix[y + 1 + i][x].id = matrix[y + i][x].id
      matrix[y + i][x].id = temp;
      matrix[y + i][x].classList.toggle("last");
      matrix[y + i][x].classList.toggle("el");
    }
  }
};

const left = (matrix, x, y, steps = 1) => {
  if(x > 0){
    toggleLast();
    for(i = 0; i < steps; i++){

      [matrix[y][x - i], matrix[y][x - 1 - i]] = [matrix[y][x - 1 - i], matrix[y][x - i]]
      temp = matrix[y][x - 1 - i].id
      matrix[y][x - 1 - i].id = matrix[y][x - i].id
      matrix[y][x - i].id = temp;
      matrix[y][x - i].classList.toggle("last");
      matrix[y][x - i].classList.toggle("el");
    }
  }
};

const right = (matrix, x, y, steps = 1) => {
  if(x < gridSize - 1){
    toggleLast();

    for(i = 0; i < steps; i++){

      [matrix[y][x + i], matrix[y][x + i + 1]] = [matrix[y][x + i + 1], matrix[y][x + i]]
      temp = matrix[y][x + i + 1].id
      matrix[y][x + i + 1].id = matrix[y][x + i].id
      matrix[y][x + i].id = temp;
      matrix[y][x + i].classList.toggle("last");
      matrix[y][x + i].classList.toggle("el");
    }
  }
};




const shufflePuzzle = () => {
  [noneX, noneY] = [gridSize - 1, gridSize - 1]
  let moves = [-1, 1, -2, 2] // left, right, up, down
  let move;
  // check if the puzzle has been solved after 600 moves
  for (let i = 0; i < 600; i++) {
    move = moves[Math.floor(Math.random() * 4)]
    if(move === -1){
      
      left(matrix, noneX, noneY);
      noneX = noneX - 1 < 0? 0 : noneX - 1;
    } else if(move === 1){

      right(matrix, noneX, noneY);
      noneX = noneX + 1 > gridSize - 1? gridSize - 1 : noneX + 1;
    } else if(move === -2){

      up(matrix, noneX, noneY);
      noneY = noneY - 1 < 0? 0 : noneY - 1;
    } else if(move === 2){
      down(matrix, noneX, noneY);
      noneY = noneY + 1 > gridSize - 1? gridSize - 1 : noneY + 1;
    }
  }


  retrace();
  let initialState = matrix.flat(1)
  .map((x) => x.innerText || '0')
  .join(',');
  moveSequence = [`D:${gridSize},${gridSize}-S:${initialState}`]
};
  

const checkWinner = (size = 3) => {
    let winningString = '';
    for (let i = 1; i < size ** 2; i++) {
      winningString += i;
    }
    winningString += '_';
    const currentState = [...document.querySelectorAll('.btn')]
      .map((x) => x.innerText || '_')
      .join('');
    if (currentState === winningString) {
      document.getElementById('win').innerText = 'You won!';
      // document
      //   .querySelectorAll('.btn')
      //   .forEach((btn) => btn.setAttribute('disabled', true));
      play.style.visibility = 'visible';
      app.style.backgroundColor = '#4f43'; // append a classList to the button
      let sound = new Audio("/static/algorithm/media/win.mp3");
      sound.play();
    } else {
      document.getElementById('win').innerText = '';
      play.style.visibility = 'hidden';
      app.style.backgroundColor = 'transparent';
    }
  };
  


const handleClick = (e) => {
  let [x1, y1] = e.target.id.split('_');
  let [currX, currY] = [parseInt(x1) - 1, parseInt(y1) - 1];
  let none = document.querySelector('.none');
  let [x2, y2] = none.id.split('_');
  let [noneX, noneY] = [parseInt(x2) - 1, parseInt(y2) - 1];
  
  let deltaX = currX - noneX;
  let deltaY = currY - noneY;
  let code;
  if ((Math.abs(deltaX) >= 1 && Math.abs(deltaY) === 0) || (Math.abs(deltaX) === 0 && Math.abs(deltaY) >= 1)) {

    if ((Math.abs(deltaX) >= 1 && Math.abs(deltaY) === 0)){
      if(deltaX < 0){
        // left
        left(matrix, noneX, noneY, Math.abs(deltaX));
        moves++;
        code = `l${Math.abs(deltaX)}`;
        moveSequence.push(code);

        writeMove(moves, code);

      } else if(deltaX > 0) {
        // right

        right(matrix, noneX, noneY, Math.abs(deltaX));
        moves++;
        code = `r${Math.abs(deltaX)}`;
        moveSequence.push(code);
        writeMove(moves, code);


      }
    }
    else if (Math.abs(deltaX) === 0 && Math.abs(deltaY) >= 1){
      if(deltaY < 0){
        // up

        up(matrix, noneX, noneY, Math.abs(deltaY));
        moves++;
        code = `u${Math.abs(deltaY)}`;
        moveSequence.push(code);
        writeMove(moves, code);

      } else if(deltaY > 0) {
        // down

        down(matrix, noneX, noneY, Math.abs(deltaY));
        moves++;
        code = `d${Math.abs(deltaY)}`;
        moveSequence.push(code);
        writeMove(moves, code);
      }
    }

    retrace();
    movesEl.innerText = moves;
    checkWinner(gridSize);
  }
};
  

const btn = (n, x, y) => {
  const b = document.createElement('button');
  b.innerText = n;
  b.setAttribute('class', 'btn el soundButton');
  b.setAttribute('id', `${x}_${y}`);
  b.addEventListener('click', handleClick);
  return b;
};

const CreateBoard = () => {
  app.innerHTML = '';
  for (let y = 1; y <= board.y_size; y++) {
      for (let x = 1; x <= board.x_size; x++) {
          if (matrix[y - 1][x - 1] === '') {
              matrix[y - 1][x - 1] = btn('', x, y);
              matrix[y - 1][x - 1].setAttribute('class', 'btn none');
            } else {
              matrix[y - 1][x - 1] = btn(matrix[y - 1][x - 1], x, y);
            }
      }
  }
  app.style['grid-template-columns'] = `repeat(${gridSize}, 1fr)`;
  app.style['grid-template-rows'] = `repeat(${gridSize}, 1fr)`;
  retrace();
};


const retrace = () => {
  app.innerHTML = '';
  for (let el of matrix.flat(1)) {
    app.appendChild(el);
  }
};

const prevState = () => {
  let step = moveSequence[moves];
  let direction = step.charAt(0);
  let steps = parseInt(step.substring(1));
  if(["l", "r", "u", "d"].includes(direction)){

    let none = document.querySelector('.none');
    let [x2, y2] = none.id.split('_');
    let [holeX, holeY] = [parseInt(x2) - 1, parseInt(y2) - 1];
    if (direction === "l"){
      right(matrix, holeX, holeY, steps);
    } else if(direction == "r"){
      left(matrix, holeX, holeY, steps);
    } else if(direction == "u"){
      down(matrix, holeX, holeY, steps);
    } else if(direction == "d"){
      up(matrix, holeX, holeY, steps);
    }
    moves--;
    movesEl.innerText = moves;
    retrace();
    document
      .querySelectorAll('.btn')
      .forEach((btn) => btn.setAttribute('disabled', true));
  
      highlightMove(moves);
  
    checkWinner(gridSize);
  }
}


const nextState = (index = null, retraceBoard = true) => {
  if(index !== null){
    moves = index - 1;
  }
  console.log(moves);
  // # make this moveSequence dynamic
  if(moves + 1 < moveSequence.length){
    console.log(moves);
    let step = moveSequence[moves + 1];
    let direction = step.charAt(0);
    let steps = parseInt(step.substring(1));
    console.log(step);
    if(["l", "r", "u", "d"].includes(direction)){
      console.log("Checked!");

      let none = document.querySelector('.none');
      let [x2, y2] = none.id.split('_');
      let [holeX, holeY] = [parseInt(x2) - 1, parseInt(y2) - 1];
      if (direction === "r"){
        right(matrix, holeX, holeY, steps);
      } else if(direction == "l"){
        left(matrix, holeX, holeY, steps);
      } else if(direction == "d"){
        down(matrix, holeX, holeY, steps);
      } else if(direction == "u"){
        up(matrix, holeX, holeY, steps);
      }
      moves++;
      movesEl.innerText = moves;
      retraceBoard && retrace();
      console.log("Working!");
      highlightMove(moves);
      checkWinner(gridSize);
      if(moves == moveSequence.length - 1){
        document
          .querySelectorAll('.btn')
          .forEach((btn) => btn.removeAttribute('disabled'));
      }
    }

  }

}

const highlightMove = (index) => {
  document.querySelectorAll(".move")
  .forEach(move => move.classList.remove('highlight'));

  let divBox = document.getElementById(`move${index}`);
  divBox.classList.add('highlight');

  divBox.scrollIntoView({
    behavior: 'smooth', // smooth scrolling
    block: 'nearest',   // scroll the nearest part of the element into view
    inline: 'center'    // center the element horizontally in the view
  });
}


const redrawSequence = (index) => {
  // use moves to get the index of the next one sha
  let [dimension, initial] = moveSequence[0].split("-")

  let [dim, ini] = [dimension.split(":")[1], initial.split(":")[1]];

  matrix = generateMatrix(3, ini);

  CreateBoard();

  for(let i = 1; i <= index; i++){
    nextState(i, false);
  }
  retrace();
}

const writeMove = (index, code) => {
  let move = document.createElement("span");
  move.textContent = `${index}. ${code}`;
  move.id = `move${index}`;
  move.classList.add("move", "soundButton", "highlight");
  move.addEventListener('click', () => { redrawSequence(index)});
  moveSequenceBox.appendChild(move);
  moveSequenceBox.scrollLeft = moveSequenceBox.scrollWidth;
  console.log("Working!");
  highlightMove(index);
}

const writeMoves = () => {
  moveSequenceBox.innerHTML = '';
  for(let i = 1; i < moveSequence.length; i++){
    writeMove(i, moveSequence[i]);
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  console.log(cookieValue);
  return cookieValue;
}

prev.addEventListener('click', prevState);
next.addEventListener('click', (e) => {nextState()});

const showSolution = () => {
  fetch('/api/post-json/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',  // Indicate the content type is JSON
          'X-CSRFToken': getCookie('csrftoken')  // Include the CSRF token in headers
      },
      body: JSON.stringify({ matrix: Array.from(matrix.flat(1)).map(button => button.textContent === '' ? '0' : button.textContent).join() })  // Send the name in the request body
  })
  .then(response => response.json())  // Parse the JSON from the response
  .then(data => {
      // Handle the JSON data
      moveSequence = moveSequence.concat(data.message.split(','));
      writeMoves();
  })
  .catch(error => console.error('Error sending POST request:', error));
}

solutionBtn.addEventListener('click', showSolution);


CreateBoard();
shufflePuzzle();