const board = document.getElementById("chessboard");
const statusDisplay = document.getElementById("status");
const whiteTimerDisplay = document.getElementById("white-timer");
const blackTimerDisplay = document.getElementById("black-timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const mainContainer = document.querySelector(".main-container");
const game = new Chess();

const playerColor = 'w';
const botColor = 'b';

let selectedSquare = null;
let whiteTime = 10 * 60;
let blackTime = 10 * 60;
let timerInterval;
let isGameStarted = false;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateTimers() {
  whiteTimerDisplay.textContent = formatTime(whiteTime);
  blackTimerDisplay.textContent = formatTime(blackTime);
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (game.turn() === 'w') {
      whiteTime--;
      if (whiteTime <= 0) {
        statusDisplay.textContent = "Ժամանակը վերջացավ։ Սևերը հաղթեցին։";
        clearInterval(timerInterval);
      }
    } else {
      blackTime--;
      if (blackTime <= 0) {
        statusDisplay.textContent = "Ժամանակը վերջացավ։ Սպիտակները հաղթեցին։";
        clearInterval(timerInterval);
      }
    }
    updateTimers();
  }, 1000);
}

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
  if (!isGameStarted || game.turn() === botColor || game.game_over()) {
    return;
  }
  
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
      resetTimer();
      if (game.turn() === botColor) {
        setTimeout(makeBotMove, 500);
      }
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

function makeBotMove() {
  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) {
    return;
  }
  
  const move = findBestMove(game);
  game.move(move);
  renderBoard();
  updateStatus();
  resetTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  if (!game.game_over()) {
    startTimer();
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

function findBestMove(game) {
  const possibleMoves = game.moves();
  let bestMove = possibleMoves[0];
  let bestValue = -Infinity;
  const alpha = -Infinity;
  const beta = Infinity;

  for (const move of possibleMoves) {
    game.move(move);
    const boardValue = minimax(game, 2, alpha, beta, false);
    game.undo();
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimax(game, depth, alpha, beta, maximizingPlayer) {
  if (depth === 0 || game.game_over()) {
    return evaluateBoard(game);
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    const possibleMoves = game.moves();
    for (const move of possibleMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const possibleMoves = game.moves();
    for (const move of possibleMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) {
        break;
      }
    }
    return minEval;
  }
}

function evaluateBoard(game) {
  const board = game.board();
  let totalEvaluation = 0;
  const pieceValues = {
    'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900
  };

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const value = pieceValues[piece.type];
        if (piece.color === botColor) {
          totalEvaluation += value;
        } else {
          totalEvaluation -= value;
        }
      }
    }
  }

  if (game.in_checkmate()) {
    if (game.turn() === botColor) {
      totalEvaluation -= 1000;
    } else {
      totalEvaluation += 1000;
    }
  }

  return totalEvaluation;
}

function updateStatus() {
  if (!isGameStarted) {
    statusDisplay.textContent = 'Սեղմեք «Սկսել» կոճակը։';
    return;
  }
  
  if (game.in_checkmate()) {
    clearInterval(timerInterval);
    statusDisplay.textContent = `Շախ և մատ։ ${game.turn() === "w" ? "Սևերն են հաղթել։" : "Սպիտակներն են հաղթել։"}`;
  } else if (game.in_stalemate()) {
    clearInterval(timerInterval);
    statusDisplay.textContent = "Ոչ ոքի։";
  } else if (game.in_check()) {
    statusDisplay.textContent = `${game.turn() === "w" ? "Սպիտակներին" : "Սևերին"} շախ է։`;
  } else {
    statusDisplay.textContent = `${game.turn() === "w" ? "Սպիտակների" : "Սևերի"} հերթն է։`;
  }
}

function startGame() {
  if (isGameStarted) return;
  isGameStarted = true;
  mainContainer.classList.add("game-started");
  startBtn.style.display = "none";
  resetBtn.style.display = "inline-block";
  startTimer();
  updateStatus();
  if (game.turn() === botColor) {
    setTimeout(makeBotMove, 500);
  }
}

function resetGame() {
  clearInterval(timerInterval);
  isGameStarted = false;
  game.reset();
  selectedSquare = null;
  whiteTime = 10 * 60;
  blackTime = 10 * 60;
  updateTimers();
  mainContainer.classList.remove("game-started");
  startBtn.style.display = "inline-block";
  resetBtn.style.display = "none";
  renderBoard();
  updateStatus();
}

renderBoard();
updateTimers();
updateStatus();

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);