//Keyboard Input (keydown, keyup)
var inputKeys = {};

addEventListener(
  "keydown",
  function (e) {
    //console.log(e);
    inputKeys[e.keyCode] = true;
  },
  false
);
addEventListener(
  "keyup",
  function (e) {
    inputKeys[e.keyCode] = false;
  },
  false
);

//Main Game Class
class Game {
  constructor() {
    this.canvas = document.getElementById("myCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.sprites = [];
    this.imageX = 0;
    this.imageY = 0;
  }
  update() {
    var lSpriteLength = this.sprites.length;
    var ldeletedArrays = [];
    for (var i = 0; i < lSpriteLength; i++) {
      this.sprites[i].update(this.sprites);
      if (
        this.sprites[i] instanceof Enemy ||
        this.sprites[i] instanceof PlayerBullet ||
        this.sprites[i] instanceof EnemyBullet
      ) {
        if (this.sprites[i].deleted) ldeletedArrays.push(this.sprites[i]);
      }
    }
    for (var i = 0; i < ldeletedArrays.length; i++) {
      var index = this.sprites.indexOf(ldeletedArrays[i]);
      this.sprites.splice(index, 1);
    }
    ldeletedArrays = [];

    this.imageY -= 0.5; //make backgroud move
    if (this.imageY < -370) {
      this.imageY = 0; //reset y og background image to 0
    }
  }
  draw() {
    var bgImage = new Image();
    bgImage.src = "assets/images/bg.jpg"; //bg image

    this.ctx.drawImage(bgImage, this.imageX, this.imageY); // draw image at a new Y each time

    var lSpriteLength = this.sprites.length;
    for (var i = 0; i < lSpriteLength; i++) {
      this.sprites[i].draw(this.ctx);
    }
  }
  addSprite(pSprite) {
    this.sprites.push(pSprite);
  }
}
//Sprite
class Sprite {
  constructor() {}
  update() {}

  draw() {}
}
class Enemy {
  constructor(eX = 0, eY = 0, eW = 0, eH = 0, eColor = "#000000") {
    this.x = eX;
    this.y = eY;
    this.w = eW;
    this.h = eH;
    this.color = eColor;
    this.deleted = false;
    this.EnemyMoving = false;
    this.bullet;
  }
  update() {
    if (inputKeys[83]) {
      this.EnemyMoving = true; // move enemy to when game starts
    }
    if (this.EnemyMoving) {
      this.y += 0.25;
    }
    if (this.y == 101) {
      this.bullet = myGame.addSprite(
        new EnemyBullet(this.x + this.w / 2, this.y, 5, 20, "orange") //fire first bullet
      );
    }
    if (this.y == 150) {
      this.bullet = myGame.addSprite(
        new EnemyBullet(this.x + this.w / 2, this.y, 5, 20, "orange") // fire second bullet
      );
    }
    if (this.y == 250) {
      this.bullet = myGame.addSprite(
        new EnemyBullet(this.x + this.w / 2, this.y, 5, 20, "orange") // fire third bullet
      );
    }
    if (this.y == 350) {
      this.bullet = myGame.addSprite(
        new EnemyBullet(this.x + this.w / 2, this.y, 5, 20, "orange") // fire fourth bullet
      );
    }
    return this.deleted;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = this.color;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}

class MainPaddle {
  constructor(pX = 0, pY = 0, pW = 0, pH = 0, pColor = "#FF0000") {
    this.x = pX;
    this.y = pY;
    this.w = pW;
    this.h = pH;
    this.color = pColor;
    this.hitSound = new Audio("assets/mp3/hit.mp3"); //sound when user bullet hits enemy
    this.gameMusic = new Audio("assets/mp3/Groovy.wav"); // background music palys when game is running
    this.pBullet = null;
    this.timeBetweenBullets = 500; // time user waits before he fires again when holding space
    this.timeofLastBullet = 0; //time of last bullet fired
    this.timeNow; //current time
    this.life = 10; //user has 10 life since game is hard
    this.score = 0; //score increments when user hits enemy
    this.gameRunning = false;
    this.lost = false;
    this.won = false;
    drawEnv();
  }
  update(arrayOfCollisions) {
    if (this.gameRunning) {
      //move user up down left right
      if (inputKeys[37]) {
        if (this.x >= 0) this.x -= 2;
      }
      if (inputKeys[38]) {
        if (this.y >= 0) this.y -= 2;
      }
      if (inputKeys[39]) {
        if (this.x + this.w <= 800) this.x += 2;
      }
      if (inputKeys[40]) {
        if (this.y + this.h <= 600) this.y += 2;
      }

      //fire bullet if enough time has passed when user presses sapce
      this.timeNow = new Date().getTime();
      if (
        inputKeys[32] &&
        this.timeNow - this.timeofLastBullet > this.timeBetweenBullets
      ) {
        this.timeofLastBullet = new Date().getTime();
        this.pBullet = myGame.addSprite(
          new PlayerBullet(this.x + this.w / 2, this.y - 20, 5, 20, "#FF0000")
        );
      }
    }

    //start game when user presses s
    if (inputKeys[83]) {
      this.lost = false;
      this.won = false;
      this.gameRunning = true;
      this.gameMusic.play();
    }

    //check for collinsions
    var lArray = arrayOfCollisions;
    var lArrayLength = arrayOfCollisions.length;
    for (var i = 0; i < lArrayLength; i++) {
      //collision between enemy and player
      if (lArray[i] instanceof Enemy) {
        if (this.collisionWithPlayer(lArray[i])) {
          this.lostFunction(lArray, lArrayLength);
        }

        //if enemy surpasses player
        if (lArray[i].y + lArray[i].h > 600) {
          this.lostFunction(lArray, lArrayLength);
        }

        //collision between enemy and player Bullet
        for (var j = 0; j < lArray.length; j++) {
          if (lArray[j] instanceof PlayerBullet) {
            if (
              lArray[j].y <= lArray[i].y + lArray[i].h &&
              lArray[j].x >= lArray[i].x - lArray[j].w &&
              lArray[j].x <= lArray[i].x + lArray[i].w + lArray[j].w
            ) {
              lArray[i].deleted = true;
              lArray[j].deleted = true;
              this.hitSound.play();
              this.score++;
            }
          }
        }
      }

      // if bullet misses every enemy and is outside of canvas delete bullet
      if (lArray[i] instanceof PlayerBullet) {
        if (lArray[i].y < 0) {
          lArray[i].deleted = true;
          //console.log(" deleted");
        }
      }

      //if enemy bullet hits user
      if (lArray[i] instanceof MainPaddle) {
        for (var j = 0; j < lArray.length; j++) {
          if (lArray[j] instanceof EnemyBullet) {
            if (
              lArray[j].y + lArray[j].h > lArray[i].y &&
              lArray[j].x > lArray[i].x &&
              lArray[j].x < lArray[i].x + lArray[i].w &&
              lArray[j].y < lArray[i].y + lArray[i].h
            ) {
              //console.log("Player");
              lArray[j].deleted = true;
              this.life--;
              this.hitSound.play();
            }
          }
        }
      }
    }

    // press t to view array and check if deletion is done correctly
    // if (inputKeys[84]) {
    //   console.log(lArray);
    // }

    if (this.life <= 0) {
      //lost
      this.lostFunction(lArray, lArrayLength);
    }
    if (this.score == 15) {
      // won
      this.gameRunning = false;
      this.won = true;
      for (var i = 0; i < lArrayLength; i++) {
        if (!(lArray[i] instanceof MainPaddle)) {
          lArray[i].deleted = true; //delete everything except for the main paddle
        }
      }
      drawEnv(); // redraw everything deleted
      //reset score and life and paddle position
      this.life = 10;
      this.score = 0;
      this.x = 340;
      this.y = 520;
      this.gameMusic.pause();
    }
  }
  lostFunction(array, size) {
    this.lost = true;
    this.gameRunning = false;
    for (var i = 0; i < size; i++) {
      if (!(array[i] instanceof MainPaddle)) {
        array[i].deleted = true; //delete everything except for the main paddle
      }
    }
    drawEnv(); // redraw everything deleted
    //reset score and life and paddle position
    this.life = 10;
    this.score = 0;
    this.x = 340;
    this.y = 520;
    this.gameMusic.pause();
  }

  collisionWithPlayer(pObject) {
    if (
      (this.x >= pObject.x &&
        this.x <= pObject.x + pObject.w &&
        this.y <= pObject.y + pObject.h) ||
      (this.x + this.w >= pObject.x &&
        this.x + this.w <= pObject.x + pObject.w &&
        this.y <= pObject.y + pObject.h)
    ) {
      //console.log("collision");
      return true;
    } else {
      return false;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = this.color;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.font = "15px Ariel";
    ctx.fillStyle = "White";
    ctx.fillText("Life: " + this.life, 50, 530);
    ctx.fillText("Score: " + this.score, 50, 550);

    //begin, win, lost messages
    if (!this.gameRunning) {
      ctx.font = "30px Ariel";
      ctx.fillStyle = "Blue";
      ctx.fillText("Press S to start", 200, 300);
    }
    if (this.lost) {
      ctx.font = "30px Ariel";
      ctx.fillStyle = "Red";
      ctx.fillText("You LOST", 200, 200);
    }
    if (this.won) {
      ctx.font = "30px Ariel";
      ctx.fillStyle = "Green";
      ctx.fillText("Congrats you won", 200, 200);
    }
  }
}

class PlayerBullet {
  constructor(bX = 0, bY = 0, bW = 0, bH = 0, bColor = "#FF0000") {
    this.x = bX;
    this.y = bY;
    this.w = bW;
    this.h = bH;
    this.color = bColor;
    this.deleted = false;
  }
  update() {
    this.y -= 2; //speed of User bullet faster than enemy bullet
    return this.deleted;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = this.color;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}

class EnemyBullet {
  constructor(ebX = 0, ebY = 0, ebW = 0, ebH = 0, ebColor = "orange") {
    this.x = ebX;
    this.y = ebY;
    this.w = ebW;
    this.h = ebH;
    this.color = ebColor;
    this.deleted = false;
  }
  update() {
    this.y += 0.8; //speed of bullet 
    return this.deleted;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "1";
    ctx.strokeStyle = this.color;
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}

window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();
