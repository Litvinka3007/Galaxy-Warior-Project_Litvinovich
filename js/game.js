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

let asterSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);

let boomSize = Math.round(((bodyHeight + bodyWidth) / 2) / 11);

let bonusSize = Math.round(((bodyHeight + bodyWidth) / 2) / 18);

let healthSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);

let bangSize = Math.round(((bodyHeight + bodyWidth) / 2) / 15);

let ship = new Spaceship();

// CANVAS
let newCanvas = document.querySelector('.gameCanvas');
newCanvas.setAttribute('height', playing.height);
newCanvas.setAttribute('width', playing.width);
let context = newCanvas.getContext('2d');

let gameWrapper = document.querySelector('.gameDiv');

// Spaceship
function Spaceship() {

  let self = this;
  self.posX = playing.width / 2 - spaceshipSize / 2;
  self.posY = playing.height - spaceshipSize;
  self.speedX = 0;
  self.speedY = 0;
  self.lives = 4;
  self.explosions = 3;

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


