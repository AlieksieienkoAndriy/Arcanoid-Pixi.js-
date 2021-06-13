import * as PIXI from "pixi.js";
import anime from "animejs";

import { Config } from "./Config.js";
import { Globals } from "./Globals.js";
import { MainScene } from "./MainScene.js";

export class FinalWindow {
  constructor(app) {
    this.app = app;    
    this.container = new PIXI.Container();    
    
    this.createBackground();
    this.createText();
    this.createButton();    
  }

  createBackground() {
    const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
    bg.tint = 0x000000;
    bg.width = 1440;
    bg.height = 810;
    bg.alpha = 0.7;
    this.container.addChild(bg);
  };

  createText() {
    let text;
    if (Config.game_won) {
      text = "CONGRATULATIONS!!!\nYou won!";
    } else {
      text = `GAME OVER\nYou destroyed ${Config.score} asteroids`;
    }

    const container_text = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: 48,
      fill: "white",
      align: "center",
      lineHeight: 100,
    });
    container_text.anchor.set(0.5);
    container_text.position.set(this.app.screen.width / 2, 200);
    this.container.addChild(container_text);
  }

  createButton() {
    const button = new PIXI.Sprite(PIXI.Loader.shared.resources["restart_button"].texture);
    button.anchor.set(0.5);
    button.position.set(this.app.screen.width / 2, 400);
    
    const button_text = new PIXI.Text("Restart", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: "white"
    });
    button_text.anchor.set(0.5);    
    button.addChild(button_text);

    button.interactive = true;
    button.buttonMode = true;
    button.once("pointerdown", () => {
      console.log('click');

      anime({
        targets: button.scale,
        x: 0.9,
        y: 0.9,
        duration: 150,
        easing: "linear",
        complete: () => {
          button.scale.set(1);
          
          Config.block_rows = 4;
          Config.block_columns = 10;
          Config.balls_left = 2;  
          Config.score = 0;  
          Config.is_ball_moving = false;            
          Config.game_won = false;           
          
          Globals.scene.start(new MainScene(this.app));

        }
      });
    });
    
    this.container.addChild(button);
  }
}