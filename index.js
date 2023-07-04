'use strict';

import Player from './src/player.js';
import Missile from './src/missile.js';
import Asteroid from './src/asteroid.js';
import Particle from './src/particle.js';
import Star from './src/star.js';
import Heart from './src/heart.js';
import { getRandomColor, random } from './src/utils.js';

const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');
const healthAmount = document.getElementById('healthAmount');
const healthGauge = document.getElementById('healthGauge');
const score = document.getElementById('score');

const gameMusic = new Audio();
gameMusic.src = './assets/music/OutThere.ogg';
gameMusic.loop = true;
gameMusic.play();

const missileFx = new Audio();
missileFx.src = './assets/sfx/laser4.wav';

const collisionSound = new Audio();
collisionSound.src = './assets/sfx/flaunch.wav';

const errorSound = new Audio();
errorSound.src = './assets/sfx/error.ogg';

canvas.width = 800;
canvas.height = 600;

const RUN_VELOCITY = 20;
const friction = 0.92;
let accelerator = 0;
let health = 100;
let currentScore = 0;
let frame = 0;

let keyPresses = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  z: false,
  x: false,
};

const MouseClick = {
  LeftClick: 0,
  RightClick: 2,
};

const mouseClicks = {
  [MouseClick.LeftClick]: false,
  [MouseClick.RightClick]: false,
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
  'red'
);

player.draw({ c, frame });

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
          y: Math.random() * RUN_VELOCITY,
        },
        randomNumber,
        randomNumber
      )
    );
  }, 500);
}

function loseHealth() {
  if (health <= 10) {
    healthGauge.style.background = 'red';
    if (frame % 1 === 0) {
      if (health - 4 < 0) {
        health = 0;
      } else {
        health -= 4;
      }
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + 'px';
    }
  } else if (health < 25) {
    healthGauge.style.background = 'orange';
    if (frame % 1 === 0) {
      health -= 3;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + 'px';
    }
  } else if (health < 50) {
    healthGauge.style.background = 'yellow';
    if (frame % 2 === 0) {
      health -= 2;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + 'px';
    }
  } else if (health <= 100) {
    healthGauge.style.background = 'green';
    if (frame % 2 === 0) {
      health -= 2;
      healthAmount.innerHTML = health;
      healthGauge.style.width = health + 'px';
    }
  }
}

function movePlayer() {
  stopPlayer();
  if (keyPresses['ArrowLeft']) {
    player.velocity.x =
      player.x - player.width > 0 ? -RUN_VELOCITY - accelerator / 4 : 0;
  }
  if (keyPresses['ArrowRight']) {
    player.velocity.x =
      player.x + player.height * 2 < canvas.width
        ? RUN_VELOCITY + accelerator / 4
        : 0;
  }

  if (keyPresses['ArrowUp'] || mouseClicks[MouseClick.RightClick]) {
    if (player.boostRemaining > 0) {
      accelerator += 1;
      player.isBoosting = true;
    } else {
      player.isBoosting = false;
      accelerator > 0 ? (accelerator -= 5) : 0;
      errorSound.currentTime = 0;
      errorSound.play();
    }
    if (accelerator > 7 && player.boostRemaining > 0) {
      player.useBoost({ frame });
    }
  }
}

let previousMousePosition = 0;

function movePlayerWithMouse(x) {
  player.x = x < canvas.width ? x : player.x;
  previousMousePosition = x;
}

let starInterval;
function createStars() {
  starInterval = setInterval(() => {
    const data = { c };

    const star = new Star(
      Math.random() * canvas.width,
      50,
      Math.random() * 2,
      { x: 0, y: RUN_VELOCITY },
      `rgba(255, 255, 255, ${Math.random()})`
    );

    star.draw(data);
    stars.push(star);
  }, 100);
}

let animationId;

function addToScore(asteroidHeight) {
  currentScore += Math.floor(10 + asteroidHeight / 2);
  score.innerHTML = currentScore;
}

function animate() {
  if (health <= 0) {
    currentScore = 0;
    frame = 0;
    health = 100;
    score.innerHTML = currentScore;
  }

  frame += 1;

  c.fillStyle = 'rgba( 0, 0, 0, 0.7)';
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update({ c, frame });
  movePlayer();

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      const data = {
        c,
        accelerator,
        friction,
        runVelocity: RUN_VELOCITY / 4,
      };
      particle.update(data);
    }
  });

  missiles.forEach((missile) => missile.update({ c }));

  stars.forEach((enemy) => {
    const data = { c };

    data.accelerator =
      keyPresses['ArrowUp'] || mouseClicks[MouseClick.RightClick]
        ? accelerator
        : 0;

    enemy.update(data);
  });

  stars.forEach((enemy, index) => {
    if (enemy.y > canvas.height) {
      setTimeout(() => {
        stars.splice(index, 1);
      }, 0);
    }
  });

  asteroids.forEach((asteroid, index) => {
    const playerAstroDist = Math.hypot(
      player.x - asteroid.x,
      player.y - asteroid.y
    );

    if (playerAstroDist - asteroid.height < 1) {
      collisionSound.currentTime = 0;
      collisionSound.play();
      asteroid.velocity.x = player.velocity.x;
      asteroid.velocity.y = player.velocity.y - friction - accelerator;
      loseHealth();
    }

    const data = { c, accelerator };

    asteroid.update(data);

    missiles.forEach((missile, missileIndex) => {
      const dist = Math.hypot(missile.x - asteroid.x, missile.y - asteroid.y);
      if (dist - asteroid.height + 10 < 1) {
        setTimeout(() => {
          missiles.splice(missileIndex, 1);
          if (asteroid.height < 70) {
            const asteroidExplosionSound = new Audio();
            asteroidExplosionSound.src = './assets/sfx/iceball.wav';
            asteroidExplosionSound.currentTime = 0;
            asteroidExplosionSound.play();
            asteroids.splice(index, 1);
            addToScore(asteroid.height);
            for (let i = 0; i < asteroid.height / 2; i++) {
              particles.push(
                new Particle(
                  asteroid.x + asteroid.width / 2,
                  asteroid.y + asteroid.height / 2 + RUN_VELOCITY,
                  {
                    x: (Math.random() - 0.5) * (Math.random() * 13),
                    y: (Math.random() - 0.5) * (Math.random() * 13),
                  },
                  getRandomColor()
                )
              );
            }
          } else {
            if (missile.type === 'primary') {
              gsap.to(asteroid, {
                height: asteroid.height - 20,
                width: asteroid.width - 20,
              });
            } else {
              const newHeart = new Heart(asteroid.x, asteroid.y, 'mega');
              asteroids.splice(index, 1);
              newHeart.update({ c });
            }
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

function fireMissile() {
  missiles.push(
    new Missile(player.x + 10, player.y - 20, { x: 0, y: -40 }, 'primary')
  );
  const missileFx = new Audio();
  missileFx.src = './assets/sfx/laser4.wav';
  missileFx.currentTime = 0;
  missileFx.play();
}

function fireSecondary() {
  missiles.push(
    new Missile(player.x + 10, player.y - 20, { x: 0, y: -40 }, 'secondary')
  );
  const rapidFireBeamFx = new Audio();
  rapidFireBeamFx.src = './assets/sfx/burstFire.mp3';
  rapidFireBeamFx.currentTime = 0;
  rapidFireBeamFx.play();
}

const engineSound = new Audio();
engineSound.src = './assets/sfx/engine1.wav';

addEventListener('mousedown', (e) => {
  e.preventDefault();
  if (e.button in mouseClicks) {
    mouseClicks[e.button] = true;

    if (e.button === MouseClick.RightClick && player.boostRemaining > 0) {
      player.isBoosting = true;
      engineSound.play();
    }

    if (e.button === MouseClick.LeftClick) {
      fireMissile();
    }
  }
});

addEventListener('mouseup', (e) => {
  e.preventDefault();
  if (e.button in mouseClicks) {
    mouseClicks[e.button] = false;

    if (e.button === MouseClick.RightClick) {
      player.isBoosting = false;
      accelerator = 0;
      engineSound.currentTime = 0;
      engineSound.pause();
    }
  }
});
addEventListener('mousemove', (e) => movePlayerWithMouse(e.clientX));

addEventListener('keydown', (e) => {
  if (e.key === 'z') fireMissile();
  if (e.key === 'ArrowUp' && player.boostRemaining > 0) engineSound.play();
  if (e.key === 'x') fireSecondary();

  keyPresses[e.key] = true;
});

addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') {
    accelerator = 0;
    engineSound.currentTime = 0;
    engineSound.pause();
  }
  keyPresses[e.key] = false;
});

createStars();
createAsteroids();
animate();
