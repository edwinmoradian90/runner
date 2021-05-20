"use strict";

const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");
const boostAmount = document.getElementById("boostAmount");
const boostGauge = document.getElementById("boostGauge");
const healthAmount = document.getElementById("healthAmount");
const healthGauge = document.getElementById("healthGauge");

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const gameMusic = new Audio();
gameMusic.src = "./OutThere.ogg";
gameMusic.loop = true;
gameMusic.play();

const missileFx = new Audio();
missileFx.src = "./laser4.wav";

const ship = new Image();
ship.src = "./Fighter3.png";

const missile = new Image();
missile.src = "./beams.png";

const asteroidBig = new Image();
asteroidBig.src = "./asteriod-big.png";

canvas.width = 800;
canvas.height = 600;

const RUN_VELOCITY = 7;
const FRICTION = 0.92;
let accelerator = 0;
let boost = 100;
let health = 100;
let counter = 0;

class Player {
  constructor(x, y, height, width, velocity, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.velocity = velocity;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.drawImage(ship, this.x, this.y, 30, 60);
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Star {
  constructor(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, this.color, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update(accelerator) {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y + accelerator;
  }
}

class Missile {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.drawImage(missile, this.x, this.y, 10, 40);
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Asteroid {
  constructor(x, y, velocity, height, width) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
  }

  draw() {
    c.beginPath();
    c.drawImage(asteroidBig, this.x, this.y, this.height, this.width);
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y + accelerator;
  }
}

class Particle {
  constructor(x, y, velocity, color) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.color = color;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.fillStyle = this.color || "white";
    c.arc(this.x, this.y, random(0, 3), 0, 2 * Math.PI, false);
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= FRICTION;
    this.velocity.y *= FRICTION;
    this.x += this.velocity.x;
    this.y += this.velocity.y + accelerator;
    this.alpha -= 0.01;
  }
}

let keyPresses = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  z: false,
};

let stars = [];
let missiles = [];
let asteroids = [];
let particles = [];

const player = new Player(
  canvas.width / 2,
  canvas.height - 100,
  50,
  50,
  { x: 0, y: 0 },
  "red"
);
player.draw();

function stopPlayer() {
  player.velocity = { x: 0, y: 0 };
}

function createAsteroids() {
  setInterval(() => {
    const randomNumber = random(50, 100);
    asteroids.push(
      new Asteroid(
        Math.random() * canvas.width - 50,
        -70,
        {
          x: 0,
          y: Math.random() * 4,
        },
        randomNumber,
        randomNumber
      )
    );
  }, 2000);
}

function useBoost() {
  boost = boost - 1;
  boostAmount.innerHTML = boost;
  boostGauge.style.width = boost + "px";
  if (boost < 5) {
    if (counter % 70 === 0) {
      boostGauge.style.background = "red";
    }
  } else if (boost < 25) {
    if (counter % 15 === 0) {
      boostGauge.style.background = "orange";
    }
  } else if (boost < 50) {
    if (counter % 10 === 0) {
      boostGauge.style.background = "yellow";
    }
  } else if (boost < 100) {
    if (counter % 5 === 0) {
      boostGauge.style.background = "green";
    }
  }
}

function rechargeBoost() {
  if (boost < 5) {
    if (counter % 70 === 0) {
      boost += 1;
      boostAmount.innerHTML = boost;
      boostGauge.style.width = boost + "px";
      boostGauge.style.background = "red";
    }
  } else if (boost < 25) {
    if (counter % 15 === 0) {
      boost += 1;
      boostAmount.innerHTML = boost;
      boostGauge.style.width = boost + "px";
      boostGauge.style.background = "orange";
    }
  } else if (boost < 50) {
    if (counter % 10 === 0) {
      boost += 1;
      boostAmount.innerHTML = boost;
      boostGauge.style.width = boost + "px";
      boostGauge.style.background = "yellow";
    }
  } else if (boost < 100) {
    if (counter % 5 === 0) {
      boost += 1;
      boostAmount.innerHTML = boost;
      boostGauge.style.width = boost + "px";
      boostGauge.style.background = "green";
    }
  }
}

function loseHealth() {
  if (health <= 10) {
    healthGauge.style.background = "red";
    if (counter % 1 === 0) {
      health -= 1;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + "px";
    }
  } else if (health < 25) {
    healthGauge.style.background = "orange";
    if (counter % 1 === 0) {
      health -= 1;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + "px";
    }
  } else if (health < 50) {
    healthGauge.style.background = "yellow";
    if (counter % 2 === 0) {
      health -= 1;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + "px";
    }
  } else if (health <= 100) {
    healthGauge.style.background = "green";
    if (counter % 2 === 0) {
      health -= 1;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + "px";
    }
  }
}

function movePlayer() {
  stopPlayer();
  if (keyPresses["ArrowLeft"]) {
    player.velocity.x =
      player.x - player.width > 0 ? -RUN_VELOCITY - accelerator : 0;
  }
  if (keyPresses["ArrowRight"]) {
    player.velocity.x =
      player.x + player.height * 2 < canvas.width
        ? RUN_VELOCITY + accelerator
        : 0;
  }
  if (keyPresses["ArrowUp"]) {
    if (boost > 0) {
      accelerator += 1;
    } else {
      accelerator > 0 ? (accelerator -= 5) : 0;
    }
    if (accelerator > 3 && boost > 0) {
      useBoost();
    }
  }
}
let starInterval;
function createStars() {
  starInterval = setInterval(() => {
    const star = new Star(
      Math.random() * canvas.width,
      50,
      Math.random() * 2,
      { x: 0, y: 4 },
      `rgba(255, 255, 255, ${Math.random()})`
    );
    star.draw();
    stars.push(star);
  }, 100);
}

let animationId;

function endGame() {
  cancelAnimationFrame(animationId);
  clearInterval(starInterval);
}

function animate() {
  if (health === 0) return endGame();
  counter += 1;
  c.fillStyle = "rgba( 0, 0, 0, 0.7)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  movePlayer();
  rechargeBoost();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  missiles.forEach((missile) => {
    missile.update();
  });
  stars.forEach((enemy) => {
    enemy.update(keyPresses["ArrowUp"] ? accelerator : 0);
  });
  stars.forEach((enemy, index) => {
    if (enemy.y > canvas.height) {
      setTimeout(() => {
        stars.splice(index, 1);
      }, 0);
    }
  });
  asteroids.forEach((asteroid, index) => {
    const playerMeteorDist = Math.hypot(
      player.x - asteroid.x,
      player.y - asteroid.y
    );
    if (playerMeteorDist - asteroid.height < 1) {
      gsap.to(asteroid, {
        height: asteroid.height - 2,
        width: asteroid.width - 2,
      });
      loseHealth();
    }

    asteroid.update();
    missiles.forEach((missile, missileIndex) => {
      const dist = Math.hypot(missile.x - asteroid.x, missile.y - asteroid.y);
      if (dist - asteroid.height + 10 < 1) {
        setTimeout(() => {
          missiles.splice(missileIndex, 1);
          if (asteroid.height < 70) {
            asteroids.splice(index, 1);
            for (let i = 0; i < asteroid.height / 2; i++) {
              particles.push(
                new Particle(
                  asteroid.x + asteroid.width / 2,
                  asteroid.y + asteroid.height / 2,
                  {
                    x: (Math.random() - 0.5) * (Math.random() * 13),
                    y: (Math.random() - 0.5) * (Math.random() * 13),
                  },
                  getRandomColor()
                )
              );
            }
          } else {
            gsap.to(asteroid, {
              height: asteroid.height - 20,
              width: asteroid.width - 20,
            });
          }
        }, 0);
      }
      if (missile.y < -30) {
        setTimeout(() => {
          missiles.splice(missileIndex, 1);
        }, 0);
      }
    });
  });

  asteroids.forEach((asteroid, index) => {
    if (asteroid.y > canvas.height) {
      setTimeout(() => {
        asteroids.splice(index, 1);
      }, 0);
    }
  });
  animationId = requestAnimationFrame(animate);
}

const engineSound = new Audio();
engineSound.src = "./engine1.wav";
addEventListener("keydown", (e) => {
  if (e.key === "z") {
    missiles.push(new Missile(player.x + 12, player.y - 20, { x: 0, y: -40 }));
    const missileFx = new Audio();
    missileFx.src = "./laser4.wav";
    missileFx.currentTime = 0;
    missileFx.play();
  }
  if (e.key === "ArrowUp" && boost > 0) {
    engineSound.play();
  }
  keyPresses[e.key] = true;
});

addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") {
    accelerator = 0;
    engineSound.currentTime = 0;
    engineSound.pause();
  }
  keyPresses[e.key] = false;
});

createStars();
createAsteroids();
animate();
