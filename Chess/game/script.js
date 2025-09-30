const board = document.getElementById("chessboard");
const statusDisplay = document.getElementById("status");
const game = new Chess();

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const whiteTimerDisplay = document.getElementById("white-timer");
const blackTimerDisplay = document.getElementById("black-timer");
const mainContainer = document.querySelector(".main-container");

let selectedSquare = null;
let whiteTime = 600; 
let blackTime = 600; 
let timerId = null;
let isGameStarted = false;

function renderBoard() {
  board.innerHTML = "";
  const position = game.board();

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = position[row][col];
      if (piece) {
        square.textContent = getUnicode(piece);
        square.dataset.piece = piece.type;
        square.dataset.color = piece.color;
        square.classList.add("glow-piece");
      }

      square.addEventListener("click", () => handleClick(square));
      board.appendChild(square);
    }
  }
}

function getSquareNotation(row, col) {
  const files = "abcdefgh";
  return files[col] + (8 - row);
}

function getUnicode(piece) {
  const symbols = {
    p: { w: "♙", b: "♟" },
    r: { w: "♖", b: "♜" },
    n: { w: "♘", b: "♞" },
    b: { w: "♗", b: "♝" },
    q: { w: "♕", b: "♛" },
    k: { w: "♔", b: "♚" },
  };
  return symbols[piece.type][piece.color];
}

function handleClick(square) {
  if (!isGameStarted) return;

  const row = parseInt(square.dataset.row);
  const col = parseInt(square.dataset.col);
  const notation = getSquareNotation(row, col);

  if (selectedSquare) {
    const fromNotation = getSquareNotation(
      parseInt(selectedSquare.dataset.row),
      parseInt(selectedSquare.dataset.col)
    );

    const move = game.move({
      from: fromNotation,
      to: notation,
      promotion: "q"
    });

    if (move) {
      selectedSquare.classList.remove("selected");
      clearHighlights();
      selectedSquare = null;
      renderBoard();
      updateStatus();
    } else {
      selectedSquare.classList.remove("selected");
      clearHighlights();
      selectedSquare = null;
      if (square.dataset.color === game.turn()) {
        selectedSquare = square;
        selectedSquare.classList.add("selected");
        highlightMoves(notation);
      }
    }
  } else if (square.dataset.color === game.turn()) {
    selectedSquare = square;
    selectedSquare.classList.add("selected");
    highlightMoves(notation);
  }
}

function highlightMoves(squareNotation) {
  clearHighlights();
  const moves = game.moves({ square: squareNotation, verbose: true });
  moves.forEach(move => {
    const targetSquare = document.querySelector(
      `[data-row="${8 - move.to[1]}"][data-col="${'abcdefgh'.indexOf(move.to[0])}"]`
    );
    if (targetSquare) {
      if (move.flags.includes('c')) {
        targetSquare.classList.add('capture-highlight');
      } else {
        targetSquare.classList.add('dot-highlight');
      }
    }
  });
}

function clearHighlights() {
  document.querySelectorAll(".selected, .dot-highlight, .capture-highlight").forEach(sq => {
    sq.classList.remove("selected", "dot-highlight", "capture-highlight");
  });
}

function updateStatus() {
  if (!isGameStarted) {
    statusDisplay.textContent = 'Սեղմեք «Սկսել» կոճակը։';
    return;
  }
  
  if (game.in_checkmate()) {
    statusDisplay.textContent = `Շախ և մատ։ ${game.turn() === "w" ? "Սև" : "Սպիտակ"} հաղթեց։`;
    stopGame();
  } else if (game.in_stalemate()) {
    statusDisplay.textContent = "Ոչ-ոքի։";
    stopGame();
  } else if (game.in_check()) {
    statusDisplay.textContent = `${game.turn() === "w" ? "Սպիտակ" : "Սև"} շախի տակ է։`;
  } else {
    statusDisplay.textContent = `${game.turn() === "w" ? "Սպիտակ" : "Սև"} հերթն է։`;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimers() {
  if (game.turn() === 'w') {
    whiteTime--;
  } else {
    blackTime--;
  }
  whiteTimerDisplay.textContent = formatTime(whiteTime);
  blackTimerDisplay.textContent = formatTime(blackTime);

  if (whiteTime <= 0 || blackTime <= 0) {
    statusDisplay.textContent = "Ժամանակը սպառվեց։";
    stopGame();
  }
}

function startGame() {
  if (isGameStarted) return;
  isGameStarted = true;
  mainContainer.classList.add("game-started");
  startBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
  timerId = setInterval(updateTimers, 1000);
  updateStatus();
}

function stopGame() {
  isGameStarted = false;
  clearInterval(timerId);
}

function resetGame() {
  stopGame();
  game.reset();
  selectedSquare = null;
  whiteTime = 600;
  blackTime = 600;
  whiteTimerDisplay.textContent = formatTime(whiteTime);
  blackTimerDisplay.textContent = formatTime(blackTime);
  startBtn.style.display = "inline-block";
  resetBtn.style.display = "none";
  mainContainer.classList.remove("game-started");
  renderBoard();
  updateStatus();
}

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);

renderBoard();
whiteTimerDisplay.textContent = formatTime(whiteTime);
blackTimerDisplay.textContent = formatTime(blackTime);
resetBtn.style.display = "none";
updateStatus();