// js/script.js

const NOMBRE_QUESTIONS = 10;

let indexQuestion = 0;
let score = 0;
let quizSelection = [];

let playerName = "";
let niveau = "";

function melangerTableau(tab) {
  for (let i = tab.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tab[i], tab[j]] = [tab[j], tab[i]];
  }
}

function afficherQuestion() {
  const q = quizSelection[indexQuestion];

  document.getElementById("question").textContent = q.question;
  document.getElementById("reponses").innerHTML = "";
  document.getElementById("feedback").textContent = "";

  let progression = ((indexQuestion + 1) / quizSelection.length) * 100;
  document.getElementById("progress").style.width = progression + "%";

  let choixMelanges = q.choix.map((choix, idx) => ({
    texte: choix,
    correct: idx === q.bonneReponse
  }));
  melangerTableau(choixMelanges);

  choixMelanges.forEach((choixObj, idx) => {
    const button = document.createElement("button");
    button.textContent = choixObj.texte;
    button.addEventListener("click", () => verifierReponse(idx, choixMelanges));
    document.getElementById("reponses").appendChild(button);
  });
}

function verifierReponse(indexChoisi, choixMelanges) {
  const buttons = document.querySelectorAll("#reponses button");
  buttons.forEach((btn, idx) => {
    btn.disabled = true;
    if (choixMelanges[idx].correct) btn.classList.add("correct");
    else if (idx === indexChoisi) btn.classList.add("wrong");
  });

  if (choixMelanges[indexChoisi].correct) score++;
  
  document.getElementById("feedback").textContent = choixMelanges[indexChoisi].correct
    ? "✅ Bonne réponse !"
    : "❌ Mauvaise réponse !";

  setTimeout(() => {
    indexQuestion++;
    if (indexQuestion < quizSelection.length) afficherQuestion();
    else afficherScore();
  }, 1200);
}

function afficherScore() {
  sauvegarderScore();

  document.getElementById("question").textContent = "🎉 Quiz terminé !";
  document.getElementById("reponses").innerHTML = "";
  document.getElementById("progress").style.width = "100%";

  document.getElementById("score").textContent =
    `Score : ${score} / ${quizSelection.length}`;

  document.getElementById("recommencerBtn").style.display = "block";

  afficherClassement();
}

function afficherQuiz() {
  indexQuestion = 0;
  score = 0;

  melangerTableau(quiz);
  quizSelection = quiz.slice(0, Math.min(NOMBRE_QUESTIONS, quiz.length));

  document.getElementById("score").textContent = "";
  document.getElementById("recommencerBtn").style.display = "none";

  afficherQuestion();
}

function startQuiz() {
  playerName = document.getElementById("playerName").value.trim();
  niveau = document.getElementById("niveau").value;

  if (!playerName) {
    alert("Veuillez entrer un nom !");
    return;
  }

  document.getElementById("menu").style.display = "none";
  document.querySelector(".container").style.display = "block";

  afficherQuiz();
}

function retourMenu() {
  document.querySelector(".container").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function sauvegarderScore() {
  const classement = JSON.parse(localStorage.getItem("classement")) || [];

  classement.push({
    nom: playerName,
    score: score,
    niveau: niveau,
    date: new Date().toISOString()
  });

  localStorage.setItem("classement", JSON.stringify(classement));
}

function obtenirTop10(niveauChoisi) {
  const classement = JSON.parse(localStorage.getItem("classement")) || [];

  return classement
    .filter(joueur => joueur.niveau === niveauChoisi)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function afficherClassement() {
  const top10 = obtenirTop10(niveau);

  const container = document.getElementById("classement");
  container.innerHTML = "<h3>🏆 Classement</h3>";

  top10.forEach((joueur, index) => {
    const div = document.createElement("div");
    div.textContent = `${index + 1}. ${joueur.nom} - ${joueur.score}`;
    container.appendChild(div);
  });
}

// Listeners
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("startQuizBtn").addEventListener("click", startQuiz);
    document.getElementById("recommencerBtn").addEventListener("click", afficherQuiz);
    document.getElementById("menuBtn").addEventListener("click", retourMenu);
});
