import * as PIXI from "pixi.js";
import * as Tone from "tone";
import { Melody } from "./music.js";
import { Vec2 } from "./utils.js";
import { Pulse } from "./pulse.js";

export const spriteSize = 32;

export class StaticEntity extends Vec2 {
  constructor(x, y, sprite) {
    super(x, y);
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
    this.numPulses = 4;
    this.pulseRange = 1;
  }

  handlePulse() {
    return this.createPulses();
  }

  createPulses() {
    let pulses = [];
    for (let i = 0; i < this.numPulses; i++) {
      pulses.push(new Pulse(Math.random() * 2 * Math.PI, this.pulseRange, this));
    }
    return pulses;
  }
}

export class AudioEntity extends ActiveEntity {
  constructor(x, y, speed, health, sprite) {
    super(x, y, speed, health, sprite);
    this.melody = new Melody(8);
    this.synth = new Tone.DuoSynth().toDestination();
  } 
}

