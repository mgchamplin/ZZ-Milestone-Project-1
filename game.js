console.log("Hello")

let card_img1 = document.getElementById("c1")
let card_img2 = document.getElementById("c2")

for (let i=1; i <= 13; i++) {
    let card = document.createElement("img");
    card.src = `assets/clubs-${i}.png`;
    card.id = `c${i}`
    card.className = `card card${i}`

    let left_justify = 2 + 6*(i-1);
    card.setAttribute('style',`left: ${left_justify}em`)
    card.addEventListener("click",sayHello)

    let div_container = document.getElementById("game_board")
    div_container.appendChild(card); 
}





function setImg(card) {
    document.getElementById(card).src = '';
}

function sayHello() {
    console.log("HIHI")
}

//background-color: rgb(15, 150, 26);

/*
<img id="c1" class="card1" src="assets/clubs-01-ace.png"
                onclick="sayHello()">
            <img id="c2" class="card2" src="assets/clubs-02-two.png">
*/
