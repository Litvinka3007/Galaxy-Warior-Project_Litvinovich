// Canvas
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cH = ctx.canvas.height = window.innerHeight,
    cW = ctx.canvas.width = window.innerWidth;

// General sprite load
var sprite = new Image();
var spriteExplosion = new Image();
sprite.src = 'img/main_elements.png';

window.onload = function() {
  spriteExplosion.src = 'img/explosion.png';
};

// Game
var bullets = [],
    asteroids = [],
    explosions = [],
    destroyed = 0,
    record = 0,
    count = 0,
    playing = false,
    gameOver = false,
    _planet = {deg: 0};

// Player
var player = {
  posX   : -35,
  posY   : -(100+82),
  width  : 70,
  height : 79,
  deg    : 0
};

function planet() {
  ctx.save();
  ctx.fillStyle   = 'white';
  ctx.shadowBlur    = 100;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowColor   = '#999';

  ctx.arc(
      (cW/2),
      (cH/2),
      100,
      0,
      Math.PI * 2
  );
  ctx.fill();

  //Planet rotation
  ctx.translate(cW/2,cH/2);
  ctx.rotate((_planet.deg += 0.1) * (Math.PI / 180));
  ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200,200);
  ctx.restore();
}

function _player() {
  ctx.save();

  ctx.translate(cW/2,cH/2);
  ctx.rotate(player.deg);
  ctx.drawImage(
      sprite,
      200,
      0,
      player.width,
      player.height,
      player.posX,
      player.posY,
      player.width,
      player.height
  );

  ctx.restore();
}

planet();
_player();