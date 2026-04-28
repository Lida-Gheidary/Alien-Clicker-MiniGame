// =====================
// Variables
// =====================
let score = 0;
let timeLeft = 60;
let gameStarted = false;
let gameEnded = false;
let playerName = "";
let interval = null;
let alienInterval = null;
const GAME_WIDTH = 550;
const GAME_HEIGHT = 280;

// =====================
// HTML DOM
// =====================
const startSection = document.getElementById("startSection");
const gameSection = document.getElementById("gameSection");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerDisplay = document.getElementById("timerDisplay");
const startMessage = document.getElementById("startMessage");
const scoreboardSection = document.getElementById("scoreboardSection");
const inputName = document.getElementById("inputName");
const buttonStart = document.getElementById("buttonStart");
const buttonPlayAgain = document.getElementById("buttonPlayAgain");
const startError = document.getElementById("startError");
const message = document.getElementById("message");
const scoreboardList = document.getElementById("scoreboard");
const alien1 = document.getElementById("alien1");
const alien2 = document.getElementById("alien2");
const alien3 = document.getElementById("alien3");
const popupOverlay = document.getElementById("popupOverlay");
const popupClose = document.getElementById("popupClose");

// =====================
// Functions
// =====================
function startGame() {
    playerName = inputName.value.trim();

    if (playerName.length < 3) {
        startError.innerText = "Please enter at least 3 characters!";
        return;
    }

    startSection.style.display = "none";
    gameSection.style.display = "block";
    buttonPlayAgain.style.display = "none";
    message.innerText = "";

    moveAliens();
    gameStarted = true;
    interval = setInterval(countdown, 1000);
    alienInterval = setInterval(moveAliens, 1200);
}

function countdown() {
    timeLeft--;
    timerDisplay.innerText = "Time: " + timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

function increaseScore() {
    score++;
    scoreDisplay.innerText = "Score: " + score;
}

function moveAlien(alien) {
    const randomX = Math.floor(Math.random() * GAME_WIDTH);
    const randomY = Math.floor(Math.random() * GAME_HEIGHT);
    alien.style.left = randomX + "px";
    alien.style.top = randomY + "px";
}

function moveAliens() {
    moveAlien(alien1);
    moveAlien(alien2);
    moveAlien(alien3);
}

function endGame() {
    gameEnded = true;
    clearInterval(interval);
    clearInterval(alienInterval);

    timerDisplay.innerText = "Time: 0";
    alien1.style.display = "none";
    alien2.style.display = "none";
    alien3.style.display = "none";
    startMessage.style.display = "none";

    message.innerText = "Game over, " + playerName + "! Your score: " + score + ". Submitting...";
    buttonPlayAgain.style.display = "inline-block";

    submitHighScore();
    getScoreboard();
}

async function submitHighScore() {
    try {
        const response = await fetch("https://hooks.zapier.com/hooks/catch/8338993/ujs9jj9/", {
            method: "POST",
            body: JSON.stringify({ name: playerName, score: score })
        });

        if (response.ok) {
            message.innerText = "Score submitted! Well done, " + playerName + "! Final score: " + score;
        } else {
            message.innerText = "Something went wrong submitting your score.";
        }
    } catch (error) {
        console.log(error);
        message.innerText = "Something went wrong submitting your score.";
    }
}

function getScoreboard() {
    const url = "https://script.google.com/macros/s/AKfycbys5aEPMvNCutyhNYYCcQcCjzsi2UtqNspmKyCH-AicJxJbCJMrAoT0LUaYaXhTWA8n/exec";

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            data.sort((a, b) => b.score - a.score);

            const top10 = data.slice(0, 10);

            scoreboardList.innerHTML = "";
            top10.forEach(function(player, index) {
                const li = document.createElement("li");
                li.innerText = (index + 1) + ". " + player.name + " - " + player.score;
                scoreboardList.appendChild(li);
            });

            popupOverlay.classList.add("active");
        })
        .catch(function(error) {
            console.log(error);
        });
}

function resetGame() {
    score = 0;
    timeLeft = 60;
    gameStarted = false;
    gameEnded = false;
    playerName = "";
    interval = null;
    alienInterval = null;

    scoreDisplay.innerText = "Score: 0";
    timerDisplay.innerText = "Time: 60";
    inputName.value = "";
    startError.innerText = "";
    message.innerText = "";

    alien1.style.display = "block";
    alien2.style.display = "block";
    alien3.style.display = "block";
    startMessage.style.display = "block";

    gameSection.style.display = "none";
    buttonPlayAgain.style.display = "none";
    startSection.style.display = "block";

    moveAliens();
}

// =====================
// Event Listeners
// =====================
buttonStart.addEventListener("click", startGame);
buttonPlayAgain.addEventListener("click", resetGame);
popupClose.addEventListener("click", function() {
    popupOverlay.classList.remove("active");
});

alien1.addEventListener("click", function() {
    if (!gameEnded) { increaseScore(); moveAlien(alien1); }
});
alien2.addEventListener("click", function() {
    if (!gameEnded) { increaseScore(); moveAlien(alien2); }
});
alien3.addEventListener("click", function() {
    if (!gameEnded) { increaseScore(); moveAlien(alien3); }
});

// =====================
// Program Sequence
// =====================
moveAliens();