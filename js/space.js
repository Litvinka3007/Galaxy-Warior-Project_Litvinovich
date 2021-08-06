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

// Planets on the background
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