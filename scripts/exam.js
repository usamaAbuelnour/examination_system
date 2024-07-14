import { Quiz, Question, Answer } from "../classes/classes.js";

const quiz = new Quiz();
const questionDisplay = document.getElementById("question");
const answersForm = document.getElementById("answers");
const markedQuestions = document.querySelector("aside");
const quizSection = document.getElementById("quiz-section");
const timerDisplay = document.getElementById("timer");
const questoinNumber = document.getElementById("question-number");
let numOfMarkedQuestion = 0;

const quizTimeLimit = 20;
let quizTimer;

function startTimer() {
    let endTime = Date.now() + quizTimeLimit * 60 * 1000;

    timerDisplay.textContent = `${quizTimeLimit - 1} : 59`;

    quizTimer = setInterval(() => {
        let remainingTime = endTime - Date.now();
        if (remainingTime <= 0) {
            clearInterval(quizTimer);
            finishQuiz();
            location.replace("../pages/timeOut.html");
        } else {
            let minutes = Math.floor(remainingTime / 60000);
            let seconds = Math.floor((remainingTime % 60000) / 1000);
            timerDisplay.textContent = `${
                minutes < 10 ? `0${minutes}` : minutes
            } : ${seconds < 10 ? `0${seconds}` : seconds}`;
        }
    }, 1000);
}

function displayCurrentQuestion() {
    if (!quiz.getCurrentQuestionIndex()) previousButton.disabled = true;
    else previousButton.disabled = false;

    if (quiz.getCurrentQuestionIndex() === quiz.questions.length - 1)
        nextButton.disabled = true;
    else nextButton.disabled = false;

    const currentQuestion = quiz.getCurrentQuestion();
    const questionIndex = quiz.getCurrentQuestionIndex() + 1;

    questoinNumber.textContent = questionIndex;

    questionDisplay.innerHTML = `${currentQuestion.text}`;
    answersForm.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const answerElement = document.createElement("label");
        const radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = "answer";
        radioInput.value = index;

        if (currentQuestion.selectedAnswer === index) {
            radioInput.checked = true;
        }

        radioInput.addEventListener("change", () => {
            currentQuestion.selectedAnswer = index;
        });

        answerElement.appendChild(radioInput);
        answerElement.appendChild(document.createTextNode(answer.text));

        answersForm.appendChild(answerElement);
    });
}

const previousButton = document.querySelector(".previous");
const markButton = document.querySelector(".mark");
const nextButton = document.querySelector(".next");
const finishButton = document.querySelector(".finish");

previousButton.addEventListener("click", () => {
    quiz.previousQuestion();
    displayCurrentQuestion();
});

nextButton.addEventListener("click", () => {
    quiz.nextQuestion();
    displayCurrentQuestion();
});

markButton.addEventListener("click", () => {
    const currentQuestion = quiz.getCurrentQuestion();
    const currentQuestionIndex = quiz.getCurrentQuestionIndex();

    if (currentQuestion.marked) {
        console.log("This question is already marked.");
        return;
    }

    const existingMarkedQuestion = document.querySelector(
        `.marked-question[data-question-index="${currentQuestionIndex}"]`
    );
    if (existingMarkedQuestion) {
        markedQuestions.removeChild(existingMarkedQuestion);
    }

    currentQuestion.marked = true;

    const markedQuestionElement = document.createElement("div");
    const questionText = document.createElement("p");
    const unmarkButton = document.createElement("button");
    unmarkButton.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;

    questionText.textContent = `Question ${currentQuestionIndex + 1}: ${
        currentQuestion.text
    }`;
    questionText.classList.add("marked-question");
    questionText.setAttribute("data-question-index", currentQuestionIndex);
    questionText.addEventListener("click", () => {
        displayMarkedQuestion(currentQuestionIndex);
    });

    numOfMarkedQuestion++;
    if (numOfMarkedQuestion === 1) markedQuestions.style.display = "block";


    unmarkButton.addEventListener("click", () => {
        numOfMarkedQuestion--;
        currentQuestion.marked = false;
        markedQuestions.removeChild(markedQuestionElement);
        if (!numOfMarkedQuestion) markedQuestions.style.display = "none";
    });

    markedQuestionElement.appendChild(questionText);
    markedQuestionElement.appendChild(unmarkButton);

    markedQuestions.appendChild(markedQuestionElement);
});

finishButton.addEventListener("click", () => {
    if (quiz.isCompleted()) finishQuiz();
    else {
        quiz.setCurrentQuestionIndex(quiz.getUnsolvedQuestionIndex());
        displayCurrentQuestion();
    }
});


function finishQuiz() {
    clearInterval(quizTimer);

    const score = quiz.calculateScore();
    sessionStorage.setItem("result", `${score} / ${quiz.questions.length}`);
    location.replace("../pages/result.html");

    // sessionStorage.setItem("quizCompleted", "true");
}

function displayMarkedQuestion(questionIndex) {
    quiz.setCurrentQuestionIndex(questionIndex);
    displayCurrentQuestion();
}

window.onload = function () {
    const quizCompleted = sessionStorage.getItem("quizCompleted");
    if (quizCompleted === "true") {
        finishQuiz();
        quizSection.style.display = "none";
        markedQuestions.style.display = "none";
    } else {
        shuffleQuestions();
        displayCurrentQuestion();
        startTimer();
    }
};

function shuffleQuestions() {
    for (let i = quiz.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quiz.questions[i], quiz.questions[j]] = [
            quiz.questions[j],
            quiz.questions[i],
        ];
    }
}

const question1 = new Question(
    "What is the capital of Argentina?",
    [
        new Answer("Buenos Aires", true),
        new Answer("London", false),
        new Answer("Berlin", false),
        new Answer("Cairo", false),
    ],
    0
);
quiz.addQuestion(question1);

const question2 = new Question(
    "Who wrote 'To Kill a Mockingbird'?",
    [
        new Answer("Harper Lee", true),
        new Answer("J.K. Rowling", false),
        new Answer("Charles Dickens", false),
        new Answer("Bruce Wayne", false),
    ],
    0
);
quiz.addQuestion(question2);

const question3 = new Question(
    "What is the largest planet in our solar system?",
    [
        new Answer("Earth", false),
        new Answer("Jupiter", true),
        new Answer("Mars", false),
        new Answer("Venus", false),
    ],
    1
);
quiz.addQuestion(question3);

const question4 = new Question(
    "What is the boiling point of water in Celsius?",
    [
        new Answer("0", false),
        new Answer("100", true),
        new Answer("50", false),
        new Answer("200", false),
    ],
    1
);
quiz.addQuestion(question4);

const question5 = new Question(
    "Which chemical element has the symbol 'P'?",
    [
        new Answer("Phosphorus", true),
        new Answer("Platinum", false),
        new Answer("Potassium", false),
        new Answer("Polymorphism", false),
    ],
    0
);
quiz.addQuestion(question5);

const question6 = new Question(
    "What is the speed of light?",
    [
        new Answer("300,000 km/s", true),
        new Answer("150,000 km/s", false),
        new Answer("450,000 km/s", false),
        new Answer("250,000 km/s", false),
    ],
    0
);
quiz.addQuestion(question6);

const question7 = new Question(
    "Who is known as the father of computers?",
    [
        new Answer("Charles Babbage", true),
        new Answer("Alan Turing", false),
        new Answer("John von Neumann", false),
        new Answer("Yann LeCun", false),
    ],
    0
);
quiz.addQuestion(question7);

const question8 = new Question(
    "What is the main ingredient in guacamole?",
    [
        new Answer("Avocado", true),
        new Answer("Tomato", false),
        new Answer("Onion", false),
        new Answer("Garlic", false),
    ],
    0
);
quiz.addQuestion(question8);

const question9 = new Question(
    "What is the powerhouse of the cell?",
    [
        new Answer("Mitochondria", true),
        new Answer("Nucleus", false),
        new Answer("Ribosome", false),
        new Answer("Atom", false),
    ],
    0
);
quiz.addQuestion(question9);

const question10 = new Question(
    "What is the capital of Japan?",
    [
        new Answer("Tokyo", true),
        new Answer("Kyoto", false),
        new Answer("Osaka", false),
        new Answer("Hiroshima", false),
    ],
    0
);
quiz.addQuestion(question10);

const question11 = new Question(
    "Who painted the Mona Lisa?",
    [
        new Answer("Leonardo da Vinci", true),
        new Answer("Vincent van Gogh", false),
        new Answer("Pablo Picasso", false),
        new Answer("Michelangelo", false),
    ],
    0
);
quiz.addQuestion(question11);

const question12 = new Question(
    "What is the smallest prime number?",
    [
        new Answer("2", true),
        new Answer("1", false),
        new Answer("3", false),
        new Answer("0", false),
    ],
    0
);
quiz.addQuestion(question12);

const question13 = new Question(
    "What planet is known as the Red Planet?",
    [
        new Answer("Mars", true),
        new Answer("Venus", false),
        new Answer("Jupiter", false),
        new Answer("Mercury", false),
    ],
    0
);
quiz.addQuestion(question13);

const question14 = new Question(
    "What is the largest ocean on Earth?",
    [
        new Answer("Pacific Ocean", true),
        new Answer("Atlantic Ocean", false),
        new Answer("Indian Ocean", false),
        new Answer("Arctic Ocean ", false),
    ],
    0
);
quiz.addQuestion(question14);

const question15 = new Question(
    "What is the hardest natural substance on Earth?",
    [
        new Answer("Diamond", true),
        new Answer("Gold", false),
        new Answer("Iron", false),
        new Answer("Copper", false),
    ],
    0
);
quiz.addQuestion(question15);
