export default class EndScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  init(data) {
    this.score = data.score;
    this.questionsNumber = data.questionsNumber;
    this.correctAnswersHistory = data.correctAnswersHistory;
  }

  create() {
    this.createText();
    this.createCarrots();
    this.createRestartButton();
  }

  createText() {
    const centerX = this.cameras.main.width / 2;
    this.add
      .text(
        centerX,
        100,
        `Hai guadagnato ${this.score} ${
          this.score === 1 ? "carota" : "carote"
        }!`,
        {
          fontSize: "32px",
          fill: "#ffffff",
        }
      )
      .setOrigin(0.5, 0.5);
  }

  createCarrots() {
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;
    const radius = 120;
    const startAngle = -Math.PI / 2;
    const angleStep = Phaser.Math.PI2 / this.questionsNumber;

    this.carrots = [];

    for (let i = 0; i < this.questionsNumber; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      const carrotType =
        this.correctAnswersHistory[i] === false ? "bw-carrot" : "carrot";
      const carrot = this.add
        .image(x, y, carrotType)
        .setScale(0.1)
        .setOrigin(0.5, 0.5);

      this.carrots.push(carrot);
    }
  }

  createRestartButton() {
    const centerX = this.cameras.main.width / 2;
    const bottomY = this.cameras.main.height - 100;

    const restartButton = this.add
      .text(centerX, bottomY, "Ricomincia", {
        fontSize: "30px",
        fill: "#ffffff",
      })
      .setOrigin(0.5, 0.5);

    restartButton.setInteractive();
    restartButton.on("pointerdown", () => {
      this.scene.start("QuizScene");
    });
  }

  update() {
    this.carrots.forEach((carrot) => {
      carrot.angle += 1;
    });
  }
}
