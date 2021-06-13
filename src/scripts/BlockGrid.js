import * as PIXI from "pixi.js";

import { Block } from "./Block.js";
import { Config } from "./Config.js";

export class BlockGrid {
  constructor() {
    this.container = new PIXI.Container();
    this.container.position.set(0, 0);
    this.gap = 10;
    this.block_width = 100;
    this.block_height = 44;

    this.width = Config.block_columns * (this.block_width + this.gap);

    this.fill_blocks();
  }

  fill_blocks() {    
    for (let i = 0; i < Config.block_rows; i++) {
      for (let j = 0; j < Config.block_columns; j++) {
        const block = new Block();
        block.sprite.anchor.set(0.5);
        block.sprite.position.set(
          j * (block.sprite.width + this.gap) + (block.sprite.width / 2) + 720 - this.width / 2,  
          i * (block.sprite.height + this.gap) + (block.sprite.height / 2 + 100) 
        );
        this.container.addChild(block.sprite);
      }
    }    
  }  
}