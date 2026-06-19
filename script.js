const game = document.getElementById("game");
const score = document.getElementById("score");
const result = document.getElementById("result");
const restart = document.getElementById("restart");

const images = [
    "card1.png",
    "card2.png",
    "card3.png",
    "card4.png",
    "card5.png",
    "card6.png"
];

let firstCard = null;
let secondCard = null;
let lock = false;
let pairs = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createBoard() {

    game.innerHTML = "";
    result.classList.add("hidden");

    pairs = 0;
    score.textContent = "0";

    firstCard = null;
    secondCard = null;
    lock = false;

    const cards = shuffle([...images, ...images]);

    cards.forEach(image => {

        const card = document.createElement("div");
        card.className = "card";

        card.dataset.image = image;
        card.dataset.open = "false";
        card.dataset.clear = "false";

        const back = document.createElement("div");
        back.className = "back";
        back.textContent = "?";

        card.appendChild(back);

        card.addEventListener("click", () => clickCard(card));

        game.appendChild(card);

    });

}

function clickCard(card){

    if(lock) return;

    if(card.dataset.open==="true") return;

    if(card.dataset.clear==="true") return;

    openCard(card);

    if(firstCard===null){

        firstCard=card;
        return;

    }

    secondCard=card;

    lock=true;

    if(firstCard.dataset.image===secondCard.dataset.image){

        firstCard.dataset.clear="true";
        secondCard.dataset.clear="true";

        pairs++;

        score.textContent=pairs;

        firstCard=null;
        secondCard=null;

        lock=false;

        if(pairs===6){

            result.classList.remove("hidden");

        }

    }else{

        setTimeout(()=>{

            closeCard(firstCard);
            closeCard(secondCard);

            firstCard=null;
            secondCard=null;

            lock=false;

        },1000);

    }

}

function openCard(card){

    card.dataset.open="true";

    card.innerHTML="";

    const img=document.createElement("img");

    img.src="images/"+card.dataset.image;

    card.appendChild(img);

}

function closeCard(card){

    card.dataset.open="false";

    card.innerHTML="";

    const back=document.createElement("div");

    back.className="back";

    back.textContent="?";

    card.appendChild(back);

}

restart.addEventListener("click",createBoard);

createBoard();