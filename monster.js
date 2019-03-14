function Monster(width, height, x, y) {
  this.width = width;
  this.height = height;
  this.image = new Image();
  this.x = x;
  this.y = y;
  this.speed = 1;
  ctx = myGameArea.context;
  this.image.src = "img/car.png";

  this.update = function() {
    if (myGameArea.frame % 60 == 10) {
      if (Math.random() < 0.1 && this.y >= 0) {
        myGameArea.missilemonster_list.push(
          new MissileMonster(this.x, this.y + 10, 0, -1, "blue", ctx)
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
