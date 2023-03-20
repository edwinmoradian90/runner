import { sprites } from './assets.js';
import { Colors } from './utils.js';

export default class Player {
  constructor(x, y, height, width, velocity, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.velocity = velocity;
    this.color = color;
    this.boost = 100;
    this.health = 100;
    this.isBoosting = false;
  }

  get boostRemaining() {
    return this.boost;
  }

  draw(data) {
    const { c } = data;

    c.beginPath();
    c.drawImage(sprites.ship, this.x, this.y, 30, 60);
  }

  update(data) {
    this.draw(data);
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.boost < 100 && !this.isBoosting && this.rechargeBoost(data);
  }

  useBoost(data) {
    const { frame } = data;

    const boostAmount = document.getElementById('boostAmount');
    const boostGauge = document.getElementById('boostGauge');

    this.boost -= 1;

    boostAmount.innerHTML = this.boost;
    boostGauge.style.width = `${this.boost}px`;

    if (this.boost < 5) {
      if (frame % 70 === 0) {
        boostGauge.style.background = Colors.Red;
      }
    } else if (this.boost < 25) {
      if (frame % 15 === 0) {
        boostGauge.style.background = Colors.Orange;
      }
    } else if (this.boost < 50) {
      if (frame % 10 === 0) {
        boostGauge.style.background = Colors.Yellow;
      }
    } else if (this.boost < 100) {
      if (frame % 5 === 0) {
        boostGauge.style.background = Colors.Green;
      }
    }
  }

  rechargeBoost(data) {
    const { frame } = data;

    const boostAmount = document.getElementById('boostAmount');
    const boostGauge = document.getElementById('boostGauge');

    this.boost += 1;
    boostAmount.innerHTML = this.boost;
    boostGauge.style.width = this.boost + 'px';

    if (this.boost < 5) {
      if (frame % 70 === 0) {
        boostGauge.style.background = 'red';
      }
    } else if (this.boost < 25) {
      if (frame % 15 === 0) {
        boostGauge.style.background = 'orange';
      }
    } else if (this.boost < 50) {
      if (frame % 10 === 0) {
        boostGauge.style.background = 'yellow';
      }
    } else if (this.boost < 100) {
      if (frame % 5 === 0) {
        boostGauge.style.background = 'green';
      }
    }
  }
}
