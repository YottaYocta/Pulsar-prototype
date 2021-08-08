import { StaticEntity } from "./entity.js";

export class Projectile extends StaticEntity {
  constructor(x, y, damage, velocity, sprite) {
    super(x, y, sprite);
    this.damage = damage;
    this.velocity = velocity;
  }
}
