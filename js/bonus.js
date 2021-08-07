function Bonus() {
  let self = this;
  let enemyImg;
  self.speed = 2;

  // Add a bonus to the array with coordinates
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

        if (bonus[i].randomImg === 1 && ship.bonuses < 4) {

          clickSound(bonusAudio);
          bonus[i].del = true;
          ship.bonuses++;

        } else if (bonus[i].randomImg === 2 && ship.lives <= 4) {

          clickSound(bonusAudio);
          bonus[i].del = true;
          ship.lives++;

        } else {

          clickSound(bonusAudio);
          bonus[i].del = true;
          newScore += 10;
          nicknameInfo.innerText = nickText + ' : ' + scoreText(newScore);
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