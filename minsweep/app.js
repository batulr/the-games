document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const result = document.getElementById("result");
  const flagsLeft = document.querySelector("#flags-left");
  let width = 10;
  let bomb_count = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  function createBoard() {
    const bombArray = Array(bomb_count).fill("bomb");
    const emptyArray = Array(width * width - bomb_count).fill("valid");
    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      square.addEventListener("click", function (e) {
        click(square);
      });

      //cntrl and left click
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //add numbers
    for (let i = 0; i < width * width; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb"))
        total++;

      if (
        i > 9 &&
        !isRightEdge &&
        squares[i + 1 - width].classList.contains("bomb")
      )
        total++;

      if (i > 10 && squares[i - width].classList.contains("bomb")) total++;

      if (
        i > 11 &&
        !isLeftEdge &&
        squares[i - 1 - width].classList.contains("bomb")
      )
        total++;

      if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb"))
        total++;

      if (
        i < 90 &&
        !isLeftEdge &&
        squares[i - 1 + width].classList.contains("bomb")
      )
        total++;

      if (
        i < 88 &&
        !isRightEdge &&
        squares[i + 1 + width].classList.contains("bomb")
      )
        total++;

      if (i < 89 && squares[i + width].classList.contains("bomb")) total++;

      squares[i].setAttribute("data", total);
      console.log(squares[i]);
    }
  }
  createBoard();

  //add Flag with right click
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bomb_count) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = " 🚩";
        flags++;
        flagsLeft.innerHTML = bomb_count - flags;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = bomb_count - flags;
      }
    }
  }

  // when a square is clicked
  function click(square) {
    let currentId = square.id;

    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    ) {
      checkGame();
      return;
    }

    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        square.innerHTML = total;
        return;
      }
      // when the total = 0 - checking neighbours
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  // check for neighboring squares once a square is clicked
  function checkSquare(square, cid) {
    const isLeftEdge = cid % width === 0;
    const isRightEdge = cid % width === width - 1;

    setTimeout(() => {
      if (cid > 0 && !isLeftEdge) {
        const newId = squares[parseInt(cid) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid > 9 && !isRightEdge) {
        const newId = squares[parseInt(cid) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid > 10) {
        const newId = squares[parseInt(cid - width)].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid > 11 && !isLeftEdge) {
        const newId = squares[parseInt(cid) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid < 98 && !isRightEdge) {
        const newId = squares[parseInt(cid) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid < 90 && !isLeftEdge) {
        const newId = squares[parseInt(cid) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid < 88 && !isRightEdge) {
        const newId = squares[parseInt(cid) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (cid < 89) {
        const newId = squares[parseInt(cid) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //checking if all the squares without bomb have been selected
  function checkGame() {
    let match = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("checked") &&
        !squares[i].classList.contains("bomb")
      ) {
        match++;
      }
    }
    if (match === width * width - bomb_count) {
      result.innerHTML = "You Win!";
      document.getElementById("play").style.display = "block";
      isGameOver = true;
      return;
    }
  }

  // game over func
  function gameOver(square) {
    console.log("Boom! You are bombed");

    isGameOver = true;

    //show all squares having a bomb
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
    document.getElementById("play").style.display = "block";
  }

  // func to check for win
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
      if (matches === bomb_count) {
        result.innerHTML = "YOU WIN!";
        document.getElementById("play").style.display = "block";
        isGameOver = true;
      }
    }
    return;
  }
});

//reload func for button
function reload() {
  window.location.reload();
}
