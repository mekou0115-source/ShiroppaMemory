const images = [
    "card1.png",
    "card2.png",
    "card3.png",
    "card4.png",
    "card5.png",
    "card6.png",
    "card7.png",
    "card8.png"
];

const titleScreen = document.getElementById("titleScreen");
const howScreen = document.getElementById("howScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const startButton = document.getElementById("startButton");
const howButton = document.getElementById("howButton");

const backTitle1 = document.getElementById("backTitle1");
const backTitle2 = document.getElementById("backTitle2");
const backTitle3 = document.getElementById("backTitle3");

const restartButton = document.getElementById("restart");
const playAgainButton = document.getElementById("playAgain");

const game = document.getElementById("game");

const scoreDisplay = document.getElementById("score");
const triesDisplay = document.getElementById("tries");
const timerDisplay = document.getElementById("timer");

const finalTime = document.getElementById("finalTime");
const finalTry = document.getElementById("finalTry");

const rankDisplay = document.getElementById("rank");
const bestTimeDisplay = document.getElementById("bestTime");
const bestTryDisplay = document.getElementById("bestTry");

const bgm = document.getElementById("bgm");
const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;
let tries = 0;

let timer = 0;
let timerInterval = null;

function showScreen(screen){

    titleScreen.classList.add("hidden");
    howScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");

    screen.classList.remove("hidden");
}

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];
    }

    return array;
}

function formatTime(seconds){

    const min=Math.floor(seconds/60);
    const sec=seconds%60;

    return (
        String(min).padStart(2,"0") +
        ":" +
        String(sec).padStart(2,"0")
    );
}

function startTimer(){

    clearInterval(timerInterval);

    timer=0;

    timerDisplay.textContent="00:00";

    timerInterval=setInterval(()=>{

        timer++;

        timerDisplay.textContent=formatTime(timer);

    },1000);
}

function stopTimer(){

    clearInterval(timerInterval);
}

function createBoard(){

    game.innerHTML="";

    const deck=[...images,...images];

    shuffle(deck);

    cards=[];

    deck.forEach(imageName=>{

        const card=document.createElement("div");

        card.className="card";

        card.dataset.image=imageName;

        card.innerHTML=`
            <div class="back">?</div>
        `;

        card.addEventListener("click",flipCard);

        game.appendChild(card);

        cards.push(card);

    });
}

function flipCard(){

    if(lockBoard) return;

    if(this===firstCard) return;

    if(this.classList.contains("matched")) return;

    flipSound.currentTime = 0;
    flipSound.play();

    this.classList.add("flip");

    const imageName=this.dataset.image;

    this.innerHTML=`
        <img src="images/${imageName}">
    `;

    if(!firstCard){

        firstCard=this;

        return;
    }

    secondCard=this;

    lockBoard=true;

    tries++;

    triesDisplay.textContent=tries;

    checkMatch();
}

function checkMatch(){

    const isMatch =
        firstCard.dataset.image ===
        secondCard.dataset.image;

    if(isMatch){

        matchSound.currentTime = 0;
        matchSound.play();

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;

        scoreDisplay.textContent = matchedPairs;

        resetTurn();

        if(matchedPairs === 8){

            setTimeout(()=>{

                finishGame();

            },600);
        }

    }else{

        setTimeout(()=>{

            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");

            firstCard.innerHTML =
                '<div class="back">?</div>';

            secondCard.innerHTML =
                '<div class="back">?</div>';

            resetTurn();

        },1000);
    }
}

function resetTurn(){

    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function getRank(){

    if(tries <= 15){
        return "S";
    }

    if(tries <= 20){
        return "A";
    }

    if(tries <= 25){
        return "B";
    }

    return "C";
}

function updateBestRecord(){

    let bestTime =
        localStorage.getItem("bestTime");

    let bestTry =
        localStorage.getItem("bestTry");

    if(
        bestTime === null ||
        timer < Number(bestTime)
    ){
        localStorage.setItem(
            "bestTime",
            timer
        );

        bestTime = timer;
    }

    if(
        bestTry === null ||
        tries < Number(bestTry)
    ){
        localStorage.setItem(
            "bestTry",
            tries
        );

        bestTry = tries;
    }

    bestTimeDisplay.textContent =
        formatTime(Number(bestTime));

    bestTryDisplay.textContent =
        bestTry + "回";
}

function finishGame(){

    stopTimer();

    const rank = getRank();

    rankDisplay.textContent = rank + "ランク";

    rankDisplay.className = "";

    if(rank === "S"){
        rankDisplay.classList.add("rankS");
    }
    else if(rank === "A"){
        rankDisplay.classList.add("rankA");
    }
    else if(rank === "B"){
        rankDisplay.classList.add("rankB");
    }
    else{
        rankDisplay.classList.add("rankC");
    }

    finalTime.textContent =
        formatTime(timer);

    finalTry.textContent =
        tries + "回";

    updateBestRecord();

    bgm.pause();

    showScreen(resultScreen);
}

function startGame(){

    matchedPairs = 0;
    tries = 0;

    scoreDisplay.textContent = "0";
    triesDisplay.textContent = "0";

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    createBoard();

    startTimer();

    bgm.currentTime = 0;

    bgm.play().catch(()=>{});

    showScreen(gameScreen);
}

startButton.addEventListener("click",()=>{

    startGame();

});

howButton.addEventListener("click",()=>{

    showScreen(howScreen);

});

backTitle1.addEventListener("click",()=>{

    showScreen(titleScreen);

});

backTitle2.addEventListener("click",()=>{

    stopTimer();

    bgm.pause();

    showScreen(titleScreen);

});

backTitle3.addEventListener("click",()=>{

    showScreen(titleScreen);

});

restartButton.addEventListener("click",()=>{

    startGame();

});

playAgainButton.addEventListener("click",()=>{

    startGame();

});

const savedBestTime =
    localStorage.getItem("bestTime");

const savedBestTry =
    localStorage.getItem("bestTry");

if(savedBestTime){

    bestTimeDisplay.textContent =
        formatTime(Number(savedBestTime));

}else{

    bestTimeDisplay.textContent =
        "--:--";
}

if(savedBestTry){

    bestTryDisplay.textContent =
        savedBestTry + "回";

}else{

    bestTryDisplay.textContent =
        "--";
}

showScreen(titleScreen);