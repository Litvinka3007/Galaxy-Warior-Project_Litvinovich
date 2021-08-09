// Add sounds
let backAudio = new Audio('sounds/back.mp3');
backAudio.volume = 0.2;

let shotSound = new Audio('sounds/fire.mp3');
shotSound.volume = 0.4;

let crashSound = new Audio('sounds/crash.mp3');
crashSound.volume = 0.7;

let bonusAudio = new Audio('sounds/bonus.mp3');
bonusAudio.volume = 0.5;

let gameoverAudio = new Audio("sounds/gameover.mp3");
gameoverAudio.volume = 0.5;

let bangAudio = new Audio('sounds/bigbang.mp3');
bangAudio.volume = 0.5;

bangAudio.onload = soundClick;

// Add images
let shipImg = new Image();
shipImg.src = 'img/ship.png';

let asteroidImg = new Image();
asteroidImg.src = 'img/aster.png';

let asteroidImg2 = new Image();
asteroidImg2.src = 'img/aster2.png';

let alien = new Image();
alien.src = 'img/enemy_menu.png';

let alien2 = new Image();
alien2.src = 'img/enemy2.png';

let alien3 = new Image();
alien3.src = 'img/enemy3.png';

let explosion = new Image();
explosion.src = 'img/boom.png';

let planetImg = new Image();
planetImg.src = 'img/moon.png';

let planetImg2 = new Image();
planetImg2.src = 'img/planet.png';

let planetImg3 = new Image();
planetImg3.src = 'img/mars.png';

let fire1 = new Image();
fire1.src = 'img/fire.png';

let bonusImg = new Image();
bonusImg.src = 'img/bonus.png';

let bonusImg2 = new Image();
bonusImg2.src = 'img/health_point.png';

let degreesCircle = 360;

let newScore = 0;
let nickText = '';

// Setting the timer
let timerGame = 0;

// Counts how many times the timer has started up to 1000
let timer = 0;

// Set an array of shots
let fire = [];

// Set an array of asteroids
let asteroids = [];

// Set an array of explosions
let boom = [];

// Set an array of bonuses
let bonus = [];

let arrScore = [];

// Set playing window size
let bodyHeight = document.body.offsetHeight;
let bodyWidth = document.body.offsetWidth;

let playing = {
  color: '#000000',
  height: bodyHeight,
  width: bodyWidth,
  top: 0,
  left: 0,
};

// Set sizes
let planetSize = ((bodyHeight + bodyWidth) / 2) / 3;
let spaceshipSize = Math.round(((bodyHeight + bodyWidth) / 2) / 6);
let asteroidSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
let boomSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
let bonusSize = Math.round(((bodyHeight + bodyWidth) / 2) / 12);
let healthSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);
let bangSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);
let scoreTableHeight;
let scoreTableWidth;

// Speed of explosion
let boomSpeed = 0;
// Acceleration of explosion
let boomAccel = 0.2;

let newStar = new Star();
let newFire = new Fire();
let newEnemy = new Enemy();
let control = new Controller();
let ship = new Spaceship();
let planet = new Planet();
let newBonus = new Bonus();

let isPlaying = false;
let tableNone = false;
let randPass = 0;
let scoreData;

window.onload = startDocument;

function startDocument() {
  location.hash = 'menu';

  // Find out the dimensions and position the record table
  scoreTable.style.display = 'block';
  scoreTableHeight = scoreTable.offsetHeight;
  scoreTableWidth = scoreTable.offsetWidth;
  scoreTable.style.top = -scoreTableHeight + 'px';
  scoreTable.style.left = bodyWidth / 2 - scoreTableWidth / 2 + 'px';
}

function tableScore() {
  scoreTable.style.display = 'block';

  if (!tableNone) {
    read();
    scoreTable.style.top = '50%';
    scoreTable.style.left = '50%';
    scoreTable.style.transform = 'translateZ(0) translateX(-50%) translateY(-50%)';
    tableNone = true;
  } else {
    scoreTable.style.top = '0';
    scoreTable.style.left = '50%';
    scoreTable.style.transform = 'translateZ(0) translateX(-50%)  translateY(-100%) ';
    tableNone = false;
  }
}

// Subscribe to the URL hash change
window.onhashchange = control.switchURLHash;

// When restart or leave the page show a warning (if the game is running)
window.onbeforeunload = control.befUnload;

// Subscribe to the screen change
window.addEventListener('resize', control.resize, false);

// CANVAS
let newCanvas = document.querySelector('.gameCanvas');
newCanvas.setAttribute('height', playing.height);
newCanvas.setAttribute('width', playing.width);
let context = newCanvas.getContext('2d');

let nicknameInfo = document.querySelector('.nickInfo');
let nickname = document.querySelector('.nickname');
let wrapper = document.querySelector('.menuDiv');
let gameWrapper = document.querySelector('.gameDiv');
let gameOverWrapper = document.querySelector('.gameOverDiv');
let scoreTable = document.querySelector('.tableDiv');

function startHash() {
  location.hash = 'game';
}

function startMenuHash() {
  location.hash = 'menu';
  lockGet(randPass);
}

// Start the game by click on the button
function startGame() {
  randPass = randomNum(1, 5000);
  isPlaying = true;
  location.hash = 'game';

  // Hide the main menu
  wrapper.style.display = 'none';

  // Open the game elements
  gameWrapper.style.display = 'block';

  // Fix the name of the player
  nickText = nickname.value;

  // If the field "nickname" is empty, assign "user"
  if (nickText == '') nickText = 'User';

  nicknameInfo.innerText = nickText + ' : ' + scoreText(newScore);

  // Display the number of lives and bonuses
  displayHealth();
  displayBonuses();

  newCanvas.style.cursor = 'none';    // ПОМЕНЯТЬ КУРСОР НА КРАСНЫЙ ПРИЦЕЛ

  clickSound(backAudio);

  control.start();
  gameRun();
}

// Start the main menu
function startMenu() {
  location.hash = 'menu';

  if (isPlaying) {
    backAudio.pause();
  }

  // If there is a timer, delete it
  if (timerGame) {
    cancelAnimationFrame(timerGame);
    timerGame = 0;
  }

  // Open the main menu
  wrapper.style.display = 'block';

  // Hide the game elements
  gameWrapper.style.display = 'none';
  gameOverWrapper.style.display = 'none';

  // Set the initial values
  asteroids.length = 0;
  bonus.length = 0;
  ship.lives = 4;
  ship.bonuses = 3;
  newScore = 0;
  nicknameInfo.innerText = nickText + ' : ' + scoreText(newScore);
}

function gameOver() {
  let overScore = document.querySelector('.overInfo');

  // Hide the game elements
  gameWrapper.style.display = 'none';
  gameOverWrapper.style.display = 'block';

  // Unsubscribe from the game events
  control.remList();

  if (timerGame) {
    cancelAnimationFrame(timerGame);
    timerGame = 0;
  }

  newCanvas.style.cursor = 'default';

  backAudio.pause();

  clickSound(gameoverAudio);

  isPlaying = false;

  overScore.innerText = nickText + ' : ' + scoreText(newScore);
}

function gameRun() {
  // If there is a timer, delete it, otherwise set it
  if (timerGame) {
    cancelAnimationFrame(timerGame);
    timerGame = 0;
  }

  timerGame = requestAnimationFrame(gameRun);

  updateGame();
  renderGame();
}

function updateGame() {
  timer++;

  if (timer > 1000) timer = 0;

  // Create stars
  if (timer % 2 === 0) {
    newStar.addStarObj();
  }

  // Move stars
  newStar.starObjMove();

  // Create planets
  if (timer === 5 || timer === 540) {
    planet.addPlanet();
  }

  // Move planets
  planet.planetMove();

  // Create bonus
  if (timer === 5) {
    newBonus.addBonus();
  }

  // Move bonus
  newBonus.bonusMove();

  // Create enemies
  if (timer % 30 === 0) {
    newEnemy.addEnemy();
  }

  // Move enemy
  newEnemy.enemyMove();

  // Explosion animation
  for (let i = 0; i < boom.length; i++) {

    // Animation speed
    boom[i].animX = boom[i].animX + boomAccel;

    // Change the sprite rows
    if (boom[i].animX > 8) { boom[i].animY++; boom[i].animX = 0 }

    // If there are no lines anymore, delete it
    if (boom[i].animY > 0) boom.splice(i, 1);
  }

  // Move the shot
  newFire.fireMove();

  // Move the ship at a speed of 0, when press the key, increase the speed
  ship.moveSpaceship();
}

function renderGame() {
  context.fillStyle = playing.color;
  context.fillRect(playing.top, playing.left, playing.width, playing.height);

  planet.planetPaint();
  newStar.starObjPaint();
  newBonus.bonusPaint();
  newEnemy.enemyPaint();
  newFire.firePaint();

  // Draw an explosion
  for (let i = 0; i < boom.length; i++) {
    context.drawImage(explosion, 65 * Math.floor(boom[i].animX), 65 * Math.floor(boom[i].animY), 65, 65, boom[i].x, boom[i].y, boomSize, boomSize);
  }

  ship.paintSpaceship();
}

// UTILS

// Function to generate a random number
function randomNum(n, m) {
  return Math.floor(Math.random() * (m - n + 1)) + n;
}

// Function to generate a random color
function generateColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Function for converting degrees to radians
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

// Function for converting the game score to a string
function scoreText(number) {
  let s = String(number);
  let str = '00000000';
  let n = str.length - s.length;
  str = str.slice(0, n);
  str = str + number;
  return str;
}

// Function shows the number of lives
function displayHealth() {
  let healthContainer = document.querySelector('.healthPoint');
  healthContainer.style.display = 'inline-block';
  healthContainer.style.position = 'absolute';

  if (healthContainer.children.length > 0) {
    while (healthContainer.children.length !== 0) {
      healthContainer.removeChild(healthContainer.lastChild);
    }
  }

  for (let i = 0; i < ship.lives - 1; i++) {
    let healthImg = document.createElement('IMG');
    healthImg.src = 'img/health_point.png';
    healthImg.style.height = healthSize + 'px';
    healthImg.style.width = healthSize + 'px';
    healthImg.style.marginTop = healthSize / 5 + 'px';
    healthImg.style.display = 'block';

    healthContainer.appendChild(healthImg);
  }
}

// Function shows the number of bonuses
function displayBonuses() {
  let bangContainer = document.querySelector('.bonuses');
  bangContainer.style.display = 'inline-block';
  bangContainer.style.position = 'absolute';

  if (bangContainer.children.length > 0) {
    while (bangContainer.children.length !== 0) {
      bangContainer.removeChild(bangContainer.lastChild);
    }
  }

  for (let i = 0; i < ship.bonuses; i++) {
    let bangImg = document.createElement('IMG');
    bangImg.src = 'img/bonus.png';
    bangImg.style.height = bangSize + 'px';
    bangImg.style.width = bangSize + 'px';
    bangImg.style.marginTop = bangSize / 5 + 'px';
    bangImg.style.display = 'block';

    bangContainer.appendChild(bangImg);
  }
}

// Functions for playing sounds
function clickSound(clickAudio) {
  clickAudio.currentTime = 0;
  clickAudio.play();
}

function soundClick() {

  shotSound.play();
  shotSound.pause();

  crashSound.play();
  crashSound.pause();

  backAudio.play();
  backAudio.pause();

  bonusAudio.play();
  bonusAudio.pause();

  bangAudio.play();
  bangAudio.pause();
}