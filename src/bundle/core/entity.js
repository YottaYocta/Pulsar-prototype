import * as PIXI from "pixi.js";
import * as Tone from "tone";
import { Melody } from "./music.js";

export const spriteSize = 32;

export class StaticEntity {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.size = 1;
  }
}

export class ActiveEntity extends StaticEntity {
  constructor(x, y, speed, health, sprite) {
    super(x, y, sprite);
    this.targetX = x;
    this.targetY = y;
    this.speed = speed;
    this.health = health;
    this.pulseRange = 1;
    this.pulseSprites = [];
    this.lastPulseLocationX = this.targetX;
    this.lastPulseLocationY = this.targetY;
  }

  genPulseSprites(texture) {
    this.pulseSprites = [];
    for (let i = 1; i <= this.pulseRange; i++) {
      let rPulseSprite = new PIXI.Sprite(texture);
      rPulseSprite.position.set((Math.floor(this.x + 0.5) + i + 0.5) * spriteSize, (Math.floor(this.y + 0.5) + 0.5) * spriteSize);
      rPulseSprite.anchor.set(0.5);
      let lPulseSprite = new PIXI.Sprite(texture);
      lPulseSprite.position.set((Math.floor(this.x + 0.5) - i + 0.5) * spriteSize, (Math.floor(this.y + 0.5) + 0.5) * spriteSize);
      lPulseSprite.anchor.set(0.5);
      let tPulseSprite = new PIXI.Sprite(texture);
      tPulseSprite.position.set((Math.floor(this.x + 0.5) + 0.5) * spriteSize, (Math.floor(this.y + 0.5) + i + 0.5) * spriteSize);
      tPulseSprite.anchor.set(0.5);
      let bPulseSprite = new PIXI.Sprite(texture);
      bPulseSprite.position.set((Math.floor(this.x + 0.5) + 0.5) * spriteSize, (Math.floor(this.y + 0.5) - i + 0.5) * spriteSize);
      bPulseSprite.anchor.set(0.5);
      this.pulseSprites.push(rPulseSprite, lPulseSprite, tPulseSprite, bPulseSprite);
    }
  }

  handlePulse() {
    this.movePulseSprites();
    this.lastPulseLocationX = Math.floor(this.x + 0.5);
    this.lastPulseLocationY = Math.floor(this.y + 0.5);
  }

  movePulseSprites() {
    for (let i = 0; i < this.pulseSprites.length; i++) {
      this.pulseSprites[i].x += (Math.floor(this.x + 0.5) - this.lastPulseLocationX != 0) ? (Math.floor(this.x + 0.5) - this.lastPulseLocationX) * spriteSize : 0;
      this.pulseSprites[i].y += (Math.floor(this.y + 0.5) - this.lastPulseLocationY != 0) ? (Math.floor(this.y + 0.5) - this.lastPulseLocationY) * spriteSize : 0;
      this.pulseSprites[i].alpha = 1;
    }
  }
}

export class AudioEntity extends ActiveEntity {
  constructor(x, y, speed, health, sprite) {
    super(x, y, speed, health, sprite);
    this.melody = new Melody(8);
    this.synth = new Tone.Synth();
    this.synth.toDestination();
  } 
}

