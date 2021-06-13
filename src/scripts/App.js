import * as PIXI from "pixi.js";

import { Globals } from "./Globals.js";
import { MainScene } from "./MainScene.js";
import { SceneManager } from "./SceneManager.js";

export class App {
  run() {
    this.canvas = document.getElementById("canvas");
    this.app = new PIXI.Application({
      view: this.canvas,
      width: 1440,
      height: 810,

      // width: window.innerWidth,
      // height: window.innerWidth * 9 / 16,
      
      // resizeTo: window,
      // transparent: true,
    });
    window.onresize = this.onResize;
    this.onResize();

    this.loader = PIXI.Loader.shared;

    this.preloader = new Promise((resolve, reject) => {
      this.loader
        .add("bg", "src/sprites/background.png")
        .add("platform", "src/sprites/platform.png")
        .add("block", "src/sprites/block.png")
        .add("ball", "src/sprites/ball.png")
        .add("black_bg", "src/sprites/black_bg.png")
        .add("restart_button", "src/sprites/restart_button.png")
        .load(() => {
          resolve();
        });
    });

    Globals.scene = new SceneManager();
    this.app.stage.addChild(Globals.scene.container);
    this.app.ticker.add(() => Globals.scene.update());

    this.preloader.then(() => {
      Globals.scene.start(new MainScene(this.app));
    });
  }

  onResize() {
    const style = this.canvas.style;
    let width;
    let height;
    let margin;

    if (window.innerWidth > (window.innerHeight * 1440) / 810) {
      width = (window.innerHeight / 810) * 1440;
      height = window.innerHeight;
      margin = (window.innerWidth - width) / 2;

      style.width = `${width}px`;
      style.height = `${height}px`;
      style.marginTop = `0`;
      style.marginLeft = `${margin}px`;
    } else {
      width = window.innerWidth;
      height = (window.innerWidth / 1440) * 810;
      margin = (window.innerHeight - height) / 2;

      style.width = `${width}px`;
      style.height = `${height}px`;
      style.marginTop = `${margin}px`;
      style.marginLeft = `0`;
    }
  }
}
