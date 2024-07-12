import { Quiz, Question, Answer } from '../classes/classes.js';

const quiz = new Quiz();
const questionDisplay = document.getElementById("question");
const answersForm = document.getElementById("answers");
const markedQuestions = document.querySelector("aside");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const resultDisplay = document.getElementById("result");
const timerDisplay = document.getElementById("timer");
const main = document.getElementById("main");

const quizTimeLimit = 15 * 60 * 1000;
let quizTimer;

function startTimer() {
    const endTime = Date.now() + quizTimeLimit;

    quizTimer = setInterval(() => {
        const remainingTime = endTime - Date.now();
        if (remainingTime <= 0) {
            clearInterval(quizTimer);
            finishQuiz();
        } else {
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            timerDisplay.textContent = `Time : ${minutes}m ${seconds}s`;
        }
    }, 1000);
}

function displayCurrentQuestion() {
    const currentQuestion = quiz.getCurrentQuestion();
    const questionIndex = quiz.getCurrentQuestionIndex() + 1;
    questionDisplay.innerHTML = `Question ${questionIndex}: ${currentQuestion.text}<br><br>`;
    answersForm.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        const answerElement = document.createElement("label");
        const radioInput = document.createElement("input");
        answerElement.style.marginBottom = "10px";
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
        answersForm.appendChild(document.createElement("br"));
    });
}

const previousButton = document.querySelector(".previous");
const markButton = document.querySelector(".mark");
const nextButton = document.querySelector(".next");
const finishButton = document.querySelector(".finish");
const closeButton = document.querySelector(".close");

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

    const existingMarkedQuestion = document.querySelector(`.marked-question[data-question-index="${currentQuestionIndex}"]`);
    if (existingMarkedQuestion) {
        markedQuestions.removeChild(existingMarkedQuestion);
    }

    currentQuestion.marked = true;

    const markedQuestionElement = document.createElement("div");
    const questionText = document.createElement("p");
    const unmarkButton = document.createElement("button");

    questionText.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.text}`;
    questionText.classList.add("marked-question");
    questionText.setAttribute("data-question-index", currentQuestionIndex); 
    questionText.addEventListener("click", () => {
        displayMarkedQuestion(currentQuestionIndex);
    });

    unmarkButton.textContent = "Unmark";
    unmarkButton.classList.add("unmark");

    unmarkButton.addEventListener("click", () => {
        currentQuestion.marked = false;
        markedQuestions.removeChild(markedQuestionElement);
    });

    markedQuestionElement.appendChild(questionText);
    markedQuestionElement.appendChild(unmarkButton);

    markedQuestions.appendChild(markedQuestionElement);
});

finishButton.addEventListener("click", () => {
    finishQuiz();
});

closeButton.addEventListener("click", () => {
    window.close();
});

function finishQuiz() {
    clearInterval(quizTimer);

    const score = quiz.calculateScore();
    resultDisplay.textContent = `Your Result: ${score} / ${quiz.questions.length}`;

    sessionStorage.setItem('quizCompleted', 'true');

    main.querySelectorAll('section').forEach(section => {
        if (section.id !== 'result-section') {
            section.style.display = 'none';
            markedQuestions.style.display = 'none';
        }
    });

    resultSection.style.display = 'flex';

    const reloadMessage = document.createElement("p");
    reloadMessage.textContent = " you can't return to the quiz after finishing.";
    resultSection.appendChild(reloadMessage);
}

function displayMarkedQuestion(questionIndex) {
    quiz.setCurrentQuestionIndex(questionIndex);
    displayCurrentQuestion();
}

window.onload = function() {
    const quizCompleted = sessionStorage.getItem('quizCompleted');
    if (quizCompleted === 'true') {
        finishQuiz(),
        resultDisplay.textContent = "please close page";
        quizSection.style.display = 'none';
        resultSection.style.display = 'block';
        markedQuestions.style.display = 'none';
       
    } else {
        shuffleQuestions();
        displayCurrentQuestion();
        startTimer();
    }
};

function shuffleQuestions() {
    for (let i = quiz.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quiz.questions[i], quiz.questions[j]] = [quiz.questions[j], quiz.questions[i]];
    }
}



const question1 = new Question(
    "What is the capital of France?",
    [
        new Answer("Paris", true),
        new Answer("London", false),
        new Answer("Berlin", false)
    ],
    0
);
quiz.addQuestion(question1);

const question2 = new Question(
    "Who wrote 'To Kill a Mockingbird'?",
    [
        new Answer("Harper Lee", true),
        new Answer("J.K. Rowling", false),
        new Answer("Charles Dickens", false)
    ],
    0
);
quiz.addQuestion(question2);

const question3 = new Question(
    "What is the largest planet in our solar system?",
    [
        new Answer("Earth", false),
        new Answer("Jupiter", true),
        new Answer("Mars", false)
    ],
    1
);
quiz.addQuestion(question3);

const question4 = new Question(
    "What is the boiling point of water in Celsius?",
    [
        new Answer("0", false),
        new Answer("100", true),
        new Answer("50", false)
    ],
    1
);
quiz.addQuestion(question4);

const question5 = new Question(
    "Which chemical element has the symbol 'P'?",
    [
        new Answer("Phosphorus", true),
        new Answer("Platinum", false),
        new Answer("Potassium", false)
    ],
    0
);
quiz.addQuestion(question5);

const question6 = new Question(
    "What is the speed of light?",
    [
        new Answer("300,000 km/s", true),
        new Answer("150,000 km/s", false),
        new Answer("450,000 km/s", false)
    ],
    0
);
quiz.addQuestion(question6);

const question7 = new Question(
    "Who is known as the father of computers?",
    [
        new Answer("Charles Babbage", true),
        new Answer("Alan Turing", false),
        new Answer("John von Neumann", false)
    ],
    0
);
quiz.addQuestion(question7);

const question8 = new Question(
    "What is the main ingredient in guacamole?",
    [
        new Answer("Avocado", true),
        new Answer("Tomato", false),
        new Answer("Onion", false)
    ],
    0
);
quiz.addQuestion(question8);

const question9 = new Question(
    "What is the powerhouse of the cell?",
    [
        new Answer("Mitochondria", true),
        new Answer("Nucleus", false),
        new Answer("Ribosome", false)
    ],
    0
);
quiz.addQuestion(question9);

const question10 = new Question(
    "What is the capital of Japan?",
    [
        new Answer("Tokyo", true),
        new Answer("Kyoto", false),
        new Answer("Osaka", false)
    ],
    0
);
quiz.addQuestion(question10);

const question11 = new Question(
    "Who painted the Mona Lisa?",
    [
        new Answer("Leonardo da Vinci", true),
        new Answer("Vincent van Gogh", false),
        new Answer("Pablo Picasso", false)
    ],
    0
);
quiz.addQuestion(question11);

const question12 = new Question(
    "What is the smallest prime number?",
    [
        new Answer("2", true),
        new Answer("1", false),
        new Answer("3", false)
    ],
    0
);
quiz.addQuestion(question12);

const question13 = new Question(
    "What planet is known as the Red Planet?",
    [
        new Answer("Mars", true),
        new Answer("Venus", false),
        new Answer("Jupiter", false)
    ],
    0
);
quiz.addQuestion(question13);

const question14 = new Question(
    "What is the largest ocean on Earth?",
    [
        new Answer("Pacific Ocean", true),
        new Answer("Atlantic Ocean", false),
        new Answer("Indian Ocean", false)
    ],
    0
);
quiz.addQuestion(question14);

const question15 = new Question(
    "What is the hardest natural substance on Earth?",
    [
        new Answer("Diamond", true),
        new Answer("Gold", false),
        new Answer("Iron", false)
    ],
    0
);
quiz.addQuestion(question15);

