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
  // Выбираем операцию
  const operation = CONFIG.operations[Math.floor(Math.random() * CONFIG.operations.length)];

  // Собираем все варианты для каждого числа
  let firstRules = CONFIG.digits.filter(r => r.startsWith("1=")).map(r => parseInt(r.split("=")[1]));
  let secondRules = CONFIG.digits.filter(r => r.startsWith("2=")).map(r => parseInt(r.split("=")[1]));

  // Если в конфиге не указано — по умолчанию двузначные
  if (firstRules.length === 0) firstRules = [2];
  if (secondRules.length === 0) secondRules = [2];

  // Случайно выбираем количество цифр для каждого числа
  const firstDigits = firstRules[Math.floor(Math.random() * firstRules.length)];
  const secondDigits = secondRules[Math.floor(Math.random() * secondRules.length)];

  // Генерируем числа
  let firstNumber = generateNumber(firstDigits);
  let secondNumber = generateNumber(secondDigits);

  // Применяем правило старшинства
  if (CONFIG.order === "1>2" && firstNumber <= secondNumber) {
    firstNumber = secondNumber + Math.floor(Math.random() * 9 + 1);
  } else if (CONFIG.order === "1<2" && firstNumber >= secondNumber) {
    secondNumber = firstNumber + Math.floor(Math.random() * 9 + 1);
  }

  // Вычисляем правильный ответ
  switch (operation) {
    case "+": correctAnswer = firstNumber + secondNumber; break;
    case "-": correctAnswer = firstNumber - secondNumber; break;
    case "*": correctAnswer = firstNumber * secondNumber; break;
    case "/":
      // чтобы делилось без остатка
      correctAnswer = Math.floor(firstNumber / secondNumber);
      firstNumber = correctAnswer * secondNumber;
      break;
  }

  // Ограничение результата
  if (correctAnswer > CONFIG.maxResult || correctAnswer < 0) {
    return generateExample(); // пробуем снова
  }

  // Отображаем пример
  exampleEl.textContent = `${firstNumber} ${operation} ${secondNumber}`;
  answerEl.value = "";
  iconEl.textContent = "";
  attemptsEl.textContent = `Помилки: 0`;
  attempts = 0;
}

// Генерация числа по количеству цифр
function generateNumber(digits) {
  if (digits <= 0) return 0;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Проверка ответа
checkBtn.addEventListener("click", () => {
  const userAnswer = answerEl.value.trim();
  if (userAnswer === "") return; // запрет пустого ответа

  if (Number(userAnswer) === correctAnswer) {
    solvedCount++;
    iconEl.textContent = "✔️";
    iconEl.style.color = "green";

    // Счётчик решённых
    let solvedCounter = document.getElementById("solvedCounter");
    if (!solvedCounter) {
      solvedCounter = document.createElement("div");
      solvedCounter.id = "solvedCounter";
      solvedCounter.textContent = `Вирішено прикладів: ${solvedCount}`;
      solvedContainer.prepend(solvedCounter);
    } else {
      solvedCounter.textContent = `Вирішено прикладів: ${solvedCount}`;
    }

    // Счётчик всех ошибок
    let totalErrorsEl = document.getElementById("totalErrors");
    if (!totalErrorsEl) {
      totalErrorsEl = document.createElement("div");
      totalErrorsEl.id = "totalErrors";
      totalErrorsEl.className = "total-errors";
      solvedCounter.insertAdjacentElement("afterend", totalErrorsEl);
    }
    totalErrorsEl.textContent = `Всього помилок: ${totalErrors}`;

    // Перемещаем решённый пример вниз
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

    // Если достигли лимита N — показать код
    if (solvedCount === CONFIG.N) {
      const codeMsg = document.createElement("div");
      codeMsg.className = "code-msg";
      codeMsg.style.marginTop = "15px";
      codeMsg.style.fontSize = "18px";
      codeMsg.style.fontWeight = "bold";
      codeMsg.style.color = "#007bff";
      codeMsg.textContent = `Ваш код: ${CONFIG.K}`;
      solvedContainer.appendChild(codeMsg);
    }

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

// Первая генерация
generateExample();
