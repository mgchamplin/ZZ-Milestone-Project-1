const REMOVE_CARD = 0;
const TURN_DOWN = 1;
const TURN_UP = 2;
const NONE = -1;

let maxCards = 50;
let cardLocationToID = [100]
let cardChoiceAAAIndex = NONE;
let cardChoiceZZZIndex = NONE;


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

function changeCardImage(card, action) {

    switch(action) {
        case REMOVE_CARD:
            cardLocationToID[card].element.src = '';
            break;
        case TURN_DOWN:
            cardLocationToID[card].element.src = "assets/card_back.jpg";
            break;
        case TURN_UP:
            cardLocationToID[card].element.src = cardLocationToID[card].img;
            break;
        default:
            console.log("You screwed up")
            break;
    }
}

function clearOutCards(max_cards) {
    console.log("Clearing a total of " + max_cards)
    for (let i=0; i < max_cards; i++) {  console.log("clear " + i)
        cardLocationToID[i].element.remove();
        cardLocationToID[i] = null;
    }
    firstCardIndex  = NONE;
    SecondCardIndex = NONE;
}

function checkForMatch(arrayIndex) {
   
    if (cardLocationToID[cardChoiceAAAIndex].element.id === cardLocationToID[cardChoiceZZZIndex].element.id) {
        console.log("MATCH!")
        changeCardImage(cardChoiceAAAIndex, REMOVE_CARD);
        changeCardImage(cardChoiceZZZIndex, REMOVE_CARD);
        cardChoiceAAAIndex = NONE;
        cardChoiceZZZIndex = NONE;
    }
    else {
        console.log("WTF")
    }
}

function cardClicked(arrayIndex) {

    if (cardChoiceAAAIndex === NONE) {

        if (cardChoiceZZZIndex === NONE) {          // No cards chosen before this, make this card AAA, ZZZ is NONE
            cardChoiceAAAIndex = arrayIndex;

            changeCardImage(cardChoiceAAAIndex, TURN_UP);
        } else {                                    // One card is chosen already ZZZ->was.  Make this AAA, check 4 match
            cardChoiceAAAIndex = arrayIndex;

            changeCardImage(cardChoiceAAAIndex, TURN_UP);

            checkForMatch(arrayIndex)
        }
        console.log("Selected Card = " + cardLocationToID[cardChoiceAAAIndex].element.id);

    }
    else if (cardChoiceZZZIndex === NONE) {         // One card is chosen already AAA->was.  Make this ZZZ, check 4 match
        cardChoiceZZZIndex = arrayIndex;

        console.log("Selected Card = " + cardLocationToID[cardChoiceZZZIndex].element.id);

        changeCardImage(cardChoiceZZZIndex, TURN_UP);

        checkForMatch(arrayIndex)
    }
    else {                                          // Two cards already chosen.  Flip those and keep this one
            changeCardImage(cardChoiceAAAIndex, TURN_DOWN);
            changeCardImage(cardChoiceZZZIndex, TURN_DOWN);
            cardChoiceAAAIndex = arrayIndex;
            cardChoiceZZZIndex = NONE;

            changeCardImage(cardChoiceAAAIndex, TURN_UP);
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
