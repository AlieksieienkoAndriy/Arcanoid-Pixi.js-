import anime from "animejs";
import * as PIXI from "pixi.js";

import { Config } from "./Config.js";
import { hitRectangle } from "./helpers.js";

export class Ball{
  constructor(app, platform, blocks) {
    this.app = app;
    this.platform = platform;
    this.blocks = blocks;
    console.log(this.blocks);
    console.log(this.platform);
    this.sprite = new PIXI.Sprite(PIXI.Loader.shared.resources["ball"].texture);
    this.direction = {
      x: 1,
      y: 1,
    };

    this.speed = 5;

    this.ball_anim = anime({
      targets: this.sprite,
      easing: "linear",
      rotation: 2 * Math.PI,      
      duration: 1000,
      loop: true,
    });

    this.ball_anim.pause();
  }

  start_position(x, y){
    this.sprite.position.set(x, y)
  }

  launch() {
    Config.is_ball_moving = true;
    this.ball_anim.play();
  }

  move() {
    if (this.direction.x > 0 && (this.sprite.position.x + (this.sprite.width / 2)) >= this.app.screen.width) {        
      this.direction.x *= -1;
    }
    if (this.direction.y > 0 && (this.sprite.position.y - (this.sprite.height / 2)) <= 50) {            
      this.direction.y *= -1;
    }
    if (this.direction.x < 0 && (this.sprite.position.x - (this.sprite.width / 2)) <= 0) {      
      this.direction.x *= -1;
    }
    if (this.direction.y < 0 && (this.sprite.position.y + (this.sprite.height / 2)) >= this.app.screen.height) {
      Config.balls_left--;
      
      this.sprite.emit("missed_ball");
      
      if (Config.balls_left < 0) {        
        this.sprite.emit("game_over");
      }
      Config.is_ball_moving = false;
      this.ball_anim.pause();       
    }

    // if (                                                                              // Why doesn't it work?
    //   (this.direction.x > 0 && this.sprite.position.x >= this.app.screen.width) ||
    //   (this.direction.x < 0 && this.sprite.position.x <= 0)
    // ) {
    //   console.log(`if`);
    //   this.direction.x *= -1;
    // }
    // if (
    //   (this.direction.y > 0 && this.sprite.position.y <= 0) ||
    //   (this.direction.y < 0 && this.sprite.position.y >= this.app.screen.height)
    // ) {
    //   this.direction.y = -1;
    // }

    this.sprite.position.set(
      this.sprite.position.x += this.speed * this.direction.x,
      this.sprite.position.y -= this.speed * this.direction.y,
    );
  }

  update() {
    if (!Config.is_ball_moving) {
      this.start_position(
        this.platform.sprite.x,
        this.platform.sprite.y -
          this.platform.sprite.height / 2 -
          this.sprite.height / 2
      );
    } else {
      this.move();
    }

    if (
      hitRectangle(this.platform.sprite, this.sprite) &&
      this.direction.y < 0 &&
      Config.is_ball_moving
    ) {
      if (this.sprite.y > this.platform.sprite.y) {
        this.direction.y *= 1;
      } else {
        this.direction.y *= -1;
      }

      if (this.sprite.x > this.platform.sprite.x) {
        this.direction.x = 1;
      } else {
        this.direction.x = -1;
      }
    }

    for (let block of this.blocks.container.children) {
      if (hitRectangle(block, this.sprite)) {
        Config.score++;

        this.direction.y *= -1;
        this.blocks.container.removeChild(block);
      }
    }

    if (Config.score === Config.block_rows * Config.block_columns) {      
      Config.is_ball_moving = false;
      this.ball_anim.pause();

      Config.game_won = true;
      this.sprite.emit("game_over");
    }
  } 
}