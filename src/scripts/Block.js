import * as PIXI from "pixi.js";

export class Block {
  constructor() {
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["block"].texture);
  }
}