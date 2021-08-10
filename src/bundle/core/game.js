import * as PIXI from "pixi.js";
import * as Tone from "tone";
import Floor from "./floor.js";
import { parseSixteenthTime } from "./music.js"; 
import { PulsarEngine, engineMode } from "./engine.js";
import { Chunk, chunkHeight, chunkWidth } from "./chunk.js";
import { StaticEntity, ActiveEntity, AudioEntity, spriteSize } from "./entity.js";
/**
import { Vec2 } form "./physics.js";
**/

const timeUnit = 60;
const loader = PIXI.Loader.shared;
const wallCollision = {
  TRUE: 1,
  FALSE: 0,
}

export default class PulsarGame {
  constructor() {

    // core //
    this.engine = new PulsarEngine(engineMode.DEVELOPMENT);
    this.engine.initialize(() => {
      this.entities = [];
      this.entities[0] = new AudioEntity(Math.floor(chunkWidth / 2  - 2 + Math.random() * 4), Math.floor(chunkHeight / 2 + 0.5 - 2 + Math.random() * 4), 1, 30, undefined);
      this.entities[0].melody.genMelodyInKey("C");
      this.initPulse();
      
      // misc //
      this.pulses = [];
      this.pulseSprites = [];

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
      this.pulseAssets = ["assets/pulse-basic.png"];
      loader.add(this.environmentAssets).add(this.playerAssets).add(this.pulseAssets).load(() => {
        this.createSprites();
      });
      loader.onComplete.add(() => {
        this.initGameLoop();
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
      entity.sprite.anchor.set(0.5);
      entity.sprite.position.set((entity.x + 0.5) * spriteSize, (entity.y + 0.5) * spriteSize);
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
      entity.sprite.anchor.set(0.5);
      entity.sprite.position.set((entity.x + 0.5) * spriteSize, (entity.y + 0.5) * spriteSize);
    });
  }

  update() {
    this.entities.forEach(entity => {
      if (Math.abs(entity.targetX - entity.x) > 0.001) {
        let changeX = ((entity.targetX - entity.x > 0) ? 0.25 + 4 * (entity.targetX - entity.x) : -0.25 + 4 * (entity.targetX - entity.x)) / timeUnit; 
        entity.x += changeX;
        if ((entity.x < 0.05 || entity.x > 30.95) || this.checkWallCollision(entity.x, entity.y) != wallCollision.FALSE)
          entity.x -= changeX;
      }
      if (Math.abs(entity.targetY - entity.y) > 0.001) {
        let changeY = ((entity.targetY - entity.y > 0) ? 0.25 + 4 * (entity.targetY - entity.y) : -0.25 + 4 * (entity.targetY - entity.y)) / timeUnit; 
        entity.y += changeY;
        if ((entity.y < 0.05 || entity.y > 14.95) || this.checkWallCollision(entity.x, entity.y) != wallCollision.FALSE)
          entity.y -= changeY;
      }
      if (entity.sprite.scale.x > 1)
        entity.sprite.scale.x /= 1.005;
        entity.sprite.scale.y = entity.sprite.scale.x;
    });
    this.pulseSprites.forEach(sprite => {
      if (sprite.alpha > 0)
        sprite.alpha -= 0.05;
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
    this.tempo = Math.floor(Math.random() * 20) + 230;
    this.pulseSynth = new Tone.MembraneSynth().toDestination();
    this.melodyLoop = new Tone.Loop(time => {
      let data = this.entities[0].melody.getData();
      for (let i = 0; i < data.length; i++) {
        this.entities[0].synth.triggerAttackRelease(data[i].note, parseSixteenthTime(data[i].duration), Tone.Time(parseSixteenthTime(data[i].start)).toSeconds() + time);
      }
    }, parseSixteenthTime(this.entities[0].melody.getDuration())).start(2);
    this.pulseLoop = new Tone.Loop(time => {
      this.pulseSynth.triggerAttackRelease("C2", "8n", time);
      this.pulses = [];
      let spritesUsed = 0;
      this.entities.forEach(entity => {
        entity.sprite.scale.set(1);
        entity.sprite.scale.x += 0.08;
        entity.sprite.scale.y = entity.sprite.scale.x;
        let pulses = entity.handlePulse();
        for (let i = 0; i < pulses.length; i++) {
          let affected = pulses[i].getAffectedTiles();
          for (let j = 0; j < affected.length; j++) {
            let sprite;
            if (this.pulseSprites.length <= spritesUsed) {
              sprite = this.createPulseSprite();
              sprite.anchor.set(0.5);
              this.pulseSprites.push(sprite);
              this.engine.app.stage.addChild(sprite);
            }
            else {
              sprite = this.pulseSprites[spritesUsed];
            }
            sprite.position.set((affected[j].x + 0.5) * spriteSize, (affected[j].y + 0.5) * spriteSize);
            sprite.alpha = 1;
            spritesUsed++;
          }
        }
      });
    }, "2n").start(2);
    Tone.Transport.start();
    Tone.Transport.bpm.set({
      value: this.tempo
    });
  }

  createPulseSprite() {
    return new PIXI.Sprite(loader.resources[this.pulseAssets[0]].texture);
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
