console.log("Hello")

let card_img1 = document.getElementById("c1")
let card_img2 = document.getElementById("c2")
let maxCards = 50;

function dealCards(max_cards, face_up) {
    for (let i=1; i <= max_cards; i++) {
        let card = document.createElement("img");
        card.src = `assets/clubs-${i}.png`;
        card.id = `c${i}`
        card.className = `card card${i}`

        if (!face_up) card.src ="assets/card_back.jpg"

        card.addEventListener("click",function() {sayHello(card.id)})

        let div_container = document.getElementById("card_group")
        div_container.appendChild(card); 
    }
}
function setOpacity (num) {
    var s= document.getElementById("c2").style;
    s.opacity = ( num / 100 );
}


function disappearCard(card_num) {
    document.getElementById(`c${card_num}`).style.opacity = 0;
}

function resetCards () {
    clearOutCards(maxCards)
}

function clearOutCards(max_cards) {
    for (let i=1; i <= max_cards; i++) {  console.log("clear " + i)
        document.getElementById(`c${i}`).remove();
    }
}

function setImg(card) { 
    document.getElementById(card).src = '';
}

function sayHello(cardId) {
    console.log("HIHI " + cardId)
}

function dealOutCards() {
    selectElement = document.querySelector('#card_selector');
    console.log("Selected " + selectElement.value);
    maxCards = selectElement.value;
    dealCards(selectElement.value,1)
}