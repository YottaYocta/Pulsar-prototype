import { Chunk, roomType } from "./chunk.js";

export default class Floor {
  constructor() {
    this.chunks = new Array(3);
    for (let i = 0; i < 3; i++) {
      this.chunks[i] = new Array(3);
      for (let j = 0; j < 3; j++) {
        let tempChunk = new Chunk();
        tempChunk.genRoom(roomType.GENERIC);
        tempChunk.genRoom(roomType.SPAWN);
        tempChunk.map[0][0] = 0;
        this.chunks[i].fill(tempChunk);
      }
      Object.seal(this.chunks[i]);
    }
    Object.seal(this.chunks);
  }
}
