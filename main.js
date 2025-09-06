// get elements for showing the questions
let category = document.querySelector(".quiz-app .category span");
let count = document.querySelector(".question-count span");
let answerArea = document.querySelector(".quiz-app .answer-area");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let bullets = document.querySelector(".quiz-app .bullets");
let spanContainer = document.querySelector(".bullets .spans-cont");
let submitButton = document.querySelector(".quiz-app .submit-button");
let result = document.querySelector(".quiz-app .result");
let countDownElement = document.querySelector(".quiz-app .count-down");
let categories = document.querySelector(".quiz-app .categories");
let audio = document.querySelector(".bullets .audio");

// set variables
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let fileName = "";

// fetch number of questions
function getQuestions(fileName) {
  if (fileName) {
    let myRequest = new XMLHttpRequest();
    myRequest.open("Get", fileName, true);
    myRequest.send();

    myRequest.onreadystatechange = function (file) {
      if (this.readyState === 4 && this.status === 200) {
        let questions = JSON.parse(this.responseText);

        // make mixing for question
        questions = questions.sort(() => 0.5 - Math.random());
        // take first 10 questions
        questions = questions.slice(0, 10);

        let qCount = questions.length;

        // call function of create bullets
        createBullets(qCount);

        // add questions
        addQuestionData(questions[currentIndex], qCount);

        // handle count down
        countDown(60, qCount);

        // submit answer
        submitButton.onclick = () => {
          // get the right answer
          let rightAnswer = questions[currentIndex].right_answer;

          // increase index
          currentIndex++;

          // play music
          audio.play();
          // check if the answer right
          checkAnswer(rightAnswer, qCount);

          // remove pervious question
          quizArea.innerHTML = "";
          answerArea.innerHTML = "";
          // add the next question
          addQuestionData(questions[currentIndex], qCount);

          // handle bullets
          handleBullets();

          //start new count down
          clearInterval(countDownInterval);
          countDown(60, qCount);

          // show results function
          showResults(qCount);
        };
      }
    };
  }
}

getQuestions();

function createBullets(num) {
  // show num of the questions
  count.innerHTML = num;

  // create spans for bullets
  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");

    // but the class "on" on span
    if (i === 0) {
      span.className = "on";
    }

    spanContainer.append(span);
  }
}

// add question to page
function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create H2 questions title
    let title = document.createElement("h2");
    // crete the title text
    let questionText = document.createTextNode(obj["title"]);

    // append the elements
    quizArea.append(title);
    // add data to title
    title.appendChild(questionText);

    // get answers to shuffle them
    let answers = [
      obj["answer_1"],
      obj["answer_2"],
      obj["answer_3"],
      obj["answer_4"],
    ];

    // shuffle the answers
    answers = answers.sort(() => Math.random() - 0.5);

    for (let i = 0; i < answers.length; i++) {
      // create answer div
      let answerDiv = document.createElement("div");
      //create answer input
      let answerInput = document.createElement("input");
      // create label for answer input
      let answerLabel = document.createElement("label");
      // create label text
      let labelText = document.createTextNode(answers[i]);

      // set Attribute
      answerDiv.className = "answer";
      answerInput.type = "Radio";
      answerInput.id = `answer_${i + 1}`;
      answerInput.name = "questions";
      answerInput.dataset.answer = answers[i];
      answerLabel.htmlFor = `answer_${i + 1}`;
      // append the elements
      answerDiv.append(answerInput);
      answerDiv.append(answerLabel);
      answerArea.appendChild(answerDiv);
      // add data to answers
      answerLabel.append(labelText);

      // make first answer checked
      if (i === 0) {
        answerInput.checked = true;
      }
    }
  } else {
    submitButton.disabled = true;
  }
}
// check if the answer is right
function checkAnswer(rAnswer, count) {
  if (currentIndex < count) {
    // get the chosen answer
    let chosenAnswer = document.querySelector(
      ".answer-area .answer input:checked"
    ).dataset.answer;

    // increase the num of right answers
    if (rAnswer === chosenAnswer) {
      rightAnswers++;
    }
  }
}

// handle bullets to be dynamic with the questions
function handleBullets() {
  // get the spans of bullets
  let bullets = document.querySelectorAll(".bullets .spans-cont span");

  //add the class on to the current question
  for (let i = 0; i < bullets.length; i++) {
    if (i === currentIndex) {
      bullets[i].className = "on";
    }
  }
}

// show results in page
function showResults(count) {
  let theResults = document.querySelector(".results");
  if (currentIndex === count) {
    theResults.style = "display: block";
    quizArea.remove();
    answerArea.remove();
    bullets.remove();
    submitButton.remove();

    if (rightAnswers === count) {
      // if answers is all rights
      theResults.innerHTML =
        "<span class='perfect' >perfect:</span>all answers are correct";
    } else if (rightAnswers > count / 2 && rightAnswers < count) {
      // if right answers is more than the half of questions
      theResults.innerHTML = `<span class = 'good'>good:</span>you answered ${rightAnswers} from ${count}`;
    } else if (rightAnswers < count / 2) {
      // if right answers is less than the half of questions
      theResults.innerHTML = `<span class = 'bad'>bad:</span>you answered ${rightAnswers} from ${count}`;
    }
  }
}

// handle count down
function countDown(duration, count) {
  if (currentIndex < count) {
    // set a var for min and sec
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      // get the value of min and sec
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      // make min and sec two num
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      // append min and sec in div
      countDownElement.innerHTML = `${minutes}:${seconds}`;

      // stop the timer when reach zero
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

// handel categories
function loadCategory(category) {
  if (category === "html") {
    fileName = getQuestions("html-questions.json");
    category.innerHTML = "HTML";
  } else if (category === "css") {
    fileName = getQuestions("css-questions.json");
    category.innerHTML = "CSS";
  } else if (category === "js") {
    fileName = getQuestions("js-questions.json");
    category.innerHTML === "JS";
  }

  // make the categories dippers
  categories.style.display = "none";

  //display the game
  quizArea.style.display = "block";
  answerArea.style.display = "block";
  submitButton.style.display = "block";
  bullets.style.display = "flex";
  getQuestions(fileName);
}

// handle click on category button
document.querySelector(".html").addEventListener("click", function () {
  loadCategory("html");
  category.innerHTML = "HTML";
});
document.querySelector(".css").addEventListener("click", function () {
  loadCategory("css");
  category.innerHTML = "CSS";
});
document.querySelector(".js").addEventListener("click", function () {
  loadCategory("js");
  category.innerHTML = "JS";
});
