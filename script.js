// DOM Elements
const loveItems = ["❤️","💖","💋","💌","🌹"];
const brokenItems = ["💔","😭","🥀"];

const home = document.getElementById("home");
const game = document.getElementById("game");
const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");
const homeBtn = document.getElementById("homeBtn");

let score = 0;
let gameOver = false;
let gameInterval;
let playerX = 190;
const playerY = 500;

// CHARACTER SELECTION
function selectPlayer(type){
  player.textContent = type === "male" ? "👨" : "👩";
  startBtn.disabled = false;

  // REMOVE previous selection glow
  document.querySelectorAll('.choices button').forEach(btn=>{
    btn.classList.remove('selected');
  });

  // ADD glow to selected button
  const selectedBtn = type === "male" 
    ? document.querySelector('.choices button:nth-child(1)')
    : document.querySelector('.choices button:nth-child(2)');
  selectedBtn.classList.add('selected');
}


// START GAME
function startGame(){
  home.classList.add("hidden");
  game.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");

  score = 0;
  gameOver = false;
  playerX = (gameArea.offsetWidth - player.offsetWidth)/2;
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  scoreDisplay.textContent = "Score: 0";

  document.querySelectorAll(".item").forEach(i=>i.remove());
  clearInterval(gameInterval);

  gameInterval = setInterval(createItem, 700);
}

// CREATE FALLING ITEMS
function createItem(){
  if(gameOver) return;

  const item = document.createElement("div");
  item.classList.add("item");

  const isBroken = Math.random() < 0.3;
  item.dataset.type = isBroken ? "broken" : "love";
  item.textContent = isBroken
    ? brokenItems[Math.floor(Math.random()*brokenItems.length)]
    : loveItems[Math.floor(Math.random()*loveItems.length)];

  const posX = Math.random()*(gameArea.offsetWidth-30);
  item.style.left = posX+"px";
  let y = -50;
  item.style.top = y+"px";
  gameArea.appendChild(item);

  const fall = setInterval(()=>{
    if(gameOver){ clearInterval(fall); item.remove(); return; }

    y+=4;
    item.style.top = y+"px";

    const itemLeft = posX;
    const itemRight = itemLeft + 30;
    const playerLeft = playerX;
    const playerRight = playerX + player.offsetWidth;

    if(y + 30 >= playerY && itemRight > playerLeft && itemLeft < playerRight){
      if(isBroken){ 
        endGame(); // trigger game over
      } else { 
        score++; 
        scoreDisplay.textContent = "Score: " + score; 
      }
      clearInterval(fall);
      item.remove();
    }

    if(y > gameArea.offsetHeight){ clearInterval(fall); item.remove(); }
  },20);
}

// END GAME
function endGame(){
  gameOver = true;
  clearInterval(gameInterval);
  finalScore.textContent = score;
  game.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}

// PLAYER CONTROL
document.addEventListener("keydown", e=>{
  if(gameOver) return;
  if(e.key==="ArrowLeft" && playerX>0) playerX-=25;
  if(e.key==="ArrowRight" && playerX<gameArea.offsetWidth-player.offsetWidth) playerX+=25;
  player.style.left = playerX+"px";
});

gameArea.addEventListener("mousemove", e=>{
  if(gameOver) return;
  const rect = gameArea.getBoundingClientRect();
  let x = e.clientX - rect.left - player.offsetWidth/2;
  x = Math.max(0,Math.min(x,gameArea.offsetWidth-player.offsetWidth));
  playerX = x;
  player.style.left = playerX+"px";
});

// BUTTONS
startBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);
homeBtn.addEventListener("click", ()=>{
  gameOverScreen.classList.add("hidden");
  home.classList.remove("hidden");
});
