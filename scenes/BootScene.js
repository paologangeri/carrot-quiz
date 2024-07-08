export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("carrot", "./assets/images/carrot.png");
    this.load.image("bunny", "./assets/images/bunny.png");
    this.load.image("bw-carrot", "./assets/images/bw-carrot.png");
    this.load.audio("correct", "./assets/sfx/correct.wav");
    this.load.audio("wrong", "./assets/sfx/wrong.wav");
  }

  create() {
    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.add
      .text(screenCenterX, screenCenterY, "Inizia", {
        fontSize: "40px",
        fill: "#fff",
      })
      .setOrigin(0.5, 0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("QuizScene");
    });
  }
}
