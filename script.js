let firstNum, secondNum, operation, mistakes = 0;

function generateExample() {
  firstNum = Math.floor(Math.random() * 90) + 10; // двузначное
  secondNum = Math.floor(Math.random() * 9) + 1;  // однозначное
  operation = "-";
  document.getElementById("task").innerHTML = `
    ${firstNum} ${operation} ${secondNum} = 
    <input id="answer" type="number" style="width:60px">
  `;
}

document.getElementById("checkBtn").addEventListener("click", function () {
  const userAnswer = parseInt(document.getElementById("answer").value);
  const correct = eval(`${firstNum} ${operation} ${secondNum}`);
  if (isNaN(userAnswer)) return; // кнопка не работает если поле пустое
  if (userAnswer === correct) {
    alert("Правильно!");
  } else {
    mistakes++;
    document.getElementById("mistakes").textContent = "Помилки: " + mistakes;
    document.getElementById("answer").value = ""; // очищаем поле
  }
});

document.getElementById("splitBtn").addEventListener("click", function () {
  const splitContainer = document.getElementById("splitContainer");
  splitContainer.innerHTML = "";

  const inputContainer = document.createElement("div");
  inputContainer.style.marginTop = "10px";

  for (let i = 0; i < 3; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.style.width = "50px";
    input.style.marginBottom = "5px";
    inputContainer.appendChild(input);
    inputContainer.appendChild(document.createElement("br"));
  }

  const okBtn = document.createElement("button");
  okBtn.textContent = "Ок";
  okBtn.classList.add("btn", "btn-small", "btn-primary");

  okBtn.addEventListener("click", function () {
    const inputs = inputContainer.querySelectorAll("input");
    const numbers = Array.from(inputs)
      .map(input => parseInt(input.value))
      .filter(num => !isNaN(num));

    if (numbers.length >= 2) {
      const sum = numbers.reduce((a, b) => a + b, 0);

      if (sum === firstNum) {
        inputContainer.innerHTML = "";

        numbers.forEach(num => {
          const numContainer = document.createElement("div");
          numContainer.classList.add("row");

          const numSpan = document.createElement("span");
          numSpan.classList.add("highlighted");
          numSpan.textContent = num;

          const minusBtn = document.createElement("button");
          minusBtn.textContent = "-";
          minusBtn.classList.add("btn-small");

          minusBtn.addEventListener("click", function () {
            // при клике заменяем число на пример
            const exampleContainer = document.createElement("span");
            const input = document.createElement("input");
            input.type = "number";
            input.style.width = "50px";

            exampleContainer.textContent = `${num} - ${secondNum} = `;
            exampleContainer.appendChild(input);

            input.addEventListener("change", function () {
              const userAns = parseInt(input.value);
              const correctAns = num - secondNum;
              if (userAns === correctAns) {
                // заменяем весь блок на готовый решённый пример
                numContainer.innerHTML = `<span class="highlighted">${correctAns}</span>`;
              } else {
                input.classList.add("error");
              }
            });

            numContainer.innerHTML = ""; // очищаем блок
            numContainer.appendChild(exampleContainer);
          });

          numContainer.appendChild(numSpan);
          numContainer.appendChild(minusBtn);
          inputContainer.appendChild(numContainer);
        });
      } else {
        alert("Сума неправильна");
      }
    }
  });

  inputContainer.appendChild(okBtn);
  splitContainer.appendChild(inputContainer);
});

generateExample();
