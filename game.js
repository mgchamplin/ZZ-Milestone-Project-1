const REMOVE_CARD = 0;
const TURN_DOWN = 1;
const TURN_UP = 2;
const NONE = -1;

let maxCards = 50;
let cardLocationToID = [100]
let cardChoiceAAAIndex = NONE;
let cardChoiceZZZIndex = NONE;
let tableReset = true;
let numMatches = 0;
let gameSecondCounter = 0;
let dealingInProgress = false;
let clockTimer = null;

/*
** function invoked from HTML on user click event "DEAL CARDS"
*/
function startGame() {

    if (!tableReset) {
        console.log("Restarting game");
        resetCards(true);
        //return;
    }

    tableReset = false;

    selectElement = document.querySelector('#card_selector');
    maxCards = Number(selectElement.value);
    cardLocationToID.length = maxCards;

    shuffle();

    dealCards(maxCards)
}

async function dealCards(max_cards) {
    if (maxCards === 0) return;

    updateTimer(0);

    console.log("Dealing start")
    dealingInProgress = true;


    for (let i=0; i < max_cards; i++) {
        let card = document.createElement("img");
        let card_id = cardLocationToID[i].id;
        //console.log("ID = " + card_id)

        let card_image = `assets/clubs-${card_id}.png`;

        card.src = "assets/card_back.jpg";
        card.id = `c${card_id}`
        card.className = `card card${card_id}`

        let card_num = Number(maxCards)

        switch(maxCards) {
            case 10:
                card.setAttribute("style","width:14%")
                break;
            case 20:
                card.setAttribute("style","width:12%")
                break;
            case 50:
            default:
                card.setAttribute("style","width:8%")
        }

        card.addEventListener("click",function() {cardClicked(i)})

        let div_container = document.getElementById("card_group")

        await sleep(50);
        div_container.appendChild(card);

        cardLocationToID[i].element = card;
        cardLocationToID[i].img     = card_image;
    }
    if (!tableReset) launchNextSecondTimer();

    console.log("Dealing done")
    dealingInProgress = false;

}

function updateTimer(totalSeconds) {
    timer_element = document.getElementById("timer")

    let minutes = Math.floor(totalSeconds/60);
    let seconds = totalSeconds - 60*minutes;

    let seconds_tens = Math.floor(seconds / 10)
    let seconds_ones = seconds - 10*seconds_tens;

    timer_element.innerHTML = `&nbsp Timer: 0${minutes}:${seconds_tens}${seconds_ones}`
}

function launchNextSecondTimer() {
    console.log("Set Timer - TableRset = " + tableReset + " clockTimer = " + clockTimer)

    if (tableReset) return;

    gameSecondCounter++;
    
    updateTimer(gameSecondCounter);

    clockTimer = setTimeout(()=>{launchNextSecondTimer()}, 1000); 
}

function resetCards (reset_timer) {
    if (tableReset || dealingInProgress) {
        console.log("WAIT PLEASE - clockTimer=" + clockTimer + " TableReset=" + tableReset)
        return;

        updateTimer(0)
        tableReset = true;
        if (clockTimer) {
            console.log("Clearing timer")
            clearTimeout(clockTimer);
        }
    }
    console.log("Clearing a total of " + maxCards)
    for (let i=0; i < maxCards; i++) {  console.log("clear " + i)
        if (cardLocationToID[i].element != null) {
            cardLocationToID[i].element.remove();
            cardLocationToID[i] = null;
        }
    }
    cardChoiceAAAIndex  = NONE;
    cardChoiceZZZIndex = NONE;

    tableReset = true;
    numMatches = 0;
    gameSecondCounter = 0;
}

function checkForMatch(arrayIndex) {
   
    if (cardLocationToID[cardChoiceAAAIndex].element.id === cardLocationToID[cardChoiceZZZIndex].element.id) {
        console.log("MATCH!")
        changeCardImage(cardChoiceAAAIndex, REMOVE_CARD);
        changeCardImage(cardChoiceZZZIndex, REMOVE_CARD);
        cardChoiceAAAIndex = NONE;
        cardChoiceZZZIndex = NONE;

        numMatches++;

        let audio = new Audio('./assets/MatchMade.wav');
        audio.volume = 0.5;
        audio.play();
    }
}

function changeCardImage(card, action) {

    switch(action) {
        case REMOVE_CARD:
            cardLocationToID[card].element.src = '';
            break;
        case TURN_DOWN:
            cardLocationToID[card].element.src = "assets/card_back.jpg";
            console.log("TURN DOWN  " + cardLocationToID[card].element.id);
            break;
        case TURN_UP:
            cardLocationToID[card].element.src = cardLocationToID[card].img;
            console.log("TURN UP  " + cardLocationToID[card].element.id);
            break;
        default:
            console.log("You screwed up")
            break;
    }
}

function cardClicked(arrayIndex) {

    if (cardChoiceAAAIndex === NONE) {

        if (cardChoiceZZZIndex === NONE) {          // No cards chosen before this, make this card AAA, ZZZ is still NONE
            cardChoiceAAAIndex = arrayIndex;

            changeCardImage(cardChoiceAAAIndex, TURN_UP);
        } else {                                    // One card is chosen already ZZZ->was.  Make this AAA, check 4 match
            if (arrayIndex !== cardChoiceZZZIndex){ // Make sure the card wasn't already face up
                cardChoiceAAAIndex = arrayIndex;

                changeCardImage(cardChoiceAAAIndex, TURN_UP);
    
                checkForMatch(cardChoiceAAAIndex)
            } else {                                // Same card - Card was face up.  Now we just turn it down
                changeCardImage(cardChoiceZZZIndex, TURN_DOWN);
                cardChoiceZZZIndex = NONE;
            }
        }
        if (cardChoiceAAAIndex !== NONE) console.log("Selected Card = " + cardLocationToID[cardChoiceAAAIndex].element.id);

    }
    else if (cardChoiceZZZIndex === NONE) {         // One card is chosen already AAA->was.  Make this ZZZ, check 4 match
        if (cardChoiceAAAIndex != arrayIndex) {     // Make sure it doesn't already match a card facing up
            cardChoiceZZZIndex = arrayIndex;

            console.log("Selected Card = " + cardLocationToID[cardChoiceZZZIndex].element.id);

            changeCardImage(cardChoiceZZZIndex, TURN_UP);

            checkForMatch(cardChoiceZZZIndex)
        } else {                                    // The new selected card matches an up-facing AAA card.  So turn it down
            changeCardImage(cardChoiceAAAIndex, TURN_DOWN);
            cardChoiceAAAIndex = NONE;
        }
    }
    else {                                                  // Two cards already chosen.  
            if (arrayIndex === cardChoiceAAAIndex){         // if AAA was clicked when already face up, clear it
                changeCardImage(cardChoiceAAAIndex, TURN_DOWN);
                cardChoiceAAAIndex = NONE;

            } else if (arrayIndex === cardChoiceZZZIndex){  // ELSE IF ZZZ was clicked when already face up, clear it
                changeCardImage(cardChoiceZZZIndex, TURN_DOWN);
                cardChoiceZZZIndex = NONE;
            } else {                                         // ELSE neither click, so clear both old cards
                changeCardImage(cardChoiceAAAIndex, TURN_DOWN);
                changeCardImage(cardChoiceZZZIndex, TURN_DOWN);
                cardChoiceAAAIndex = arrayIndex;             // New card becomes AAA with ZZZ empty
                cardChoiceZZZIndex = NONE;

                changeCardImage(cardChoiceAAAIndex, TURN_UP);
            }
    }

    if (numMatches === (maxCards/2))
        resetCards(false);
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
}

function sleep(time){
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })  
}

