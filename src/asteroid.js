import { sprites } from './assets.js';

export default class Asteroid {
  constructor(x, y, velocity, height, width) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.height = height;
    this.width = width;
  }

  draw(data) {
    const { c } = data;

    c.beginPath();
    c.drawImage(sprites.asteroidBig, this.x, this.y, this.height, this.width);
  }

  update(data) {
    const { accelerator } = data;

    this.draw(data);
    this.x += this.velocity.x;
    this.y += this.velocity.y + accelerator;
  }
}
