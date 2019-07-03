var gameInterval, currentLevel, racket, racketWidth, racketHeight, racketLeft, racketTop, ball,
  ballLeft, ballTop, ballStepX, ballStepY, topCollide, bottomCollide, leftCollide, rightCollide,
  piecesToDestroy, collideCounter, containerWidth, containerHeight;
var timer = 50;
var racketStep = 5;
var ballStep = 5;
var moveToRight = false;
var moveToLeft = false;
var piecesArray = [];
var piecesInRow = 10;
var piecesInColumn = 30;
var pieceWidthToHeight = 2;
var bodyPadding = 10;
var controlersHeight = 19;
var gameContainerBorder = 5;
var racketWidthToPieceWidth = 2;
var racketHeightToPieceHeight = 1;
var ballWidth = 10;
function level1() {
  for (var i=0; i<piecesInColumn/2; i++) {
    for (var j=0; j<piecesInRow; j += 2) {
      var newPiece = document.createElement('div');
      newPiece.className = 'simplePiece';
      newPiece.style.width = pieceWidth + 'px';
      newPiece.style.height = pieceHeight + 'px';
      var top = i * pieceHeight;
      newPiece.style.top = top + 'px';
      var left = (j + i % 2) * pieceWidth + 5;
      newPiece.style.left = left + 'px';
      piecesArray.push({
        left: left,
        top: top,
        type: 'simple',
        piece: newPiece
      });
      gameContainer.appendChild(newPiece);
    }
  }
}
function level2() {

}
function createRacket() {
  racket = document.createElement('div');
  racket.id = 'racket';
  racketWidth = racketWidthToPieceWidth * pieceWidth;
  racket.style.width = racketWidth + 'px';
  racketHeight = racketHeightToPieceHeight * pieceHeight;
  racket.style.height = racketHeight + 'px';
  racketLeft = Math.floor((containerWidth - racketWidth) / 2);
  racket.style.left = racketLeft + 'px';
  racketTop = containerHeight - racketHeight;
  racket.style.top = racketTop + 'px';
  gameContainer.appendChild(racket);
}
function createBall() {
  ball = document.createElement('div');
  ball.id = 'ball';
  ball.style.width = ballWidth + 'px';
  ball.style.height = ballWidth + 'px';
  ballLeft = Math.floor((containerWidth - ballWidth) / 2);
  ball.style.left = ballLeft + 'px';
  ballTop = containerHeight - racketHeight - ballWidth;
  ball.style.top = ballTop + 'px';
  gameContainer.appendChild(ball);
}
function setGameLayout() {
  ballStepY = - ballStep;
  ballStepX = 0;
  startButton.innerText = 'Start';
  selectedLevel.innerText = 'Level ' + currentLevel;
  level.value = '0';
  piecesArray.length = 0;
  gameContainer.innerText = '';
  createRacket();
  createBall();
  switch(currentLevel) {
    case 1:
      level1();
      break;
    case 2:
      level2();
      break;
  }
}
function destroyPieces() {
  for (var i=0; i<piecesToDestroy.length; i++) {
    piecesArray[piecesToDestroy[i]].piece.remove();
    piecesArray.splice(piecesToDestroy[i], 1);
  }
}
function changeDirection() {
  if ((topCollide || bottomCollide) && !(leftCollide || rightCollide)) {
    ballStepY *= -1;
  }
  else if ((leftCollide || rightCollide) && !(topCollide || bottomCollide)) {
    ballStepX *= -1;
  }
  else if ((bottomCollide && leftCollide) || (topCollide && rightCollide)) {
    var stepHolder = ballStepY;
    ballStepY = ballStepX;
    ballStepX = stepHolder;
  }
  else if ((bottomCollide && rightCollide) || (topCollide && leftCollide)) {
    var stepHolder = ballStepY;
    ballStepY = - ballStepX;
    ballStepX = - stepHolder;
  }




}
function checkPiecesCollide() {
  for (var i = piecesArray.length - 1; i >= 0; i--) {
    var piece = piecesArray[i];
    if (
      ballTop <= piece.top + pieceHeight &&
      ballTop + ballWidth >= piece.top &&
      ballLeft + ballWidth / 2 > piece.left &&
      ballLeft + ballWidth / 2 < piece.left + pieceWidth
    ) {
      piecesToDestroy.push(i);
      collideCounter++;
      if (ballStepY > 0) {
        topCollide = true;
      }
      else {
        bottomCollide = true;
      }
    }
    else if (
      ballLeft <= piece.left + pieceWidth &&
      ballLeft + ballWidth >= piece.left &&
      ballTop + ballWidth / 2 > piece.top &&
      ballTop + ballWidth / 2 < piece.top + pieceHeight
    ) {
      collideCounter++;
      piecesToDestroy.push(i);
      if (ballStepX > 0) {
        leftCollide = true;
      }
      else {
        rightCollide = true;
      }
    }




    if (collideCounter === 2) {
      break;
    }
  }  
}
function checkBordersCollide() {
  if (ballTop <= 0) {
    collideCounter++;
    bottomCollide = true;
  }
  if (ballLeft <= 0) {
    collideCounter++;
    rightCollide = true;
  }
  else if (ballLeft + ballWidth >= containerWidth){
    collideCounter++;
    leftCollide = true
  }
}
function loseGame() {


  clearInterval(gameInterval);


}
function moveBall() {
  ballLeft += ballStepX;
  ballTop += ballStepY;
  ball.style.left = ballLeft + 'px';
  ball.style.top = ballTop + 'px';
  if (ballTop + ballWidth >= containerHeight) {
    loseGame();
  }
  else {
    piecesToDestroy = [];
    topCollide = false;
    bottomCollide = false;
    leftCollide = false;
    rightCollide = false;
    collideCounter = 0;
    checkBordersCollide();
    if (collideCounter < 2) {
      checkPiecesCollide();
    }
    if (piecesToDestroy.length > 0) {
      destroyPieces();
    }
    if (collideCounter > 0) {
      changeDirection();
    }
  
  
  
  
  }
}
function moveRacket() {
  if (moveToLeft && !moveToRight) {
    racketLeft -= racketStep;
    if (racketLeft < 0) {
      racketLeft = 0;
    }
    racket.style.left = racketLeft + 'px';
  }
  else if (!moveToLeft && moveToRight) {
    racketLeft += racketStep;
    if (racketLeft > (piecesInRow - racketWidthToPieceWidth) * pieceWidth) {
      racketLeft = (piecesInRow - racketWidthToPieceWidth) * pieceWidth;
    }
    racket.style.left = racketLeft + 'px';
  }
}
function gameHandler() {
  moveRacket();
  moveBall();





}
function resumeGame() {
  startButton.innerText = 'Stop';
  level.disabled = true;
  gameInterval = setInterval(gameHandler, timer);
}
function stopGame() {

  clearInterval(gameInterval);

  startButton.innerText = 'Resume';
  level.disabled = false;
}
var wrapper = document.getElementById('wrapper');
var gameContainer = document.getElementById('game_container');
var level = document.getElementById('level');
var selectedLevel = document.getElementById('selected_level');
var availableLevels = document.getElementById('available_levels');
level.addEventListener('change', function() {
  currentLevel = level.value * 1;
  setGameLayout();
});
var startButton = document.getElementById('start_button');
startButton.addEventListener('click', function(e) {
  switch(startButton.innerText) {
    case 'Start':
    case 'Resume':
      resumeGame();
      break;
    case 'Stop':
      stopGame();
      break;
  }
});
window.addEventListener('keydown', function(e) {
  switch(e.key) {
    case 'ArrowRight':
      moveToRight = true;
      break;
    case 'ArrowLeft':
      moveToLeft = true;
      break;
  }
});
window.addEventListener('keyup', function() {
  moveToRight = false;
  moveToLeft = false;
});
var pieceHeight = Math.floor((window.innerHeight - (
  controlersHeight + 3 * bodyPadding + 2 * gameContainerBorder
)) / piecesInColumn);
var pieceWidth = pieceHeight * pieceWidthToHeight;
containerWidth = pieceWidth * piecesInRow;
wrapper.style.width = containerWidth + 2 * gameContainerBorder + 'px';
containerHeight = pieceHeight * piecesInColumn;
gameContainer.style.height = containerHeight + 'px';
var maxLevel = localStorage.getItem('maxLevel') * 1 + 1;
for (var i=1; i<=maxLevel; i++) {
  var newLevel = document.createElement('option');
  newLevel.value = i + '';
  newLevel.innerText = 'Level ' + i;
  availableLevels.appendChild(newLevel);
}
currentLevel = maxLevel;
setGameLayout();