var img = new Image();
img.src = "img/background.png";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var backgroundImage = {
  img: img,
  x: 0,
  y: 0,
  speed: -1,

  move: function() {
    this.y += this.speed;
    this.y %= this.img.height;
  },

  draw: function() {
    ctx.drawImage(this.img, 0, this.y);
    if (this.speed < 0) {
      ctx.drawImage(this.img, 0, this.y + canvas.height);
    } else {
      ctx.drawImage(this.img, 0, this.y - this.img.height);
    }
  }
};
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;

  this.play = function() {
    this.sound.play();
  };
  this.stop = function() {
    this.sound.pause();
  };
}
myMusic = new sound("2.mp3");
myMusic.play();
var myGameArea = {
  frame: 0,
  canvas: document.getElementById("canvas"),
  start: function() {
    this.context = this.canvas.getContext("2d");
    this.player1 = new Component(60, 60, 700, 630);
    this.monster_list = [];

    for (var i = 0; i < 1; i++) {
      for (var j = 0; j < 10; j++) {
        this.monster_list.push(new Monster(60, 60, j * 100, -i * 100));
      }
    }

    this.missile_list = [];
    this.missile_listspecial = [];
    this.missilemonster_list = [];
    this.WinLive_list = [];

    this.interval = setInterval(this.updateCanvas.bind(this), 10);

    document.onkeydown = e => {
      switch (e.keyCode) {
        case 38:
          this.player1.moveUp();
          break;
        case 40:
          this.player1.moveDown();
          break;
        case 37:
          this.player1.moveLeft();
          break;
        case 39:
          this.player1.moveRight();
          break;
        case 32:
          this.missile_list.push(
            new Missile(this.player1.x + 16, this.player1.y, 0, 3, this.context)
          );
          break;
        case 65:
          this.missile_listspecial.push(
            new Missile(this.player1.x, this.player1.y, -2, 3, this.context)
          );
          specialMissile -= 1;
          break;
        case 76:
          this.WinLive_list.push(new WinLives(30, 30, 0, -1, ctx));
          break;

        case 90:
          this.missile_listspecial.push(
            new Missile(this.player1.x + 36, this.player1.y, 2, 3, this.context)
          );
          specialMissile -= 1;
          break;
      }
    };
  },
  updateCanvas: function() {
    this.frame++;
    this.context.clearRect(0, 0, 1430, 700);
    backgroundImage.move();
    backgroundImage.draw();
    drawLevel();
    drawLives();
    drawScore();
    drawSpecialMissile();
    this.player1.draw();
    this.missilemonster_list.forEach(missile => missile.update());
    this.missilemonster_list.forEach(missile => missile.draw());
    this.WinLive_list.forEach(live => live.update());
    this.WinLive_list.forEach(live => live.draw());
    this.missile_list.forEach(missile => missile.update());
    this.missile_list.forEach(missile => missile.draw());
    this.missile_listspecial.forEach(missile => missile.update());
    this.missile_listspecial.forEach(missile => missile.draw());
    if (Math.random() < 0.001) {
      this.WinLive_list.push(
        new WinLives(
          Math.floor(Math.random() * canvas.width),
          0,
          0,
          -1,

          ctx
        )
      );
    }

    for (var i = 0; i < this.monster_list.length; i++) {
      this.monster_list[i].update();
      this.monster_list[i].draw();
      this.missile_list.forEach((x, j) => {
        var col = x.checkCollision(this.monster_list[i]);
        if (col) {
          this.monster_list.splice(i, 1);
          this.missile_list.splice(j, 1);
          score += 2;
        }
      });
      this.missile_listspecial.forEach((x, j) => {
        var col = x.checkCollision(this.monster_list[i]);
        if (col) {
          this.monster_list.splice(i, 1);
          score += 2;
        }
      });
    }
    if (this.monster_list.length == 0) {
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          this.monster_list.push(new Monster2(60, 60, j * 100, -i * 100));
        }
      }

      level = 2;
    }
    this.WinLive_list.forEach((x, j) => {
      var col4 = x.checkCollision4(this.player1);
      if (col4) {
        this.WinLive_list.splice(j, 1);
        lives++;
      }
    });

    this.missilemonster_list.forEach((x, j) => {
      var col2 = x.checkCollision2(this.player1);
      if (col2) {
        this.missilemonster_list.splice(j, 1);
        lives--;
      }
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      this.missile_list.forEach((x, k) => {
        var col = x.checkCollision(this.missilemonster_list[j]);
        if (col) {
          this.missilemonster_list.splice(j, 1);
          this.missile_list.splice(k, 1);
          score++;
        }
      });
    });
  }
};

function Component(width, height, x, y) {
  ctx = myGameArea.context;
  this.image = new Image();
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.image.src = "img/velo1.png";

  this.draw = function() {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };

  this.moveUp = function() {
    this.y -= 15;
  };

  this.moveDown = function() {
    this.y += 15;
  };

  this.moveLeft = function() {
    this.x -= 15;
  };

  this.moveRight = function() {
    this.x += 15;
  };
}

function Monster(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.x = x;
  this.y = y;
  this.speed = 1;
  ctx = myGameArea.context;
  this.image.src = "img/voiture.png";

  this.update = function() {
    if (myGameArea.frame % 60 == 10) {
      if (Math.random() < 0.1 && this.y >= 0) {
        myGameArea.missilemonster_list.push(
          new MissileMonster(this.x, this.y + 10, 0, -1, ctx)
        );
      }
    }
    this.x += this.speed;
    if (this.x == 1200) {
      this.y += 50;
      this.speed = -1 * this.speed;
    }
    if (this.x == -1) {
      this.y += 50;
      this.speed = -1 * this.speed;
    }
  };

  this.draw = function() {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
}
function Monster2(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.x = x;
  this.y = y;
  this.speed = 1;
  ctx = myGameArea.context;
  this.image.src = "img/bus.png";

  this.update = function() {
    if (myGameArea.frame % 60 == 10) {
      if (Math.random() < 0.3 && this.y >= 0) {
        myGameArea.missilemonster_list.push(
          new MissileMonster(this.x, this.y + 10, 0, -1, ctx)
        );
      }
    }
    this.x += this.speed;
    if (this.x == 1200) {
      this.y += 50;
      this.speed = -1 * this.speed;
    }
    if (this.x == -1) {
      this.y += 50;
      this.speed = -1 * this.speed;
    }
  };

  this.draw = function() {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
}
function MissileMonster(x, y, vx, vy, ctx) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.image = new Image();
  ctx = myGameArea.context;
  this.image.src = "img/missile.png";

  this.height = 20;
  this.width = 20;
  this.ctx = ctx;

  this.update = function() {
    this.y -= vy;
    this.x += vx;
  };
  this.draw = function() {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.checkCollision2 = function(object) {
    var miss1x = this.x;
    var miss1y = this.y;
    var miss1w = 10;
    var miss1h = 10;

    var result =
      miss1x - object.width < object.x &&
      object.x < miss1x + miss1w &&
      miss1y - object.height < object.y &&
      object.y < miss1y + miss1h;

    return result;
  };
}
function WinLives(x, y, vx, vy, ctx) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.image = new Image();
  ctx = myGameArea.context;
  this.image.src = "img/pile.png";

  this.height = 15;
  this.width = 15;
  this.ctx = ctx;

  this.update = function() {
    this.y -= vy;
    this.x += vx;
  };
  this.draw = function() {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.checkCollision4 = function(object) {
    var miss1x = this.x;
    var miss1y = this.y;
    var miss1w = 7;
    var miss1h = 7;

    var result =
      miss1x - object.width < object.x &&
      object.x < miss1x + miss1w &&
      miss1y - object.height < object.y &&
      object.y < miss1y + miss1h;

    return result;
  };
}
function Missile(x, y, vx, vy, ctx) {
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;

  this.image = new Image();
  ctx = myGameArea.context;
  this.image.src = "img/missile_jaune.png";

  this.height = 20;
  this.width = 20;
  this.ctx = ctx;

  this.update = function() {
    this.y -= vy;
    this.x += vx;
  };
  this.draw = function() {
    ctx = myGameArea.context;
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  };
  this.checkCollision = function(object) {
    var miss1x = this.x;
    var miss1y = this.y;
    var miss1w = 7;
    var miss1h = 7;

    var result =
      miss1x - object.width < object.x &&
      object.x < miss1x + miss1w &&
      miss1y - object.height < object.y &&
      object.y < miss1y + miss1h;

    return result;
  };
}
var lives = 3;
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 140, 20);
}
var score = 0;
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, canvas.width - 140, 40);
}
var specialMissile = 30;
function drawSpecialMissile() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Special Missile: " + specialMissile, canvas.width - 140, 60);
}

var level = 1;
function drawLevel() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Level: " + level, canvas.width - 140, 80);
}

myGameArea.start();
