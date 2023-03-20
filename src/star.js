export default class Star {
  constructor(x, y, radius, velocity, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.color = color;
  }

  draw(data) {
    const { c } = data;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, this.color, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update(data) {
    const { accelerator } = data;

    this.draw(data);
    this.x += this.velocity.x;
    this.y += this.velocity.y + accelerator;
  }
}
