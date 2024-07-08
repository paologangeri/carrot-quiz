export default class QuizScene extends Phaser.Scene {
  constructor() {
    super("QuizScene");

    this.setupQuestions();
    this.markerYFix = 20;
    this.errorColor = "#e74c3c";
    this.pathCoordinates = [];
    this.pathMarker = null;
  }

  setupQuestions() {
    this.questions = [
      {
        question: "Qual è la capitale della Germania?",
        options: ["Berlino", "Milano", "Napoli", "Torino"],
        answer: 0,
      },
      {
        question: "Quanto fa 3 + 0?",
        options: ["2", "3", "4", "5"],
        answer: 1,
      },
      {
        question: "La risposta esatta è 5. Qual è la risposta esatta?",
        options: ["2", "3", "4", "5"],
        answer: 3,
      },
      {
        question: "Chi era il bassista dei Beatles?",
        options: [
          "Gerry Scotti",
          "Bruce Lee",
          "Paul McCartney",
          "Yuri Gagarin",
        ],
        answer: 2,
      },
      {
        question: "Dov'è Udine?",
        options: ["In Friuli", "Bruce Lee", "Paul McCartney", "Yuri Gagarin"],
        answer: 0,
      },
    ];
  }

  create() {
    this.initializeGameState();
    this.createUIElements();
    this.questionGroup = this.add.group();
    this.showQuestion();
  }

  initializeGameState() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswersHistory = [];
    this.calculatePathCoordinates();
  }

  createUIElements() {
    this.createQuestionBox();
    this.createCarrotCounter();
    this.drawPath();
    this.createPathMarker();
    this.loadSounds();
  }

  createQuestionBox() {
    const questionBox = this.add.graphics();
    const width = this.cameras.main.width;
    const height = 250;
    const x = 0;
    const y = this.cameras.main.height - height;

    questionBox.fillStyle(0x0a0030, 1);
    questionBox.fillRect(x, y, width, height);

    this.questionText = this.add.text(x + 20, y + 20, "", {
      fontSize: "24px",
      fill: "#ffffff",
      wordWrap: { width: width - 40 },
    });

    this.optionTexts = [];
  }

  createCarrotCounter() {
    const carrotIcon = this.add
      .image(40, 40, "carrot")
      .setOrigin(0, 0.5)
      .setScale(0.1);
    const carrotText = this.add.text(40, 20, `${this.score}`, {
      fontSize: "24px",
      fill: "#ffffff",
    });

    this.carrotCounter = this.add.group();
    this.carrotCounter.addMultiple([carrotIcon, carrotText]);
  }

  calculatePathCoordinates() {
    const questionsNumber = this.questions.length;
    const startX = 50;
    const endX = this.cameras.main.width - 50;
    const verticalPosition = this.cameras.main.height / 2 - 50;
    const stepX = (endX - startX) / (questionsNumber - 1);

    for (let i = 0; i < questionsNumber; i++) {
      const x = startX + stepX * i;
      const y = verticalPosition;
      this.pathCoordinates.push({ x: x, y: y });
    }
  }

  drawPath() {
    const pathGraphics = this.add.graphics();
    pathGraphics.lineStyle(3, 0xffffff, 1);
    pathGraphics.beginPath();
    this.pathCoordinates.forEach((point, index) => {
      if (index === 0) {
        pathGraphics.moveTo(point.x, point.y);
      } else pathGraphics.lineTo(point.x, point.y);
    });
    pathGraphics.strokePath();
    pathGraphics.closePath();
  }

  createPathMarker() {
    this.pathMarker = this.add
      .image(
        this.pathCoordinates[0].x,
        this.pathCoordinates[0].y - this.markerYFix,
        "bunny"
      )
      .setScale(0.1);
  }

  loadSounds() {
    this.correctAnswerSound = this.sound.add("correct");
    this.wrongAnswerSound = this.sound.add("wrong");
  }

  flashCarrot() {
    const carrotIcon = this.carrotCounter.getChildren()[0];
    this.tweens.add({
      targets: carrotIcon,
      alpha: 0,
      duration: 50,
      yoyo: true,
      repeat: 6,
    });
  }

  flashBackground(duration, interval) {
    let flashCount = 0;
    const flashingInterval = setInterval(() => {
      flashCount++;
      if (this.scene.isActive()) {
        this.cameras.main.setBackgroundColor(
          flashCount % 2 === 0
            ? this.errorColor
            : this.game.config.backgroundColor
        );
      }

      if (flashCount * interval >= duration) {
        clearInterval(flashingInterval);
        if (this.scene.isActive()) {
          this.cameras.main.setBackgroundColor(
            this.game.config.backgroundColor
          );
        }
      }
    }, interval);
  }

  showQuestion() {
    this.clearQuestionGroup();

    if (this.currentQuestionIndex >= this.questions.length) {
      this.endQuiz();
      return;
    }

    const { question, options } = this.questions[this.currentQuestionIndex];
    this.questionText.setText(question);

    options.forEach((option, index) => {
      const optionText = this.add.text(
        this.questionText.x,
        this.questionText.y + 60 + index * 40,
        option,
        { fontSize: "20px", fill: "#ffffff" }
      );
      optionText.setInteractive();
      optionText.on("pointerdown", () => this.checkAnswer(index));
      this.optionTexts.push(optionText);
    });
  }

  clearQuestionGroup() {
    this.questionGroup.clear(true, true);
    this.optionTexts.forEach((text) => text.destroy());
  }

  endQuiz() {
    this.scene.start("EndScene", {
      score: this.score,
      questionsNumber: this.questions.length,
      correctAnswersHistory: this.correctAnswersHistory,
    });
  }

  checkAnswer(selectedOptionIndex) {
    const { answer } = this.questions[this.currentQuestionIndex];
    const isLastQuestion =
      this.currentQuestionIndex >= this.questions.length - 1;

    if (selectedOptionIndex === answer) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer(isLastQuestion);
    }

    if (isLastQuestion) {
      this.endQuiz();
      return;
    }

    this.movePathMarker();
    this.currentQuestionIndex++;
    this.showQuestion();
  }

  handleCorrectAnswer() {
    this.score++;
    this.correctAnswersHistory.push(true);
    this.carrotCounter.getChildren()[1].setText(`${this.score}`);
    this.flashCarrot();
    this.correctAnswerSound.play();
  }

  handleWrongAnswer(isLastQuestion) {
    this.correctAnswersHistory.push(false);
    this.wrongAnswerSound.play();
    if (!isLastQuestion) this.flashBackground(300, 60);
  }

  movePathMarker() {
    if (this.currentQuestionIndex + 1 < this.pathCoordinates.length) {
      this.tweens.add({
        targets: this.pathMarker,
        x: this.pathCoordinates[this.currentQuestionIndex + 1].x,
        y:
          this.pathCoordinates[this.currentQuestionIndex + 1].y -
          this.markerYFix,
        duration: 500,
      });
    }
  }
}
