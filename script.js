let correctAnswer;
let attempts = 0;
let solvedCount = 0;
let totalErrors = 0;

const exampleEl = document.getElementById("example");
const answerEl = document.getElementById("answer");
const checkBtn = document.getElementById("checkBtn");
const iconEl = document.getElementById("icon");
const attemptsEl = document.getElementById("attempts");
const solvedContainer = document.getElementById("solvedContainer");

function generateExample() {
  let a = Math.floor(Math.random() * 90) + 10;
  let b = Math.floor(Math.random() * 90) + 10;
  let bigger = Math.max(a, b);
  let smaller = Math.min(a, b);
  correctAnswer = bigger - smaller;
  exampleEl.textContent = `${bigger} - ${smaller}`;
  answerEl.value = "";
  iconEl.textContent = "";
  attemptsEl.textContent = `Помилки: 0`;
  attempts = 0;
}

checkBtn.addEventListener("click", () => {
  const userAnswer = Number(answerEl.value);
  if (userAnswer === correctAnswer) {
    solvedCount++;
    iconEl.textContent = "✔️";
    iconEl.style.color = "green";

    // Добавляем счетчик решенных
    let solvedCounter = document.getElementById("solvedCounter");
    if (!solvedCounter) {
      solvedCounter = document.createElement("div");
      solvedCounter.id = "solvedCounter";
      solvedCounter.textContent = `Вирішено прикладів: ${solvedCount}`;
      solvedContainer.prepend(solvedCounter);
    } else {
      solvedCounter.textContent = `Вирішено прикладів: ${solvedCount}`;
    }

    // Добавляем счетчик всех ошибок
    let totalErrorsEl = document.getElementById("totalErrors");
    if (!totalErrorsEl) {
      totalErrorsEl = document.createElement("div");
      totalErrorsEl.id = "totalErrors";
      totalErrorsEl.className = "total-errors";
      solvedCounter.insertAdjacentElement("afterend", totalErrorsEl);
    }
    totalErrorsEl.textContent = `Всього помилок: ${totalErrors}`;

    // Перемещаем решенный пример вниз
    const solvedExample = document.createElement("div");
    solvedExample.classList.add("solved-example");

    let text = `${exampleEl.textContent} = ${correctAnswer}`;
    let greenIcon = `<span class="icon-green">✔️</span>`;
    if (attempts > 0) {
      text += `${greenIcon}<span style="color:#d9534f">(Помилки: ${attempts})</span>`;
    } else {
      text += greenIcon;
    }

    solvedExample.innerHTML = text;
    solvedContainer.appendChild(solvedExample);

    generateExample();
  } else {
    iconEl.textContent = "❌";
    iconEl.style.color = "red";
    attempts++;
    totalErrors++;
    attemptsEl.textContent = `Помилки: ${attempts}`;
    answerEl.value = ""; // очищаем поле
    answerEl.focus();
  }
});

generateExample();
