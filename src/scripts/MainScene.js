import * as PIXI from "pixi.js";

import { Ball } from "./Ball.js";
import { BlockGrid } from "./BlockGrid.js";
import { Config } from "./Config.js";
import { FinalWindow } from "./FinalWindow.js";
import { hitRectangle } from "./helpers.js";
import { Platform } from "./Platform.js";

export class MainScene {
  constructor(app) {
    this.app = app;

    this.container = new PIXI.Container();    

    this.createBackground();
    this.createBlackPanel();
    this.createBlocks();
    this.createPlatform();
    this.createBall();

    this.container.interactive = true;
    this.container.on("pointermove", (e) => {
      this.platform.move_mouse(e);
    });

    this.container.on("pointerdown", () => {
      if (!Config.is_ball_moving) {
        this.ball.launch();
      } else {
        this.platform.up();
      }
    });

    this.container.on("pointerup", () => {
      if (this.platform.upKey) {
        this.platform.down();
      }
    });
    
  }

  createBackground() {
    console.log(this);
    this.bg = new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture);
    this.container.addChild(this.bg);
  }

  createBlocks() {
    this.blocks = new BlockGrid();
    this.container.addChild(this.blocks.container);    
  }

  createPlatform() {
    this.platform = new Platform(this.app);
    this.platform.sprite.anchor.set(0.5);
    this.platform.sprite.position.set(this.app.screen.width / 2, 700);

    this.container.addChild(this.platform.sprite);
    this.platform.sprite.on("platform_up", this.hitStraight, this);
  }


  createBall() {    
    this.ball = new Ball(this.app, this.platform, this.blocks);
    this.ball.sprite.anchor.set(0.5);
    this.container.addChild(this.ball.sprite);
    this.ball.sprite.on("missed_ball", this.minusBall, this);
    this.ball.sprite.once("game_over", this.createFinalWindow, this);
  }


  createBlackPanel() {
    console.log(this);
    this.black_panel = new PIXI.Container();
    const bg = new PIXI.Sprite(
      PIXI.Loader.shared.resources["black_bg"].texture
    );
    this.black_panel.addChild(bg);

    const score_style = {
      fontFamily: "Arial",
      fontSize: 32,
      fill: "white",
    };
    this.score = new PIXI.Text(`Score: ${Config.score}`, score_style);
    this.score.position.set(
      0,
      (this.black_panel.height - this.score.height) / 2
    );
    this.black_panel.addChild(this.score);

    this.balls_left = new PIXI.Container();
    this.balls_left_text = new PIXI.Text(`Balls: `, score_style);
    this.balls_left.addChild(this.balls_left_text);

    this.balls_left_sprites = new PIXI.Container();
    for (let i = 0; i < Config.balls_left; i++) {
      const ball = new PIXI.Sprite(
        PIXI.Loader.shared.resources["ball"].texture
      );
      ball.position.set(i * (ball.width + 10) + this.balls_left_text.width, 0);
      this.balls_left_sprites.addChild(ball);
    }
    this.balls_left.addChild(this.balls_left_sprites);
    this.balls_left_text.position.set(
      0,
      (this.balls_left.height - this.balls_left_text.height) / 2
    );
    this.balls_left.position.set(
      this.app.screen.width / 2 - this.balls_left.width / 2,
      (this.black_panel.height - this.balls_left.height) / 2
    );
    this.black_panel.addChild(this.balls_left);

    this.container.addChild(this.black_panel);
  };

  createFinalWindow() {    
    this.container.interactive = false;
    this.game_over = new FinalWindow(this.app);
    this.container.addChild(this.game_over.container);
  };

  hitStraight() {
    console.log(this);
    if (hitRectangle(this.platform.sprite, this.ball.sprite)) {
      this.ball.sprite.y =
        this.platform.sprite.y -
        this.platform.sprite.height / 2 -
        this.ball.sprite.height / 2;
      this.ball.direction.x = 0;

      if (this.ball.sprite.y > this.platform.sprite.y) {
        this.ball.direction.y *= 1;
      } else {
        this.ball.direction.y *= -1;
      }
    }
  };

  minusBall() {
    this.balls_left_sprites.children.pop();
  };
  
  update() {
    this.ball.update();    

    this.score.text = `Score: ${Config.score}`;
    this.balls_left.text = `Balls: `;
  };
};