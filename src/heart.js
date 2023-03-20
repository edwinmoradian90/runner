import { sprites } from './assets.js';

export default class Heart {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.healthGiven = 50;
  }

  draw(data) {
    const { c } = data;

    c.beginPath();
    c.drawImage(sprites.heart, this.x, this.y);
  }

  update(data) {
    this.draw(data);
  }
}
