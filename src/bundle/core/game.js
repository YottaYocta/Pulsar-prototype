import * as PIXI from "pixi.js";
import * as Tone from "tone";
import PulsarEngine from "./engine.js";
import Floor from "./floor.js";
import { Chunk, chunkHeight, chunkWidth } from "./chunk.js";
import { StaticEntity, ActiveEntity } from "./entity.js";

const spriteSize = 32;
const timeUnit = 60;
const loader = PIXI.Loader.shared;
const wallCollision = {
  TRUE: 1,
  FALSE: 0,
}

export default class PulsarGame {
  constructor() {

    // core //
    this.engine = new PulsarEngine();
    this.engine.initialize(() => {
      this.entities = [];
      this.entities[0] = new ActiveEntity(Math.floor(chunkWidth / 2  - 2 + Math.random() * 4), Math.floor(chunkHeight / 2 + 0.5 - 2 + Math.random() * 4), 1, 30, undefined);

      // map generation //
      this.floors = [];
      this.floors[0] = new Floor();
      this.currentFloor = 0;
      this.currentChunk = this.floors[0].chunks[0][0];

      // event handling //
      this.createEventHandlers();

      // assets //
      this.playerAssets = ["assets/red.png", "assets/blue.png", "assets/green.png"];
      this.environmentAssets = ["assets/rock-wall.png", "assets/rock-wall-top.png"];
      loader.add(this.environmentAssets).add(this.playerAssets).load(() => {
        this.createSprites();
      });
      loader.onComplete.add(() => {
        this.initGameLoop();
        this.initPulse();
      });
    });
  }

  createSprites() {
    this.engine.app.stage.removeChildren();
    this.entities[0].sprite = new PIXI.Sprite(loader.resources[this.playerAssets[Math.floor(Math.random() * this.playerAssets.length)]].texture);
    this.engine.app.stage.addChild(this.entities[0].sprite);

    this.currentChunk.staticEntities.forEach(entity => {
      if (entity.y == 15 || this.currentChunk.map[entity.y + 1][entity.x] == 0)
        entity.sprite = new PIXI.Sprite(loader.resources[this.environmentAssets[0]].texture);
      else
        entity.sprite = new PIXI.Sprite(loader.resources[this.environmentAssets[1]].texture);
      entity.sprite.position.set(entity.x * spriteSize, entity.y * spriteSize);
      this.engine.app.stage.addChild(entity.sprite);
    });
  }

  // Events //

  createEventHandlers() {
    window.addEventListener("keydown", this.handleKeyPress.bind(this));
  }

  handleKeyPress(event) {
    let originalTargetX = this.entities[0].targetX;
    let originalTargetY = this.entities[0].targetY;
    switch (event.keyCode) {
      case 76: this.entities[0].targetX++; break; 
      case 72: this.entities[0].targetX--; break;
      case 74: this.entities[0].targetY++; break;
      case 75: this.entities[0].targetY--; break;
      case 89: this.entities[0].targetX--; this.entities[0].targetY--; break;
      case 85: this.entities[0].targetX++; this.entities[0].targetY--; break;
      case 66: this.entities[0].targetX--; this.entities[0].targetY++; break;
      case 78: this.entities[0].targetX++; this.entities[0].targetY++; break; 
    }
    if ((!this.checkTargetValid(originalTargetX, originalTargetY, originalTargetX, this.entities[0].targetY) &&
        !this.checkTargetValid(originalTargetX, originalTargetY, this.entities[0].targetX, originalTargetY)) || 
        !this.checkTargetValid(originalTargetX, originalTargetY, this.entities[0].targetX, this.entities[0].targetY)) {
      this.entities[0].targetX = originalTargetX; 
      this.entities[0].targetY = originalTargetY;
    }
    this.tick();
  }

  checkTargetValid(originalTargetX, originalTargetY, targetX, targetY) {
    if (targetX < 0 || targetX > 31 || targetY < 0 || targetY > 15)
      return false;
    let targetValid = this.currentChunk.map[targetY][targetX] != 1;
    if (!targetValid)
      return false;
    return true;
  }

  // Game Functions //

  repaint() {
    this.entities.forEach(entity => {
      entity.sprite.position.set(entity.x * spriteSize, entity.y * spriteSize);
    });
  }

  update() {
    this.entities.forEach(entity => {
      if (Math.abs(entity.targetX - entity.x) > 0.001) {
        let changeX = ((entity.targetX - entity.x > 0) ? 0.25 + 5 * (entity.targetX - entity.x) : -0.25 + 5 * (entity.targetX - entity.x)) / timeUnit; 
        entity.x += changeX;
        if ((entity.x < 0.05 || entity.x > 30.95) || this.checkWallCollision(entity.x, entity.y) != wallCollision.FALSE)
          entity.x -= changeX;
      }
      if (Math.abs(entity.targetY - entity.y) > 0.001) {
        let changeY = ((entity.targetY - entity.y > 0) ? 0.25 + 5 * (entity.targetY - entity.y) : -0.25 + 5 * (entity.targetY - entity.y)) / timeUnit; 
        entity.y += changeY;
        if ((entity.y < 0.05 || entity.y > 14.95) || this.checkWallCollision(entity.x, entity.y) != wallCollision.FALSE)
          entity.y -= changeY;
      }
    });
  }

  tick() {

  }

  initGameLoop() {
    requestAnimationFrame(this.initGameLoop.bind(this));
    this.update();
    this.repaint();
  }

  initPulse() {
    this.synth = new Tone.FMSynth().toDestination();
    this.dmin7 = ["d3", "f3", "a3", "c4"];
    this.gmaj7 = ["g2", "b2", "d3", "f3"];
    this.cmaj7 = ["c3", "e3", "g3", "b3"];
    let eighthDuration = Tone.Time("8n").toSeconds();
    let count = 0;
    this.loop = new Tone.Loop(time => {
      this.synth.triggerAttackRelease(this.dmin7[0], "8n", 0 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.dmin7[1], "8n", 1 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.dmin7[2], "8n", 2 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.dmin7[3], "8n", 3 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.gmaj7[0], "8n", 4 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.gmaj7[1], "8n", 5 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.gmaj7[2], "8n", 6 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.gmaj7[3], "8n", 7 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.cmaj7[0], "8n", 8 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.cmaj7[1], "8n", 9 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.cmaj7[2], "8n", 10 * eighthDuration + time);
      this.synth.triggerAttackRelease(this.cmaj7[3], "8n", 11 * eighthDuration + time);

    }, "1m").start(0);
    Tone.Transport.start()
  }

  // Collision and Physics //

  checkWallCollision(x, y) {
    if (this.currentChunk.map[Math.floor(y + 0.1)][Math.floor(x + 0.1)] == 1 ||
      this.currentChunk.map[Math.floor(y + 0.9)][Math.floor(x + 0.1)] == 1 ||
      this.currentChunk.map[Math.floor(y + 0.1)][Math.floor(x + 0.9)] == 1 ||
      this.currentChunk.map[Math.floor(y + 0.9)][Math.floor(x + 0.9)] == 1)
      return wallCollision.TRUE;
    else 
      return wallCollision.FALSE;
  }
}
