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
let spaceshipSize = Math.round(((bodyHeight + bodyWidth) / 2) / 12);
let asteroidSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
let boomSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);
let bonusSize = Math.round(((bodyHeight + bodyWidth) / 2) / 18);
let healthSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);
let bangSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);

// Speed of explosion
let boomSpeed = 0;
// Acceleration of explosion
let boomAccel = 0.2;

let newStar = new Star();
let newFire = new Fire();
let newEnemy = new Enemy();
let ship = new Spaceship();
let planet = new Planet();
let newBonus = new Bonus();

let isPlaying = false;

let randPass = 0;

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

function gameRun() {
  renderGame();
}

function renderGame() {
  context.fillStyle = playing.color;
  context.fillRect(playing.top, playing.left, playing.width, playing.height);

  newEnemy.enemyPaint();
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

gameRun();


