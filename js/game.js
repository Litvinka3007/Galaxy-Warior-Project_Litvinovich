// Add images
let shipImg = new Image();
shipImg.src = "img/ship.png";

let asteroidImg = new Image();
asteroidImg.src = "img/aster.png";

let asteroidImg2 = new Image();
asteroidImg2.src = "img/aster2.png";

let alien = new Image();
alien.src = "img/spaceship.png";

let alien2 = new Image();
alien2.src = "img/alien2.png";

let alien3 = new Image();
alien3.src = "img/alien3.png";

let explosion = new Image();
explosion.src = "img/boom.png";

let planetImg = new Image();
planetImg.src = "img/planet.png"

let planetImg2 = new Image();
planetImg2.src = "img/planet2.png"

let planetImg3 = new Image();
planetImg3.src = "img/planet3.png"

let fire1 = new Image();
fire1.src = "img/fire.png";

let bonusImg = new Image();
bonusImg.src = "img/bonus.png";

let bonusImg2 = new Image();
bonusImg2.src = "img/bonus2.png";

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
  color: '#0a0530',
  height: bodyHeight,
  width: bodyWidth,
  top: 0,
  left: 0,
};

// Set sizes
let planetSize = ((bodyHeight + bodyWidth) / 2) / 3;
let spaceshipSize = Math.round(((bodyHeight + bodyWidth) / 2) / 8);
let asteroidSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
let boomSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
let bonusSize = Math.round(((bodyHeight + bodyWidth) / 2) / 18);
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
let controll = new Controller();
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

  controll.start();
  gameRun();
}

// Start the main menu
function startMenu() {
  location.hash = 'menu';

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
  controll.remList();

  if (timerGame) {
    cancelAnimationFrame(timerGame);
    timerGame = 0;
  }

  newCanvas.style.cursor = 'default';

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

// Spaceship
function Spaceship() {
  let self = this;
  self.posX = playing.width / 2 - spaceshipSize / 2;
  self.posY = playing.height - spaceshipSize;
  self.speedX = 0;
  self.speedY = 0;
  self.lives = 4;
  self.bonuses = 3;

  self.moveSpaceship = function() {
    self.posX += self.speedX;
    self.posY += self.speedY;

    // Checking for going out of bounds on the left
    if (ship.posX <= playing.left) ship.posX = playing.left;

    // Checking for going out of bounds on the right
    if (ship.posX + spaceshipSize > playing.width) ship.posX = playing.width - spaceshipSize;

    // Checking for going out of bounds on the bottom
    if (ship.posY + spaceshipSize > playing.height) ship.posY = playing.height - spaceshipSize;

    // Checking for going out of bounds on the top
    if (ship.posY < playing.top) ship.posY = playing.top;
  }

  self.paintSpaceship = function() {
    // Draw a spaceship
    context.drawImage(shipImg, ship.posX, ship.posY, spaceshipSize, spaceshipSize);
  }

  self.explodeAll = function() {

    document.body.style.filter = 'invert(100%)';

    setTimeout(function() {

      document.body.style.filter = 'none';

      for (let i = 0; i < asteroids.length; i++) {
        // Add an explosion to the array
        boom.push({ x: asteroids[i].posX, y: asteroids[i].posY, animX: boomSpeed, animY: boomSpeed });
        newScore++;
        nicknameInfo.innerText = nickText + ' : ' + scoreText(newScore);

        // Mark the hit
        asteroids[i].del = true;
      }
    }, 500);
  }
}

// Enemies
function Enemy() {
  let self = this;
  let enemyImg;

  self.addEnemy = function() {

    // Add an enemy to the array with coordinates
    let enemyItem = {};
    enemyItem.size = asteroidSize;
    enemyItem.posX = randomNum(playing.left, playing.width - asteroidSize);
    enemyItem.posY = playing.top;
    enemyItem.speed = randomNum(1, 4);
    enemyItem.del = false;
    enemyItem.node = true;
    enemyItem.randomImg = randomNum(1, 5);
    enemyItem.angle = randomNum(35, 155);
    enemyItem.rotateAngle = 0;
    enemyItem.rotateAccel = Math.round((Math.random() < 0.5) ? -1 : 1) / 100;
    asteroids.push(enemyItem);
  }

  // If the player hits an asteroid, add 2 smaller asteroids
  self.addAsteroids = function(size, side) {
    let asteroidItem = {};
    asteroidItem.size = asteroidSize * 70/100;
    asteroidItem.posX = size.posX;
    asteroidItem.posY = size.posY;
    asteroidItem.speed = 2;
    asteroidItem.del = false;
    asteroidItem.randomImg = size.img;

    if (side === 'left') asteroidItem.angle = randomNum(65, 155);
    else asteroidItem.angle = randomNum(0, 55);

    asteroidItem.rotateAngle = 0;
    asteroidItem.rotateAccel = Math.round((Math.random() < 0.5) ? -1 : 1) / 100;
    asteroids.push(asteroidItem);
  }

  self.enemyMove = function() {
    // Moving the asteroid
    for (let i = 0; i < asteroids.length; i++) {

      asteroids[i].posX = Math.round(asteroids[i].posX + asteroids[i].speed * Math.cos(toRadians(asteroids[i].angle)));
      asteroids[i].posY = Math.round(asteroids[i].posY + asteroids[i].speed * Math.sin(toRadians(asteroids[i].angle)));

      if (asteroids[i].posY + asteroids[i].size >= playing.height) {
        asteroids[i].del = true;
      }

      // Hitting the left wall
      if (asteroids[i].posX <= playing.left) {
        asteroids[i].angle = degreesCircle / 2 - asteroids[i].angle;
        asteroids[i].posX = playing.left;
      }

      // Hitting the right wall
      if (asteroids[i].posX + asteroids[i].size >= playing.width) {
        asteroids[i].angle = degreesCircle / 2 - asteroids[i].angle;
        asteroids[i].posX = playing.width - asteroids[i].size;
      }

      // Remove the enemy from the array
      if (asteroids[i].del) {
        asteroids.splice(i, 1);
      }
    }
  }

  self.enemyPaint = function() {
    for (let i = 0; i < asteroids.length; i++) {

      // Set images of enemies
      switch (asteroids[i].randomImg) {
        case 1:

          enemyImg = asteroidImg;
          context.save();
          context.translate(asteroids[i].posX + asteroids[i].size / 2, asteroids[i].posY + asteroids[i].size / 2);
          context.rotate(asteroids[i].rotateAngle);
          context.drawImage(enemyImg, -asteroids[i].size / 2, -asteroids[i].size / 2, asteroids[i].size, asteroids[i].size);
          context.restore();
          asteroids[i].rotateAngle += asteroids[i].rotateAccel;

          break;

        case 2:

          enemyImg = asteroidImg2;
          context.save();
          context.translate(asteroids[i].posX + asteroids[i].size / 2, asteroids[i].posY + asteroids[i].size / 2);
          context.rotate(asteroids[i].rotateAngle);
          context.drawImage(enemyImg, -asteroids[i].size / 2, -asteroids[i].size / 2, asteroids[i].size, asteroids[i].size);
          context.restore();
          asteroids[i].rotateAngle += asteroids[i].rotateAccel;

          break;

        case 3:

          enemyImg = alien;
          context.drawImage(enemyImg, asteroids[i].posX, asteroids[i].posY,asteroids[i].size, asteroids[i].size);

          break;

        case 4:

          enemyImg = alien2;
          context.drawImage(enemyImg, asteroids[i].posX, asteroids[i].posY, asteroids[i].size, asteroids[i].size);

          break;

        case 5:

          enemyImg = alien3;
          context.drawImage(enemyImg, asteroids[i].posX, asteroids[i].posY, asteroids[i].size, asteroids[i].size);

          break;
      }
    }
  }
}

// Firing
function Fire() {
  let self = this;
  self.fireSpeed = 10;
  self.fireSize = spaceshipSize / 3;

  self.addFire = function(x, y) {
    let fireItem = {};
    fireItem.size = self.fireSize;
    fireItem.posX = x - self.fireSize / 2;
    fireItem.posY = y - spaceshipSize / 2;
    fireItem.speedY = self.fireSpeed;
    fire.push(fireItem);
  }

  // Moving the shot
  self.fireMove = function() {
    for (let i = 0; i < fire.length; i++) {
      fire[i].posY -= fire[i].speedY;
      if (fire[i].posY <= playing.top) fire.splice(i, 1);
    }

    // Hitting the enemy
    for (let i = 0; i < asteroids.length; i++) {
      for (let j = 0; j < fire.length; j++) {
        if (fire[j].posY <= asteroids[i].posY + asteroids[i].size && fire[j].posY + fire[j].size >= asteroids[i].posY && fire[j].posX + fire[j].size >= asteroids[i].posX && fire[j].posX <= asteroids[i].posX + asteroids[i].size) {

          if(asteroids[i].randomImg < 3 && asteroids[i].node ) {
            let size = { posX: asteroids[i].posX, posY: asteroids[i].posY, img: asteroids[i].randomImg }
            newEnemy.addAsteroids(size, 'left');
            newEnemy.addAsteroids(size, 'right');
          }

          // Removing the bullet from the array
          fire.splice(j, 1);

          // Adding the shot to the array
          boom.push({ x: asteroids[i].posX, y: asteroids[i].posY, animX: boomSpeed, animY: boomSpeed });

          // Marking the hit
          asteroids[i].del = true;
          // score
        }
      }
    }
  }

  // Drawing the shot
  self.firePaint = function() {
    for (let i = 0; i < fire.length; i++) {
      context.drawImage(fire1, fire[i].posX, fire[i].posY, fire[i].size, fire[i].size);
    }
  }
}

// Stars on the background
function Star() {
  let self = this;
  let arrStars = [];

  // Add a star with random coordinates and color to the array
  self.addStarObj = function() {
    let starObj = {};

    starObj.color = generateColor();
    starObj.size = randomNum(Math.round(((bodyHeight + bodyWidth) / 2) / 300), Math.round(((bodyHeight + bodyWidth) / 2) / 100));
    starObj.posX = randomNum(playing.left, playing.width);
    starObj.posY = randomNum(playing.top, playing.height);
    starObj.speedY = randomNum(1, 15);

    arrStars.push(starObj);
  }

  // Moving stars
  self.starObjMove = function() {
    for (let i = 0; i < arrStars.length; i++) {
      arrStars[i].posY += arrStars[i].speedY;
      if (arrStars[i].posY >= playing.height) arrStars.splice(i, 1);
    }
  }

  // Drawing stars
  self.starObjPaint = function() {
    for (let i = 0; i < arrStars.length; i++) {
      context.fillStyle = arrStars[i].color;
      context.beginPath();
      context.arc(arrStars[i].posX, arrStars[i].posY, arrStars[i].size / 2, 0, Math.PI * 2, false);
      context.fill();
    }
  }
}

// Planets
function Planet() {
  let self = this;
  let arrPlanet = [];

  self.addPlanet = function() {
    let planetObj = {};

    planetObj.size = planetSize;
    planetObj.posX = randomNum(playing.left, playing.width - planetSize);
    planetObj.posY = playing.top - planetSize;
    planetObj.speed = 3;
    planetObj.randomImg = randomNum(1, 3);

    arrPlanet.push(planetObj);
  }

  self.planetMove = function() {
    for (let i = 0; i < arrPlanet.length; i++) {
      arrPlanet[i].posY += arrPlanet[i].speed;
      if (arrPlanet[i].posY >= playing.height) arrPlanet.splice(i, 1);
    }
  }

  self.planetPaint = function() {
    for (let i = 0; i < arrPlanet.length; i++) {
      switch (arrPlanet[i].randomImg) {

        case 1:

          context.drawImage(planetImg, arrPlanet[i].posX, arrPlanet[i].posY, arrPlanet[i].size, arrPlanet[i].size);
          break;

        case 2:

          context.drawImage(planetImg2, arrPlanet[i].posX, arrPlanet[i].posY, arrPlanet[i].size, arrPlanet[i].size);
          break;

        case 3:

          context.drawImage(planetImg3, arrPlanet[i].posX, arrPlanet[i].posY, arrPlanet[i].size, arrPlanet[i].size);
          break;
      }
    }
  }
}

// Bonus
function Bonus() {
  let self = this;
  let enemyImg;
  self.speed = 2;

  self.addBonus = function() {
    let bonusItem = {};
    bonusItem.size = bonusSize;
    bonusItem.posX = randomNum(playing.left, playing.width - asteroidSize);
    bonusItem.posY = playing.top;
    bonusItem.speed = self.speed;
    bonusItem.del = false;
    bonusItem.randomImg = randomNum(1, 2);
    bonusItem.angle = randomNum(35, 155);
    bonusItem.rotateAngle = 0;
    bonusItem.rotateAccel = Math.round((Math.random() < 0.5) ? -1 : 1) / 100;
    bonus.push(bonusItem);
  }

  self.bonusMove = function() {
    for (let i = 0; i < bonus.length; i++) {

      bonus[i].posX = Math.round(bonus[i].posX + bonus[i].speed * Math.cos(toRadians(bonus[i].angle)));
      bonus[i].posY = Math.round(bonus[i].posY + bonus[i].speed * Math.sin(toRadians(bonus[i].angle)));

      if (bonus[i].posY + bonus[i].size >= playing.height) {
        bonus[i].del = true;
      }

      // Hitting the left wall
      if (bonus[i].posX <= playing.left) {
        bonus[i].angle = degreesCircle / 2 - bonus[i].angle;
        bonus[i].posX = playing.left;
      }

      // Hitting the right wall
      if (bonus[i].posX + bonus[i].size >= playing.width) {
        bonus[i].angle = degreesCircle / 2 - bonus[i].angle;
        bonus[i].posX = playing.width - bonus[i].size;
      }

      // Add a bonus after collide with a spaceship
      if (Math.abs(bonus[i].posY - ship.posY) <= bonus[i].size && Math.abs(bonus[i].posX - ship.posX) <= bonus[i].size) {

        if (bonus[i].randomImg === 1 && ship.explosions < 4) {
          bonus[i].del = true;
          ship.explosions++;
        } else if (bonus[i].randomImg === 2 && ship.lives <= 4) {
          bonus[i].del = true;
          ship.lives++;
        } else {
          bonus[i].del = true;
          // score
        }
      }

      if (bonus[i].del) {
        bonus.splice(i, 1);
      }
    }
  }

  self.bonusPaint = function() {
    for (let i = 0; i < bonus.length; i++) {
      switch (bonus[i].randomImg) {

        case 1:
          enemyImg = bonusImg;
          break;

        case 2:
          enemyImg = bonusImg2;
          break;
      }

      context.save();
      context.translate(bonus[i].posX + bonus[i].size / 2, bonus[i].posY + bonus[i].size / 2);
      context.rotate(bonus[i].rotateAngle);
      context.drawImage(enemyImg, -bonus[i].size / 2, -bonus[i].size / 2, bonus[i].size, bonus[i].size);
      context.restore();
      bonus[i].rotateAngle += bonus[i].rotateAccel;
    }
  }
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



// AJAX
let ajaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';

function read() {
  let sp = new URLSearchParams();
  sp.append('f', 'READ');
  sp.append('n', 'LITVINOVICH_GALAXY-WARIOR_GAME');

  fetch(ajaxHandlerScript, { method: 'post', body: sp })
      .then(response => response.json())
      .then(data => { addArrScore(data); })
      .catch(error => { console.error(error); });
}

function addArrScore(arr) {
  let arrWrapper = document.querySelector(".tableWrapper");

  if (arrWrapper.children.length > 1) {
    while (arrWrapper.children.length !== 1) {
      arrWrapper.removeChild(arrWrapper.lastChild);
    }
  }

  if (arr.result !== '') {
    let newArr = JSON.parse(arr.result);

    let table = document.createElement('table');
    table.style.margin = 'auto';
    table.style.borderSpacing = '1vh 1vw';

    let tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for (let i = 0; i < newArr.length; i++) {
      let tr = document.createElement('tr');
      tableBody.appendChild(tr);

      let tdNumber = document.createElement('td');
      tdNumber.innerText = i + 1;
      tr.appendChild(tdNumber);
      let tdName = document.createElement('td');
      tdName.innerText = newArr[i].name;
      tr.appendChild(tdName);
      let tdScore = document.createElement('td');
      tdScore.innerText = newArr[i].score;
      tr.appendChild(tdScore);
    }

    arrWrapper.appendChild(table);
  }

  else {
    arrWrapper.append(document.createTextNode('There are no results in the record table'));
  }
}

function lockGet(pass) {
  scoreData = {name: nickText, score: newScore};

  let sp = new URLSearchParams();
  sp.append('f', 'LOCKGET');
  sp.append('n', 'LITVINOVICH_GALAXY-WARIOR_GAME');
  sp.append('p', pass);

  fetch(ajaxHandlerScript, { method: 'post', body: sp })
      .then(response => response.json())
      .then(data => { newArr(data); })
      .catch(error => { console.error(error); });
}

function newArr(data) {
  let newArr = data.result;
  arrScore = newArr;
  update(randPass)
}

function update(pass) {
  let newArray = JSON.parse(arrScore);

  for (let i = 0; i < newArray.length; i++) {
    if (parseInt(scoreData.score) > parseInt(newArray[i].score)) {
      if (i === 0) {

        newArray[i + 2].name = newArray[i + 1].name;
        newArray[i + 2].score = newArray[i + 1].score;
        newArray[i + 1].name = newArray[i].name;
        newArray[i + 1].score = newArray[i].score;

        newArray[i].name = scoreData.name;
        newArray[i].score = scoreData.score;

        break;

      } else if (i === 1) {

        newArray[i + 1].name = newArray[i].name;
        newArray[i + 1].score = newArray[i].score;

        newArray[i].name = scoreData.name;
        newArray[i].score = scoreData.score;

        break;

      } else {

        newArray[i].name = scoreData.name;
        newArray[i].score = scoreData.score;

        break;
      }
    }
  }

  scoreData = null;

  // Results reset
  /*
    for (let i=0; i < newArray.length; i++) {
     newArray[i].name = scoreData.name;
     newArray[i].score = scoreData.score;
    }
   scoreData = null;
  */

  let arrJson = JSON.stringify(newArray);

  let sp = new URLSearchParams();
  sp.append('f', 'UPDATE');
  sp.append('n', 'LITVINOVICH_GALAXY-WARIOR_GAME');
  sp.append('p', pass);
  sp.append('v', arrJson);

  fetch(ajaxHandlerScript, { method: 'post', body: sp })
      .then(response => response.json())
      .then(data => { console.log(data); })
      .catch(error => { console.error(error); });
}

// Controller
function Controller() {
  let self = this;
  self.accel = 4;
  self.keyUP = 38;
  self.keyDown = 40;
  self.keyLeft = 37;
  self.keyRight = 39;
  self.keyFire = 32;
  self.speedStop = 0;
  self.keyBang = 17;

  self.start = function() {

    // Move the ship with the mouse
    gameWrapper.addEventListener('mousemove', self.flyShip, false);
    // Shooting
    document.addEventListener('click', self.fireShip, false);
    // Subscribe to touch events
    gameWrapper.addEventListener('touchstart', self.fireShipTouch, false);
    gameWrapper.addEventListener('touchend', function (EO) {
      EO = EO || window.event;
      EO.preventDefault();
    }, false);

    // Processing a gesture, using a bonus
    $('.gameDiv').bind('swipeDown', function() {

      if (ship.bonuses) {
        ship.explodeAll();
        ship.bonuses--;
        displayBonuses();
      }
    })

    gameWrapper.addEventListener('touchmove', self.flyShipTouch, false);

    // Button control
    document.addEventListener('keydown', self.keyShip, false);
    document.addEventListener('keyup', self.stop, false);
  }

  self.remList = function() {

    // Unsubscribe from events
    document.removeEventListener('click', self.fireShip, false);
    document.removeEventListener('keydown', self.keyShip, false);
    document.removeEventListener('keyup', self.stop, false);
    gameWrapper.removeEventListener('mousemove', self.flyShip, false);
    gameWrapper.removeEventListener('touchstart', self.fireShipTouch, false);
    gameWrapper.removeEventListener('touchmove', self.flyShipTouch, false);
    gameWrapper.removeEventListener('touchend', function (EO) {
      EO = EO || window.event;
      EO.preventDefault();
    }, false);

    $('.gameDiv').unbind('swipeDown');
  }

  self.resize = function() {
    bodyHeight = document.body.offsetHeight;
    bodyWidth = document.body.offsetWidth;

    // If the high score table is open, change the size
    if (tableNone) {
      scoreTable.style.display = 'none';
      scoreTableHeight = scoreTable.offsetHeight;
      scoreTableWidth = scoreTable.offsetWidth;
      tableNone = false;
      tableScore();
    } else {
      tableNone = true;
      tableScore();
    }

    planetSize = Math.round(((bodyHeight + bodyWidth) / 2) / 3);
    spaceshipSize = Math.round(((bodyHeight + bodyWidth) / 2) / 12);
    asteroidSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
    boomSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
    bonusSize = Math.round(((bodyHeight + bodyWidth) / 2) / 18);
    healthSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);
    bangSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);
    newFire.fireSize = spaceshipSize / 3;

    for (let i = 0; i < asteroids.length; i++) {
      asteroids[i].size = asteroidSize;
    }

    for (let i = 0; i < bonus.length; i++) {
      bonus[i].size = bonusSize;
    }

    displayHealth();
    displayBonuses();

    playing.height = bodyHeight;
    playing.width = bodyWidth;

    newCanvas.setAttribute('height', playing.height);
    newCanvas.setAttribute('width', playing.width);

    if (ship.posY >= bodyHeight) {
      ship.posY = bodyHeight - spaceshipSize;
    }

    if (ship.posX >= bodyWidth) {
      ship.posX = bodyWidth - spaceshipSize;
    }
  }

  self.flyShip = function (EO) {
    EO = EO || window.event;
    EO.preventDefault();

    ship.posX = EO.pageX - spaceshipSize / 2;
    ship.posY = EO.pageY - spaceshipSize / 2;
  }

  self.flyShipTouch = function (EO) {
    EO = EO || window.event;
    EO.preventDefault();

    // Get an array of touches
    let touchInfo = EO.targetTouches[0];
    ship.posX = touchInfo.pageX - spaceshipSize / 2;
    ship.posY = touchInfo.pageY - spaceshipSize;
  }

  self.fireShip = function(EO) {
    EO = EO || window.event;
    EO.preventDefault();
    // If there is no shot, create it
    if (fire.length === 0 && ship.lives !== 0) {
      newFire.addFire((ship.posX + spaceshipSize / 2), ship.posY);
    }
  }

  self.fireShipTouch = function(EO) {
    EO = EO || window.event;
    EO.preventDefault();
    // If there is no shot, create it
    if (fire.length === 0 && ship.life !== 0) {
      newFire.addFire(ship.posX + spaceshipSize / 2, ship.posY);
    }
  }

  self.keyShip = function(EO) {
    EO = EO || window.event;

    self.accel = 5;

    switch (EO.keyCode) {

      case self.keyUP:

        ship.speedY = -self.accel;
        // Going beyond the limits at the top
        if (ship.posY <= playing.top) {
          ship.posY = playing.top;
          ship.speedY = 0;
        }

        break;

      case self.keyDown:

        ship.speedY = self.accel;

        break;

      case self.keyLeft:

        ship.speedX = -self.accel;

        break;

      case self.keyRight:

        ship.speedX = self.accel;

        break;

      case self.keyFire:

        if (fire.length === 0 && ship.lives !== 0) {
          newFire.addFire(ship.posX + spaceshipSize / 2, ship.posY);
        }

        break;

      case self.keyBang:

        if (ship.bonuses) {
          ship.explodeAll();
          ship.bonuses--;
          displayBonuses();
        }

        break;
    }
  }

  self.stop = function(EO) {

    if (EO.keyCode === self.keyRight || EO.keyCode === self.keyLeft) {
      ship.speedX = self.speedStop;
    }

    if (EO.keyCode === self.keyDown || EO.keyCode === self.keyUP) {
      ship.speedY = self.speedStop;
    }
  }

  self.switchURLHash = function (EO) {
    EO = EO || window.event;

    let toClose;

    // Find out the value of the hash
    let URLHash = window.location.hash;

    // Delete the first character
    let stateStr = URLHash.substr(1);

    switch (stateStr) {

      case 'menu':

        // Switch to the menu from the running game
        if (isPlaying) {

          toClose = confirm('После перезагрузки страницы прогресс игры будет утрачен!');

          if (toClose) {
            // Unsubscribe from events
            self.remList();
            startMenu();
            isPlaying = false;
          }

          else location.hash = 'game';
        }

        // if game is over
        else startMenu();

        break;

      case 'game':
        startGame();
        break;
    }
  }

  self.befUnload = function(EO) {
    if (isPlaying) {
      EO.returnValue = 'После перезагрузки страницы прогресс игры будет утрачен!';
    }
  }
}