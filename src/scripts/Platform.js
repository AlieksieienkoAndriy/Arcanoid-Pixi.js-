import * as PIXI from "pixi.js";

export class Platform {
  constructor(app) {
    this.app = app;
    this.speed = 20;
    this.upKey = false;

    this.sprite = new PIXI.Sprite(
      PIXI.Loader.shared.resources["platform"].texture
    );
  }  

  move_mouse(e) {
    if (
      e.data.global.x - this.sprite.width / 2 > 0 &&
      e.data.global.x + this.sprite.width / 2 < this.app.renderer.width
      )
    this.sprite.x = e.data.global.x;
  }

  up() {
    this.upKey = true;
    this.sprite.y -= this.sprite.height;    
    this.sprite.emit("platform_up");
  }

  down() {
    this.upKey = false;
    this.sprite.y += this.sprite.height;
  }
}