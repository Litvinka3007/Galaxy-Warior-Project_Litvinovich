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