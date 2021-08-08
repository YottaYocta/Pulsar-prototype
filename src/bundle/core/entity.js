import * as PIXI from "pixi.js";
import * as Tone from "tone";
import { Melody } from "./music.js";
import { Projectile } from "./projectile.js";

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
    this.projectileModifiers = [];
  }

  createProjectile(velocity, sprite) {
    let p = new Projectile(this.x, this.y, this.damage, velocity, sprite);
    for (let i = 0; i < this.projectileModifiers.length; i++) {
      p = this.projectileModifiers[i].apply(p);
    }
    return p;
  }
}

export class AudioEntity extends ActiveEntity {
  constructor(x, y, speed, health, sprite) {
    super(x, y, speed, health, sprite);
    this.melody = new Melody(8);
    this.synth = new Tone.Synth();
  }
}

