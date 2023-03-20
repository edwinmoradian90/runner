import { sprites } from './assets.js';

export default class Missile {
  constructor(x, y, velocity, type = 'primary') {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.type = type;
  }

  draw(data) {
    const { c } = data;

    c.beginPath();
    c.drawImage(
      this.type === 'primary' ? sprites.missile : sprites.rapidFireBeams,
      this.x,
      this.y,
      10,
      40
    );
  }

  update(data) {
    this.draw(data);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
