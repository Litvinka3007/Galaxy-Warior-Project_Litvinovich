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

    // Collision with an enemy
    for (let i = 0; i < asteroids.length; i++) {
      if (Math.abs(asteroids[i].posY - self.posY) <= asteroids[i].size && Math.abs(asteroids[i].posX - self.posX) <= asteroids[i].size) {

        clickSound(crashSound);

        boom.push({ x: asteroids[i].posX, y: asteroids[i].posY, animX: boomSpeed, animY: boomSpeed });

        asteroids[i].del = true;

        self.lives--;

        displayHealth();

        if (navigator.vibrate) { // Does the device supports Vibration API?
          window.navigator.vibrate(100); // Vibration 100ms
        }
      }

      // If lives are over - the game is over
      if (self.lives <= 0 && boom.length === 0) {
        gameOver();
      }
    }
  }

  self.paintSpaceship = function() {
    // Draw a spaceship
    context.drawImage(shipImg, ship.posX, ship.posY, spaceshipSize, spaceshipSize);
  }

  self.explodeAll = function() {

    clickSound(bangAudio);
    document.body.style.filter = 'invert(100%)';

    setTimeout(function() {

      document.body.style.filter = 'none';

      for (let i = 0; i < asteroids.length; i++) {
        clickSound(crashSound);
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