import { StaticEntity } from "./entity.js";

export const chunkHeight = 16;
export const chunkWidth = 32;
export const roomType = {
  SPAWN: 0,
  GENERIC: 1
};

export class Chunk {
  constructor() {
    this.staticEntities= [];
    this.map = new Array(chunkHeight);
    for (let i = 0; i < chunkHeight; i++) {
      this.map[i] = new Array(chunkWidth); 
      this.map[i].fill(0);
      Object.seal(this.map[i]);
    }
    Object.seal(this.map);
  }

  genRoom(type) {
    this.staticEntities = [];
    for (let i = 0; i < chunkHeight; i++) {
      for (let j = 0; j < chunkWidth; j++) {
        if (i == 0 || i == chunkHeight - 1 || j == 0 || j == chunkWidth - 1) {
          this.map[i][j] = 1;
        }
      }
    }
    switch (type) {
      case roomType.GENERIC: {
        for (let i = 0; i < chunkHeight; i++) {
          for (let j = 0; j < chunkWidth; j++) {
            if (Math.random() > 0.8) {
              this.map[i][j] = 1;
            }
          }
        }
      } break;
      case roomType.SPAWN: {
        this.#clearRect(Math.floor(chunkWidth / 2 + 0.5) - 5, Math.floor(chunkHeight / 2 + 0.5) - 5, 10);
        this.#drawRect(Math.floor(chunkWidth / 2 + 0.5) - 5, Math.floor(chunkHeight / 2 + 0.5) - 5, 10);
        this.map[Math.floor(chunkHeight / 2 + 0.5)][Math.floor(chunkWidth / 2 + 0.5) - 5] = 0;
        this.map[Math.floor(chunkHeight / 2 - 0.5)][Math.floor(chunkWidth / 2 + 0.5) - 5] = 0;
      } break;
    }
    for (let i = 0; i < chunkHeight; i++) {
      for (let j = 0; j < chunkWidth; j++) {
        if (this.map[i][j] != 0)
          this.staticEntities.push(new StaticEntity(j, i, undefined));
      }
    }
  }

  clearRoom() {
    this.staticEntities = [];
    for (let i = 0; i < chunkHeight; i++) {
      for (let j = 0; j < chunkWidth; j++) {
        this.map[i][j] = 0;
      }
    }
  }

  #clearRect(x, y, width, height) {
    x = Math.max(0, Math.floor(x));
    y = Math.max(0, Math.floor(y));
    width = Math.floor(width);
    height = Math.floor(height);
    if (height == undefined || height == null || Number.isNaN(height))
      height = width;
    for (let i = y; i < Math.min(y + height, chunkHeight); i++) {
      for (let j = x; j < Math.min(x + width, chunkWidth); j++) {
        this.map[i][j] = 0; 
      }
    }
  }

  #drawRect(x, y, width, height) {
    x = Math.max(0, Math.floor(x));
    y = Math.max(0, Math.floor(y));
    width = Math.floor(width);
    height = Math.floor(height);
    if (height == undefined || height == null || Number.isNaN(height))
      height = width;
    for (let i = y; i < Math.min(y + height, chunkHeight); i++) {
      this.map[i][x] = 1;
      this.map[i][Math.min(x + width - 1, chunkWidth - 1)] = 1;
    }
    for (let i = x; i < Math.min(x + width, chunkWidth); i++) {
      this.map[y][i] = 1;
      this.map[Math.min(y + height - 1, chunkHeight - 1)][i] = 1;
    }
  }

}
