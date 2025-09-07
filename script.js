let correctAnswer;
let attempts = 0;
let solvedCount = 0;

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
  attemptsEl.textContent = "";
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

    // Перемещаем решенный пример вниз
    const solvedExample = document.createElement("div");
    solvedExample.classList.add("solved-example");
    solvedExample.innerHTML = `${exampleEl.textContent} = ${correctAnswer} <span style="color:green">✔️</span>`;
    solvedContainer.appendChild(solvedExample);

    // Если были неудачные попытки
    if (attempts > 0) {
      const failNote = document.createElement("div");
      failNote.style.color = "#d9534f";
      failNote.textContent = `Невдалi спроби: ${attempts}`;
      solvedContainer.appendChild(failNote);
    }

    generateExample();
  } else {
    iconEl.textContent = "❌";
    iconEl.style.color = "red";
    attempts++;
    attemptsEl.textContent = `Невдалi спроби: ${attempts}`;
  }
});

generateExample();
