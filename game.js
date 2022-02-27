let maxCards = 50;
let cardLocationToID = [100]
let activeCardIndex = null;

function dealCards(max_cards) {
    console.log("Deal it")
    for (let i=0; i < max_cards; i++) {
        let card = document.createElement("img");
        let card_id = cardLocationToID[i].id;
        console.log("ID = " + card_id)

        let card_image = `assets/clubs-${card_id}.png`;

        card.src = "assets/card_back.jpg";
        card.id = `c${card_id}`
        card.className = `card card${card_id}`

        card.addEventListener("click",function() {cardClicked(i)})

        let div_container = document.getElementById("card_group")
        div_container.appendChild(card); 

        cardLocationToID[i].element = card;
        cardLocationToID[i].img     = card_image;
    }
}

function disappearCard(card_num) {
    document.getElementById(`c${card_num}`).style.opacity = 0;
}

function resetCards () {
    clearOutCards(maxCards)
}

function clearOutCards(max_cards) {
    console.log("Clearing a total of " + max_cards)
    for (let i=0; i < max_cards; i++) {  console.log("clear " + i)
        cardLocationToID[i].element.remove();
        cardLocationToID[i] = null;
    }
    activeCardIndex = null;
}

function cardClicked(card) {
    cardLocationToID[card].element.src = cardLocationToID[card].img;


    if (activeCardIndex) {
        console.log("Curr Card = " + cardLocationToID[card].element.id + " Prev Card = " + cardLocationToID[activeCardIndex].element.id);

        if (cardLocationToID[card].element.id === cardLocationToID[activeCardIndex].element.id)
            console.log("MATCH!")
        activeCardIndex = null;
    } else {
        activeCardIndex = card;
    }
}

function dealOutCards() {
    selectElement = document.querySelector('#card_selector');
    maxCards = selectElement.value;
    cardLocationToID.length = maxCards;

    shuffle();

    dealCards(maxCards)
}

function shuffleArray() {
    for (let i = 0; i < cardLocationToID.length; i++) {
        let card = null;
        let img = null;
        let card_object = {element:card, image:img, id: Math.floor(i/2)+1}

        cardLocationToID[i] = card_object;
    }
    for (let i = cardLocationToID.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cardLocationToID[i];
        cardLocationToID[i] = cardLocationToID[j];
        cardLocationToID[j] = temp;
    }
}

function shuffle() {
    console.log("Shuffle")
    shuffleArray()
    console.log("Shuffled:")
    for (let i=0; i < cardLocationToID.length; i++) {
        console.log("New Location for " + i + " is " + cardLocationToID[i].id)
        //cardLocationToID[i].element.src = cardLocationToID[i].element.image;
    }
}
