let correctAnswer;
let attempts = 0;
let solvedCount = 0;
let totalErrors = 0;

let firstNum, secondNum;
let currentOperation = "-";

const exampleEl = document.getElementById("example");
const answerEl = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const splitBtn = document.getElementById("splitBtn");
const iconEl = document.getElementById("icon");
const attemptsEl = document.getElementById("attempts");
const solvedContainer = document.getElementById("solvedContainer");
const splitArea = document.getElementById("splitArea");

// ---- Генерация примера ----
function generateExample() {
  currentOperation = CONFIG.operations && CONFIG.operations.length
    ? CONFIG.operations[Math.floor(Math.random() * CONFIG.operations.length)]
    : "-";

  let firstRules = CONFIG.digits.filter(r => r.startsWith("1=")).map(r => parseInt(r.split("=")[1]));
  let secondRules = CONFIG.digits.filter(r => r.startsWith("2=")).map(r => parseInt(r.split("=")[1]));

  if (!firstRules.length) firstRules = [2];
  if (!secondRules.length) secondRules = [2];

  const firstDigits = firstRules[Math.floor(Math.random() * firstRules.length)];
  const secondDigits = secondRules[Math.floor(Math.random() * secondRules.length)];

  firstNum = generateNumber(firstDigits);
  secondNum = generateNumber(secondDigits);

  if (isNaN(firstNum) || isNaN(secondNum)) {
    firstNum = 10;
    secondNum = 3;
  }

  if (CONFIG.order === "1>2" && firstNum <= secondNum) {
    firstNum = secondNum + Math.floor(Math.random() * 9 + 1);
  } else if (CONFIG.order === "1<2" && firstNum >= secondNum) {
    secondNum = firstNum + Math.floor(Math.random() * 9 + 1);
  }

  switch (currentOperation) {
    case "+": correctAnswer = firstNum + secondNum; break;
    case "-": correctAnswer = firstNum - secondNum; break;
    case "*": correctAnswer = firstNum * secondNum; break;
    case "/":
      correctAnswer = Math.floor(firstNum / secondNum);
      firstNum = correctAnswer * secondNum;
      break;
    default:
      correctAnswer = firstNum - secondNum;
      currentOperation = "-";
  }

  if (correctAnswer > CONFIG.maxResult || correctAnswer < 0) {
    return generateExample();
  }

  exampleEl.textContent = `${firstNum} ${currentOperation} ${secondNum}`;
  answerEl.value = "";
  iconEl.textContent = "";
  attemptsEl.textContent = `Помилки: 0`;
  attempts = 0;
  splitArea.innerHTML = "";
}

// ---- Утилиты ----
function generateNumber(d) {
  if (d <= 0) return 0;
  const min = Math.pow(10, d - 1);
  const max = Math.pow(10, d) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---- Проверка основного ответа ----
checkBtn.addEventListener("click", () => {
  const userAnswer = answerEl.value.trim();
  if (userAnswer === "") return;

  if (Number(userAnswer) === correctAnswer) {
    solvedCount++;
    iconEl.textContent = "✔️";
    iconEl.style.color = "green";

    let solvedCounter = document.getElementById("solvedCounter");
    if (!solvedCounter) {
      solvedCounter = document.createElement("div");
      solvedCounter.id = "solvedCounter";
      solvedCounter.textContent = `Вирішено прикладів: ${solvedCount}`;
      solvedContainer.prepend(solvedCounter);
    } else {
      solvedCounter.textContent = `Вирішено прикладів: ${solvedCount}`;
    }

    let totalErrorsEl = do
