var img = new Image();
img.src = "img/background.png";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function Party(canvas) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.width = 0.8 * this.canvas.width;
  this.height = 1 * this.canvas.height;

  // Etat du jeu
  this.score = 0;
  this.level = 1;
  this.lives = 3;

  this.start = () => {
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(0, 0, this.width, this.height);
    console.log("party started !");
  };
  this.update = () => {
    this.score++;
  };
  this.draw = () => {
    ctx.drawImage(this.img, 0, this.y);
    if (this.speed < 0) {
      ctx.drawImage(this.img, 0, this.y + canvas.height);
    } else {
      ctx.drawImage(this.img, 0, this.y - this.img.height);
    }
  };
}

function ScorePanel(canvas, party) {
  this.canvas = canvas;
  this.party = party;
  this.x = this.party.width;
  this.y = 0;
  this.ctx = canvas.getContext("2d");
  this.width = 0.2 * this.canvas.width;
  this.height = 1 * this.canvas.height;
  this.draw = (marginY, text) => {
    this.ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(text, this.x + 10, this.y + marginY);
  };

  this.drawScore = score => {
    this.draw(20, "Score: " + score);
  };
  this.drawLives = lives => {
    this.draw(40, "Lives: " + lives);
  };
  this.drawLevel = level => {
    this.draw(60, "Level: " + level);
  };
  this.start = () => {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  this.update = (score, lives, level) => {
    this.ctx.clearRect(
      this.x,
      this.y,
      this.x + this.width,
      this.y + this.height
    );

    this.drawScore(score);
    this.drawLives(lives);
    this.drawLevel(level);
  };
}
function Button(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  this.clicked = false;

  canvas.addEventListener("click", event => {
    if (
      event.clientX > this.x &&
      event.clientX < this.x + this.w &&
      event.clientY > this.y &&
      event.clientY < this.y + this.h
    ) {
      console.log("button clicked!");
      this.clicked = true;
    }
  });

  this.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  };
}
function HomePage(canvas, party) {
  this.party = party;
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.alive = true;
  this.startButton = new Button(
    canvas.width / 2,
    canvas.height / 2,
    100,
    100,
    "blue"
  );
  this.start = () => {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.startButton.draw();
  };
  this.update = () => {
    if (this.startButton.clicked == true) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.party.start();
      this.alive = false;
    }
  };
}

function Game(canvas) {
  this.canvas = canvas;
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.ctx = canvas.getContext("2d");
  this.party = new Party(this.canvas);
  this.homePage = new HomePage(this.canvas, this.party);
  this.scorePanel = new ScorePanel(this.canvas, this.party);
  this.start = () => {
    this.homePage.start();
    this.interval = setInterval(this.update.bind(this), 10);
  };
  this.update = () => {
    if (this.homePage.alive == true) {
      this.homePage.update();
    } else {
      this.party.update();
      this.scorePanel.update(
        this.party.score,
        this.party.lives,
        this.party.level
      );
    }
  };
}

var game = new Game(canvas);
game.start();
