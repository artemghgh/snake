// "use strict";

const gridField = document.querySelector(".grid-field");
const scoreCounter = document.querySelector(".score__count");
let size;
let speed;
let length;
let x,
  y,
  nextX,
  nextY,
  nextMoveHead,
  nextMoveBody,
  prevX,
  prevY,
  direction,
  directionCash,
  appleX,
  appleY,
  appleLocation,
  bodyDirection,
  bodyDirection2,
  moving;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

switch (random(1, 4)) {
  case 1:
    direction = "up";
    break;
  case 2:
    direction = "down";
    break;
  case 3:
    direction = "right";
    break;
  case 4:
    direction = "left";
    break;
}

function makeGrid() {
  gridField.replaceChildren();
  gridField.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  for (let y = 1; y <= size; y++) {
    for (let x = 1; x <= size; x++) {
      let cell = document.createElement("div");
      cell.className = `cell x${x}-y${y}`;
      cell.dataset.timeForDisapear = 0;
      gridField.append(cell);
    }
  }
}

function createSnake() {
  switch (random(1, 4)) {
    case 1:
      direction = "up";
      break;
    case 2:
      direction = "down";
      break;
    case 3:
      direction = "right";
      break;
    case 4:
      direction = "left";
      break;
  }

  directionCash = direction;

  let max = size - 5;
  let min = 5;
  x = random(min, max);
  y = random(min, max);

  switch (direction) {
    case "up":
      bodyDirection = `.x${x}-y${y + 1}`;
      bodyDirection2 = `.x${x}-y${y + 2}`;
      break;
    case "down":
      bodyDirection = `.x${x}-y${y - 1}`;
      bodyDirection2 = `.x${x}-y${y - 2}`;
      break;
    case "right":
      bodyDirection = `.x${x - 1}-y${y}`;
      bodyDirection2 = `.x${x - 2}-y${y}`;
      break;
    case "left":
      bodyDirection = `.x${x + 1}-y${y}`;
      bodyDirection2 = `.x${x + 2}-y${y}`;
      break;
  }

  let headPosition = document.querySelector(`.x${x}-y${y}`);
  headPosition.classList.add("snake-head");
  headPosition.dataset.timeForDisapear = speed * 4;
  let bodyPosition1 = document.querySelector(bodyDirection);
  bodyPosition1.classList.add("snake-body");
  bodyPosition1.dataset.timeForDisapear = speed * 3;
  let bodyPosition2 = document.querySelector(bodyDirection2);
  bodyPosition2.classList.add("snake-body");
  bodyPosition2.dataset.timeForDisapear = speed * 2;
}

function moveSnake(direction) {
  prevX
    ? (nextMoveBody = gridField.querySelector(`.x${prevX}-y${prevY}`))
    : (nextMoveBody = gridField.querySelector(`.x${x}-y${y}`));
  nextMoveBody !== null ? nextMoveBody.classList.remove(".snake-head") : 1;
  nextMoveBody ? nextMoveBody.classList.add("snake-body") : 1;

  if (directionCash === "up" && direction !== "down") {
    directionCash = direction;
  } else if (directionCash === "down" && direction !== "up") {
    directionCash = direction;
  } else if (directionCash === "right" && direction !== "left") {
    directionCash = direction;
  } else if (directionCash === "left" && direction !== "right") {
    directionCash = direction;
  }

  switch (directionCash) {
    case "up":
      y -= 1;
      break;
    case "down":
      y += 1;
      break;
    case "right":
      x += 1;
      break;
    case "left":
      x -= 1;
      break;
  }

  nextMoveHead = document.querySelector(`.x${x}-y${y}`);

  if (
    x < 1 ||
    y < 1 ||
    x > size ||
    y > size ||
    nextMoveHead.classList.contains("snake-body")
  ) {
    gridField.replaceChildren();
    clearInterval(moving);
    document.querySelector(".game-over__score").textContent = `Your score ${
      length / speed - 4
    }`;
    gameOverPopUp.style.display = "block";
  }

  nextMoveHead.dataset.timeForDisapear = `${length + speed}`;
  nextMoveHead.classList.add("snake-head");

  if (nextMoveHead.classList.contains("apple")) {
    nextMoveHead.classList.remove("apple");
    length += speed;
    scoreCounter.textContent = length / speed - 4;
    let addOneLength = document.querySelectorAll("snake-head, snake-body");
    for (let elem of addOneLength) {
      if (elem != 0) {
        elem.dataset.timeForDisapear += speed;
      }
    }
  } else {
    for (let cell of document.querySelectorAll(".cell")) {
      if (cell.dataset.timeForDisapear > 0) {
        cell.dataset.timeForDisapear -= speed;
      }
    }
  }

  for (let elem of document.querySelectorAll(".cell")) {
    if (elem.dataset.timeForDisapear <= speed) {
      elem.classList.remove("snake-body", "snake-head");
    }
  }

  prevX = x;
  prevY = y;
}

function dropApple(size) {
  appleX = random(1, size);
  appleY = random(1, size);

  appleLocation = gridField.querySelector(`.x${appleX}-y${appleY}`);

  if (document.querySelector(".apple") === null) {
    if (!appleLocation.classList.contains("snake-body", "snake-head")) {
      appleLocation.classList.add("apple");
    } else {
      dropApple(size);
    }
  }
}
document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      direction = "up";
      break;
    case "KeyS":
    case "ArrowDown":
      direction = "down";
      break;
    case "KeyD":
    case "ArrowRight":
      direction = "right";
      break;
    case "KeyA":
    case "ArrowLeft":
      direction = "left";
      break;
  }
});

const startButton = document.querySelector(".settings__submit");
const restartButton = document.querySelector(".game-over__restart");
const gameOverPopUp = document.querySelector(".game-over");
const settingsPopUp = document.querySelector(".settings");

startButton.addEventListener("click", () => {
  speed = Number(setSpeed.value) * 10;
  size = Number(fieldSize.value);
  length = speed * 4;
  settingsPopUp.style.display = "none";
  prevX = undefined;
  makeGrid();
  createSnake();
  moving = setInterval(() => {
    moveSnake(direction);
    dropApple(size);
  }, speed * 100);
});

restartButton.addEventListener("click", () => {
  gridField.replaceChildren();
  gameOverPopUp.style.display = "none";
  settingsPopUp.style.display = "block";
  scoreCounter.textContent = "0";
});
