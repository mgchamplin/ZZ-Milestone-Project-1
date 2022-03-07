class soundButton {

    constructor(image, class_name) {
        this.sound_button               = document.createElement("img");
        this.sound_button.src           = "./assets/SoundOn.jpg";
        this.sound_button.className     = "sound_button_class";
        this.sound_button.style.opacity = 0.7;
        this.sound_on                   = true;
    }

    toggleSound() {
        if (this.sound_on)
            this.sound_button.src = "./assets/SoundOff.jpg";
        else
            this.sound_button.src = "./assets/SoundOn.jpg";
    
        this.sound_on = !this.sound_on;
    
        console.log(" sound_on = " + this.sound_on + " src = " + this.sound_button.src);
    }

    playMatchSound () {
        if (this.sound_on) {
            let audio = new Audio('./assets/MatchMade.wav');
            audio.volume = 0.5;
            audio.play();
        }
    }

    playApplause() {
        if (this.sound_on) {
            let audio = new Audio('./assets/CrowdApplause.wav');
            audio.volume = 0.5;
            audio.play();
        }
    }
}

class ControlPanel {
    constructor() {
        this.game_second_counter = 0;
        this.best18Score = 0;
        this.best30Score = 0;
        this.best50Score = 0;
        this.clockTimer = null;

    }

    updateTimerDisplay(totalSeconds) {
        let timer_element = document.getElementById("timer")
    
        let minutes = Math.floor(totalSeconds/60);
        let seconds = totalSeconds - 60*minutes;
    
        let seconds_tens = Math.floor(seconds / 10)
        let seconds_ones = seconds - 10*seconds_tens;
    
        timer_element.innerHTML = `&nbspTimer: 0${minutes}:${seconds_tens}${seconds_ones}`
    }

    launchNextSecondTimer() {

        if (Cards.IsReset()) return;        // Haven't started yet
    
        this.game_second_counter++;
        
        ControlPanelFunctions.updateTimerDisplay(this.game_second_counter);
    
        this.clockTimer  = setTimeout(()=>{this.launchNextSecondTimer()}, 1000); 
    }

    clearTimer() {
        window.clearTimeout(this.clockTimer);
    }

    logUserMessage(message_str) {
        let message_box = document.getElementById("status_bar");
        message_box.innerHTML = message_str;
    }

    ClearGameCounter () {
        this.game_second_counter = 0;
    }

    DisplayBestScore(bestScore, isStill) {
        let minutes = Math.floor(this.game_second_counter/60);
        let seconds = this.game_second_counter - 60*minutes;
        let baseMsg = "AWESOME JOB! <br> Your "

        if (minutes === 0)
            this.logUserMessage(baseMsg + `${Cards.GetMaxCards()}-card best time is${isStill}:<br> ${bestScore} seconds.`)
        else
            this.logUserMessage(baseMsg + `${Cards.GetMaxCards()}-card best time is${isStill}:<br> ${minutes} minutes and ${seconds} seconds`)
    }

    UpdateTopScore() {
    
        switch(Cards.GetMaxCards()) {
            case 18:
                if ((this.best18Score === 0 ) || (this.game_second_counter < this.best18Score)) {
                    this.best18Score = this.game_second_counter;
                    this.DisplayBestScore(this.game_second_counter, "");
                }
                else {
                    this.DisplayBestScore(this.best18Score, " still");
                }
                break;
            case 30:
                if ((this.best30Score === 0 ) || (this.game_second_counter < this.best30Score)) {
                    this.best30Score = this.game_second_counter;  
                    this.DisplayBestScore(this.game_second_counter, "");
                }       
                else {
                    this.DisplayBestScore(this.best30Score, " still");
                }
                break;
            case 50:
                if ((this.best50Score === 0 ) || (this.game_second_counter < this.best50Score)) {
                    this.best50Score = this.game_second_counter;
                    this.DisplayBestScore(this.game_second_counter, "");
                }
                else {
                    this.DisplayBestScore(this.best50Score, " still");
                }
                break;
            default:
                console.log("Something is wrong")
        }
    }
}


function sleep(time){
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })  
}

class CardsClass {

    constructor() {
        this.REMOVE_CARD    = 0;
        this.TURN_DOWN      = 1;
        this.TURN_UP        = 2;
        this.numMatches     = 0;
        this.NONE           = -1;
        this.isReset        = true;
        this.maxCards       = 50;
        this.cardAAAIndex   = this.NONE;
        this.cardZZZIndex   = this.NONE;  
        this.dealingInProgress = false;
        this.cardLocationToID = new Array();
    }

    IsReset() {
        return(this.isReset)
    }

    SetReset(doReset) {
        this.isReset = doReset;
    }

    SetMaxCards(max_cards) {
        this.maxCards = max_cards;
        this.cardLocationToID.length = max_cards;
    }

    GetMaxCards() {
        return(this.maxCards);
    }

    IsDealingInProgress() {
        return(this.dealingInProgress)
    }

    async Deal(max_cards) {
        if (this.maxCards === 0) {
            ControlPanelFunctions.logUserMessage("Please select number of cards")
            return;
        }

        ControlPanelFunctions.updateTimerDisplay(0);

        console.log("Dealing start")
        this.dealingInProgress = true;

        for (let i=0; i < max_cards; i++) {
            let card = document.createElement("img");
            let card_id = this.cardLocationToID[i].id;

            card.src = "assets/card_back_blue.jfif";    // Display card face down
            card.id = `c${card_id}`
            card.className = `card card${card_id}`;

            switch(this.maxCards) {
                case 18:
                    card.setAttribute("style","width:14%")
                    break;
                case 30:
                    card.setAttribute("style","width:10%")
                    break;
                case 50:
                default:
                    card.setAttribute("style","width:8%")
            }
            /*
            ** Add a listener for each card to process the card click
            */
            card.addEventListener("click",function() {Cards.CardClicked(i)})

            let div_container = document.getElementById("card_group")

            await sleep(25);
            div_container.appendChild(card);

            this.cardLocationToID[i].element = card;
            this.cardLocationToID[i].img     = `assets/clubs-${card_id}.png`;
        }
        if (!Cards.IsReset()) ControlPanelFunctions.launchNextSecondTimer();

        console.log("Dealing done")
        this.dealingInProgress = false;
    }

    Reset() {

        ControlPanelFunctions.clearTimer()

        console.log("Clearing a total of " + this.maxCards)
        for (let i=0; i < this.maxCards; i++) {  
            console.log("clear " + i)
            if (this.cardLocationToID[i].element != null) {
                this.cardLocationToID[i].element.remove();
                this.cardLocationToID[i] = null;
            }
        }
        this.cardAAAIndex = this.NONE;
        this.cardZZZIndex = this.NONE;

        Cards.SetReset(true);
        this.numMatches = 0;
        ControlPanelFunctions.ClearGameCounter();
    }

    CheckForMatch(arrayIndex) {
    
        if (this.cardLocationToID[this.cardAAAIndex].element.id === this.cardLocationToID[this.cardZZZIndex].element.id) {
            console.log("MATCH!")
            Cards.ChangeCardImage(this.cardAAAIndex, this.REMOVE_CARD);
            Cards.ChangeCardImage(this.cardZZZIndex, this.REMOVE_CARD);
            this.cardAAAIndex = this.NONE;
            this.cardZZZIndex = this.NONE;

            this.numMatches++;

            SoundControlButton.playMatchSound()
        }
    }

    ChangeCardImage(card, action) {

        switch(action) {
            case this.REMOVE_CARD:
                this.cardLocationToID[card].element.style.opacity = 0.1;
                this.cardLocationToID[card].id = 0;
                break;
            case this.TURN_DOWN:
                this.cardLocationToID[card].element.src = "assets/card_back_blue.jfif";
                console.log("TURN DOWN  " + this.cardLocationToID[card].element.id);
                break;
            case this.TURN_UP:
                this.cardLocationToID[card].element.src = this.cardLocationToID[card].img;
                console.log("TURN UP  " + this.cardLocationToID[card].element.id);
                break;
            default:
                console.log("You screwed up")
                break;
        }
    }

    CardClicked(arrayIndex) {

        console.log("card " + arrayIndex + " id = " + this.cardLocationToID[arrayIndex].id)
        if (this.cardLocationToID[arrayIndex].id === 0) return;

        if (this.cardAAAIndex === this.NONE) {

            if (this.cardZZZIndex === this.NONE) {                  // No cards chosen before this, make this card AAA, ZZZ is still NONE
                this.cardAAAIndex = arrayIndex;

                Cards.ChangeCardImage(this.cardAAAIndex, this.TURN_UP);
            } else {                                                // One card is chosen already ZZZ->was.  Make this AAA, check 4 match
                if (arrayIndex !== this.cardZZZIndex){              // Make sure the card wasn't already face up
                    this.cardAAAIndex = arrayIndex;

                    Cards.ChangeCardImage(this.cardAAAIndex, this.TURN_UP);
        
                    Cards.CheckForMatch(this.cardAAAIndex)
                } else {                                            // Same card - Card was face up.  Now we just turn it down
                    Cards.ChangeCardImage(this.cardZZZIndex, this.TURN_DOWN);
                    this.cardZZZIndex = this.NONE;
                }
            }
        }
        else if (this.cardZZZIndex === this.NONE) {                 // One card is chosen already AAA->was.  Make this ZZZ, check 4 match
            if (this.cardAAAIndex != arrayIndex) {                  // Make sure it doesn't already match a card facing up
                this.cardZZZIndex = arrayIndex;

                Cards.ChangeCardImage(this.cardZZZIndex, this.TURN_UP);

                Cards.CheckForMatch(this.cardZZZIndex)
            } else {                                                // The new selected card matches an up-facing AAA card.  So turn it down
                Cards.ChangeCardImage(this.cardAAAIndex, this.TURN_DOWN);
                this.cardAAAIndex = this.NONE;
            }
        }
        else {                                                      // Two cards already chosen.  
                if (arrayIndex === this.cardAAAIndex){              // if AAA was clicked when already face up, clear it
                    Cards.ChangeCardImage(this.cardAAAIndex, this.TURN_DOWN);
                    this.cardAAAIndex = this.NONE;

                } else if (arrayIndex === this.cardZZZIndex){       // ELSE IF ZZZ was clicked when already face up, clear it
                    Cards.ChangeCardImage(this.cardZZZIndex, this.TURN_DOWN);
                    this.cardZZZIndex = this.NONE;
                } else {                                            // ELSE neither click, so clear both old cards
                    Cards.ChangeCardImage(this.cardAAAIndex, this.TURN_DOWN);
                    Cards.ChangeCardImage(this.cardZZZIndex, this.TURN_DOWN);
                    this.cardAAAIndex = arrayIndex;                 // New card becomes AAA with ZZZ empty
                    this.cardZZZIndex = this.NONE;

                    Cards.ChangeCardImage(this.cardAAAIndex, this.TURN_UP);
                }
        }
        /*
        ** Check if the game is over (i.e. number of matches equal to half the cards)
        */
        if (this.numMatches === (this.maxCards/2)) {
            ControlPanelFunctions.UpdateTopScore()
            Cards.Reset();
            SoundControlButton.playApplause()
        }
    }

    Shuffle() {
        for (let i = 0; i < this.cardLocationToID.length; i++) {
            let card = null;
            let img = null;
            let card_object = {element:card, image:img, id: Math.floor(i/2)+1}

            this.cardLocationToID[i] = card_object;
        }
        for (let i = this.cardLocationToID.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.cardLocationToID[i];
            this.cardLocationToID[i] = this.cardLocationToID[j];
            this.cardLocationToID[j] = temp;
        }
    }
}

/*
** Set up the sound button object
*/
let control_panel_container = document.getElementById("control_panel")
let SoundControlButton      = new soundButton();

/*
** Add it to the DOM and launch the sound button listener
*/
control_panel_container.appendChild(SoundControlButton.sound_button);
SoundControlButton.sound_button.addEventListener("click", function() {SoundControlButton.toggleSound()});

let Cards = new CardsClass ();
/*
** Establish the control panel
*/
let ControlPanelFunctions = new ControlPanel();
/*
** And wait for the user to start the game (startGame). by invoking "DEAL CARDS"
*/

async function startGame() {

    if (Cards.IsDealingInProgress()) {
        ControlPanelFunctions.logUserMessage("Please wait until after dealing completes")
        return;
    }

    ControlPanelFunctions.logUserMessage("Start Searching!")

    if (!Cards.IsReset())
        Cards.Reset();

    Cards.SetReset(false);

    selectElement = document.querySelector('#card_selector');
    Cards.SetMaxCards(Number(selectElement.value));

    Cards.Shuffle();

    await Cards.Deal(Cards.GetMaxCards())
}