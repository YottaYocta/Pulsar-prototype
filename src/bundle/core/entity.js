import * as PIXI from "pixi.js";

export class StaticEntity {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite
  }
}

export class ActiveEntity extends StaticEntity {
  constructor(x, y, speed, health, sprite) {
    super(x, y, sprite);
    this.targetX = x;
    this.targetY = y;
    this.speed = speed;
    this.health = health;
  }
}
