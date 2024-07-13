export class Question {
    constructor(text, answers, correctAnswerIndex) {
        this.text = text;
        this.answers = answers;
        this.correctAnswerIndex = correctAnswerIndex;
        this.selectedAnswer = null;
        this.marked = false;
    }

    isCorrect() {
        return this.selectedAnswer === this.correctAnswerIndex;
    }
}

export class Quiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    getCurrentQuestionIndex() {
        return this.currentQuestionIndex;
    }

    setCurrentQuestionIndex(index) {
        this.currentQuestionIndex = index;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
        }
    }

    calculateScore() {
        let score = 0;
        this.questions.forEach((question) => {
            if (question.isCorrect()) {
                score++;
            }
        });
        return score;
    }

    isCompleted() {
        return !this.questions.some(
            (question) => question.selectedAnswer === null
        );
    }

    getUnsolvedQuestionIndex() {
        return this.questions.findIndex(
            (question) => question.selectedAnswer === null
        );
    }
}

export class Answer {
    constructor(text, isCorrect) {
        this.text = text;
        this.isCorrect = isCorrect;
    }
}
