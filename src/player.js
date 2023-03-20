import { sprites } from './assets.js';

export default class Player {
  constructor(x, y, height, width, velocity, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.velocity = velocity;
    this.color = color;
  }

  draw(c) {
    c.beginPath();
    c.drawImage(sprites.ship, this.x, this.y, 30, 60);
  }

  update(c) {
    this.draw(c);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
