import { random } from './utils.js';

export default class Particle {
  constructor(x, y, velocity, color) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.color = color;
    this.alpha = 1;
  }

  draw(data) {
    const { c } = data;

    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.fillStyle = this.color || 'white';
    c.arc(this.x, this.y, random(0, 3), 0, 2 * Math.PI, false);
    c.fill();
    c.restore();
  }

  update(data) {
    const { friction, accelerator } = data;

    this.draw(data);
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y + accelerator;
    this.alpha -= 0.01;
  }
}
