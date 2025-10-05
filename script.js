let correctAnswer;
let attempts = 0;
let solvedCount = 0;
let totalErrors = 0;

let firstNum, secondNum; // текущие числа примера
let currentOperation = "-"; // пока используем вычитание для разложения

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
  // Берём операцию (по умолчанию поддерживаем '-')
  currentOperation = CONFIG.operations && CONFIG.operations.length ? CONFIG.operations[Math.floor(Math.random() * CONFIG.operations.length)] : "-";

  // Собираем правила digits
  let firstRules = CONFIG.digits.filter(r => r.startsWith("1=")).map(r => parseInt(r.split("=")[1]));
  let secondRules = CONFIG.digits.filter(r => r.startsWith("2=")).map(r => parseInt(r.split("=")[1]));

  if (firstRules.length === 0) firstRules = [2];
  if (secondRules.length === 0) secondRules = [2];

  const firstDigits = firstRules[Math.floor(Math.random() * firstRules.length)];
  const secondDigits = secondRules[Math.floor(Math.random() * secondRules.length)];

  firstNum = generateNumber(firstDigits);
  secondNum = generateNumber(secondDigits);

  // Применяем старшинство
  if (CONFIG.order === "1>2" && firstNum <= secondNum) {
    firstNum = secondNum + Math.floor(Math.random() * 9 + 1);
  } else if (CONFIG.order === "1<2" && firstNum >= secondNum) {
    secondNum = firstNum + Math.floor(Math.random() * 9 + 1);
  }

  // Вычисляем правильный ответ (операция может быть разная, но разложение логично только для вычитания)
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

  // Ограничение результата
  if (correctAnswer > CONFIG.maxResult || correctAnswer < 0) {
    return generateExample();
  }

  // Показываем пример (для разложения важно, чтобы это был вычитальный пример)
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

    let totalErrorsEl = document.getElementById("totalErrors");
    if (!totalErrorsEl) {
      totalErrorsEl = document.createElement("div");
      totalErrorsEl.id = "totalErrors";
      totalErrorsEl.className = "total-errors";
      solvedCounter.insertAdjacentElement("afterend", totalErrorsEl);
    }
    totalErrorsEl.textContent = `Всього помилок: ${totalErrors}`;

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
    answerEl.value = "";
    answerEl.focus();
  }
});

// ---- Разложение (split) ----
splitBtn.addEventListener("click", () => {
  // Разложение релевантно только для вычитания — если операция не "-", показываем предупреждение и выходим
  if (currentOperation !== "-") {
    splitArea.innerHTML = `<div style="color:#d9534f; margin-top:8px;">Розклад доступний лише для прикладів віднімання.</div>`;
    return;
  }

  splitArea.innerHTML = "";

  const inputWrap = document.createElement("div");
  inputWrap.id = "splitInputs";

  for (let i = 0; i < 3; i++) {
    const inp = document.createElement("input");
    inp.type = "number";
    inp.className = "split-input";
    inp.min = 0;
    inp.inputMode = "numeric";
    inp.pattern = "\\d*";
    inputWrap.appendChild(inp);
  }

  const okBtn = document.createElement("button");
  okBtn.textContent = "Ок";
  okBtn.className = "btn secondary";
  okBtn.style.width = "auto";
  okBtn.style.padding = "6px 15px";
  okBtn.style.marginTop = "10px";

  splitArea.appendChild(inputWrap);
  splitArea.appendChild(okBtn);

  okBtn.addEventListener("click", () => {
    const inputs = Array.from(inputWrap.querySelectorAll("input"))
      .map(i => i.value.trim())
      .filter(v => v !== "")
      .map(Number)
      .filter(n => !isNaN(n) && n >= 0);

    if (inputs.length < 2) {
      // мало чисел — ничего не делаем
      return;
    }

    const sum = inputs.reduce((a, b) => a + b, 0);

    splitArea.innerHTML = ""; // очищаем поля ввода

    const resultDiv = document.createElement("div");
    resultDiv.className = "split-result";

    if (sum === firstNum) {
      // Успешное разложение — показываем каждое число в строке с иконкой минус
      inputs.forEach(num => {
        const line = document.createElement("div");
        line.className = "split-number";

        // span с самим числом (оставляем отдельный span, чтобы позже выделять его стилем)
        const numberSpan = document.createElement("span");
        numberSpan.className = "split-number-value";
        numberSpan.textContent = num;

        // минус-иконка
        const minusIcon = document.createElement("span");
        minusIcon.className = "split-minus";
        minusIcon.textContent = "−";
        minusIcon.title = "Показати приклад";
        minusIcon.style.userSelect = "none";

        line.appendChild(numberSpan);
        line.appendChild(minusIcon);
        resultDiv.appendChild(line);

        // Обработчик клика по минусу — создаём под-пример (num - secondNum = input)
        minusIcon.addEventListener("click", () => {
          // Если под-пример уже есть (следующий sibling) — ничего не создаём повторно
          if (line.nextElementSibling && line.nextElementSibling.classList.contains("split-example")) {
            return;
          }

          const exampleDiv = document.createElement("div");
          exampleDiv.className = "split-example";

          // Текст и поле ввода для ответа
          const textNode = document.createTextNode(`${num} - ${secondNum} = `);
          const smallInput = document.createElement("input");
          smallInput.type = "number";
          smallInput.className = "split-input";
          smallInput.style.width = "70px";
          smallInput.inputMode = "numeric";
          smallInput.pattern = "\\d*";

          const iconSpan = document.createElement("span");
          iconSpan.style.marginLeft = "8px";

          exampleDiv.appendChild(textNode);
          exampleDiv.appendChild(smallInput);
          exampleDiv.appendChild(iconSpan);

          // Вставляем exampleDiv ПОСЛЕ текущей строки line
          line.parentNode.insertBefore(exampleDiv, line.nextSibling);

          // Проверка маленького ответа (по событию change — можно использовать Enter/потерю фокуса)
          smallInput.addEventListener("change", () => {
            const user = smallInput.value.trim();
            if (user === "") return;

            const needed = num - secondNum;
            if (Number(user) === needed) {
  // Создаём готовую строку-решение и заменяем оригинальную строку (line)
  const solvedLine = document.createElement("div");
  solvedLine.className = "split-number";
  solvedLine.innerHTML = `${num} - ${secondNum} = <span class="solved-value">${needed}</span>`;

  // Заменяем элемент line на solvedLine — это убирает лишнее число
  if (line && line.parentNode) {
    line.parentNode.replaceChild(solvedLine, line);
  }

  // Удаляем вставленный exampleDiv (он больше не нужен)
  if (exampleDiv && exampleDiv.parentNode) {
    exampleDiv.parentNode.removeChild(exampleDiv);
  }

  // Подсветим остальные числа-разложения, если нужно
  const allNumberSpans = resultDiv.querySelectorAll(".split-number-value");
  allNumberSpans.forEach(s => {
    if (!s.classList.contains("solved-applied")) {
      s.classList.add("solved-applied");
      s.classList.add("solved-value");
    }
  });

  // Убираем доступ к минусу (если он ещё виден)
  minusIcon.style.visibility = "hidden";
} else {
  iconSpan.textContent = "❌";
  iconSpan.style.color = "red";
}

          });
        });
      });
    } else {
      // Некорректная сумма — показываем крестик
      resultDiv.innerHTML = `<span style="color:red;font-size:18px;">❌</span>`;
    }

    splitArea.appendChild(resultDiv);
  });
});

// ---- Инициализация ----
generateExample();
