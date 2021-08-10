import { Vec2 } from "./utils.js";

export class Pulse {
  constructor(angle, range, origin) {
    this.angle = angle;
    this.range = range;
    this.origin = origin;
  }

  getAffectedTiles() {
    let diffX = Math.floor(Math.cos(this.angle) * this.range + 0.5);
    let diffY = Math.floor(Math.sin(this.angle) * this.range + 0.5);
    let absX = Math.abs(diffX);
    let absY = Math.abs(diffY);
    let tilesAffected = [];
    if (Math.abs(0 - diffX) < 0.001) {
      let increment = (diffY >= 0) ? 1 : -1;
      let initial = 0;
      for (let i = 0; i < absY; i++) {
        tilesAffected.push(new Vec2(Math.floor(this.origin.x + 0.5), Math.floor(this.origin.y + 0.5 + i * increment)));
      }
    }
    else {
      let slope = diffY / diffX;
      let incrementY = (diffY > 0) ? 1 : -1;
      let incrementX = (diffX > 0) ? 1 : -1;
      let y = Math.floor(this.origin.y + 0.5);
      let x = Math.floor(this.origin.x + 0.5);
      if (slope > -1 && slope < 1) {
        let treshold = absX;
        let error = 0;
        for (let i = 0; i < absX; i++) {
           error += absY + absY; 
           x += incrementX;
           tilesAffected.push(new Vec2(x, y));
           if (error > treshold) {
              treshold += absX + absX;
              y += incrementY;
           }
        }
      }
      else {
        let increment = (diffX > 0) ? 1 : -1;
        let treshold = absY;
        let error = 0;
        for (let i = 0; i < absY; i++) {
          error += absX + absX;
          y += incrementY;
          tilesAffected.push(new Vec2(x, y));
          if (error > treshold) {
            treshold += absY + absY;
            x += incrementX;
          }
        }
      }
    }
    return tilesAffected;
  }
}
