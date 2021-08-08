
export class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(b) {
    this.x += b.x; 
    this.y += b.y;
  }

  sub(b) {
    this.x -= b.x;
    this.y -= b.y;
  }

  mult(b) {
    this.x *= b;
    this.y *= b;
  }

  div(b) {
    this.x /= b;
    this.y /= b;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}
