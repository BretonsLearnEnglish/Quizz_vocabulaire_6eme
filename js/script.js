const NOMBRE_QUESTIONS = 10;

if (typeof quiz === "undefined") {
  console.error("Le quiz n'est pas chargé !");
}

let indexQuestion = 0;
let score = 0;


function melangerTableau(tab){
  for(let i = tab.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [tab[i], tab[j]] = [tab[j], tab[i]];
  }
}

melangerTableau(quiz);
let quizSelection = quiz.slice(0, NOMBRE_QUESTIONS);

function afficherQuestion() {
  const q = quizSelection[indexQuestion];

  document.getElementById("question").textContent = q.question;
  document.getElementById("reponses").innerHTML = "";
  document.getElementById("feedback").textContent = "";

  // 📊 progression
  let progression = ((indexQuestion + 1) / quizSelection.length) * 100;
  document.getElementById("progress").style.width = progression + "%";

  let choixMelanges = q.choix.map((choix, index) => ({
    texte: choix,
    correct: index === q.bonneReponse
  }));

  melangerTableau(choixMelanges);

  choixMelanges.forEach((choixObj, index) => {
    const button = document.createElement("button");
    button.textContent = choixObj.texte;

    button.addEventListener("click", () => {
      verifierReponse(index, choixMelanges);
    });

    document.getElementById("reponses").appendChild(button);
  });
}

function verifierReponse(indexChoisi, choixMelanges) {
  const buttons = document.querySelectorAll("#reponses button");

  buttons.forEach((btn, index) => {
    btn.disabled = true;

    if (choixMelanges[index].correct) {
      btn.classList.add("correct");
    } else if (index === indexChoisi) {
      btn.classList.add("wrong");
    }
  });

  if (choixMelanges[indexChoisi].correct) {
    score++;
    document.getElementById("feedback").textContent = "✅ Bonne réponse !";
  } else {
    document.getElementById("feedback").textContent = "❌ Mauvaise réponse !";
  }

  setTimeout(() => {
    indexQuestion++;

    if (indexQuestion < quizSelection.length) {
      afficherQuiz();
    } else {
      afficherScore();
    }
  }, 1200);
}

function afficherScore() {
  document.getElementById("question").textContent = "🎉 Quiz terminé !";
  document.getElementById("reponses").innerHTML = "";

  document.getElementById("progress").style.width = "100%";

  document.getElementById("score").textContent =
    "Score : " + score + " / " + quizSelection.length;

  document.getElementById("recommencerBtn").style.display = "block";
}

function afficherQuiz() {
  indexQuestion = 0;
  score = 0;

  melangerTableau(quiz);
  quizSelection = quiz.slice(0, Math.min(NOMBRE_QUESTIONS, quiz.length));

  document.getElementById("score").textContent = "";
  document.getElementById("recommencerBtn").style.display = "none";

  afficherQuizz();
}

document
.getElementById("recommencerBtn")
.addEventListener("click", afficherQuiz);

afficherQuestion();


