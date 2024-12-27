export interface PointLike {
  x: number;
  y: number;
}

export class Point {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy(): Point {
    return new Point(this.x, this.y);
  }
}
