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
      clickSound(shotSound);
      newFire.addFire((ship.posX + spaceshipSize / 2), ship.posY);
    }
  }

  self.fireShipTouch = function(EO) {
    EO = EO || window.event;
    EO.preventDefault();
    // If there is no shot, create it
    if (fire.length === 0 && ship.lives !== 0) {
      clickSound(shotSound);
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
          clickSound(shotSound);
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

  self.switchURLHash = function(EO) {
    EO = EO || window.event;

    let toClose;

    // Find out the value of the hash
    let URLHash = window.location.hash;

    // Delete the # character and save the hash value to the variable
    let stateStr = URLHash.substr(1);

    switch(stateStr) {

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