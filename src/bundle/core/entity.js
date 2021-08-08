import * as PIXI from "pixi.js";
import { Melody } from "./music.js";

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

export class Player extends ActiveEntity {
  constructor(x, y, speed, health, sprite) {
    super(x, y, speed, health, sprite);
    this.melody = new Melody(8);
  }
}

