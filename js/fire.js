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