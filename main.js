import BootScene from "./scenes/BootScene.js";
import QuizScene from "./scenes/QuizScene.js";
import EndScene from "./scenes/EndScene.js";

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: "phaser-example",
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#005e16",
  scene: [BootScene, QuizScene, EndScene],
};

const game = new Phaser.Game(config);
