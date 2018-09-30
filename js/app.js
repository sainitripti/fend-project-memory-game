/*
 * Create a list that holds all of your cards
 */
let cards=["fa-diamond","fa-diamond",
              "fa-paper-plane-o","fa-paper-plane-o",
			  "fa-anchor","fa-anchor",
			  "fa-bolt","fa-bolt",
			  "fa-cube","fa-cube",
			  "fa-leaf","fa-leaf",
			  "fa-bicycle","fa-bicycle",
			  "fa-bomb","fa-bomb"];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* declaration of variables */

let min=0,sec=0,count=0,timeout; //to store time (minutes and seconds) and correct moves
let openCards=[];  //list of open cards 
let lockedCards=[]; //list of locked cards
// variables holding various dom elements which are to be used in various functions
const playButton=document.querySelector('#playAgain');
const restartButton=document.querySelector('.restart');
let deck=document.querySelector('.deck');
let stars=document.querySelector('.stars');
const modal=document.querySelector("#modal");

//function for timer
function timer(){
	if(count<16){
		sec++;
		if(sec<60)
			document.querySelector('.seconds').textContent=sec;
		else{
			min++;
			sec=0;
			document.querySelector('.minutes').textContent=min;
			document.querySelector('.seconds').textContent=sec;
		}
		timeout=setTimeout(timer,1000);
	}
}

//function to increment move count
function moveCounter(){
	count++;
	document.querySelector('.moves').textContent=count;
	// decrement star rating after 12 moves
	if(count==12){
		document.querySelector('.stars').lastElementChild.remove();			
	}
	//decrement star rating after 16 moves
	if(count==16){
		document.querySelector('.stars').lastElementChild.remove();
	}
}

//function to start game

function gameInit(){
	playButton.removeEventListener("click",function(e){
		modal.style.display="none";
		clearTimeout(timeout);
		gameInit();
	});
	//shuffle cards
	shuffle(cards);
	//put cards on deck
	deck.innerHTML="";
	for(let i=0;i<cards.length;i++){
		deck.innerHTML+="<li class=\"card\"><i class=\"fa "+cards[i]+"\"></i></li>";
	}
	//set star rating
	stars.innerHTML="";
		for(let i=0;i<3;i++){
			stars.innerHTML+="<li><i class=\"fa fa-star\"></i></li>";
	}
	//set time
	min=0;
	sec=0;
	//set moves
	count=0;
	openCards=[];
	lockedCards=[];
	document.querySelector('.minutes').textContent=min;
	document.querySelector('.seconds').textContent=sec;
	document.querySelector('.moves').textContent=count;
	deck.addEventListener("click",flipCard);
	restartButton.addEventListener("click",restart);
	
	setTimeout(timer,1000);
}
// to begin the game
gameInit();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 

 //function to display symbol of card on click 
function displaySymbol(targetCard){
	targetCard.setAttribute("class","card show");
}

//function to add a card to a list of open cards
function addToOpenCards(targetCard){
	openCards.push(targetCard);
	targetCard.setAttribute("class","card open show");
}

//function to lock two cards if they match
function lockCards(){
	openCards[0].setAttribute("class","card match");
	openCards[1].setAttribute("class","card match");
	lockedCards.push(openCards[0]);
	lockedCards.push(openCards[1]);
}

//function to hide cards
function hideCards(){
	openCards[0].setAttribute("class","card");
	openCards[1].setAttribute("class","card");
	openCards=[];
}

//restart 
function restart(event){
	clearTimeout(timeout);
	gameInit();
}

//function to declare win
function win(){
	deck.removeEventListener("click",flipCard);
	restartButton.removeEventListener("click",restart);
	modal.style.display="block";
	document.querySelector('#finalMoves').textContent=count;
	let star=3;
	if(count>=12)
		star=2;
	if(count>=16)
		star=1;
	document.querySelector('#finalStars').textContent=star;
	
	playButton.addEventListener("click",function(e){
		modal.style.display="none";
		restart();
	});
}

//check of click on deck and thus on cards 
function flipCard(event){
	const targetCard=event.target;
	if(targetCard.matches('.card')){
		let flag=0;
		//if it is a locked card, do nothing
		for(let i=0;i<lockedCards.length;i++){
			if(lockedCards[i]==targetCard)
				flag=1;
		}
		//if same card is clicked again, then also do nothing
		if(openCards.length==1&&targetCard==openCards[0])
			flag=1;
		if(flag==0){
			displaySymbol(targetCard);
			addToOpenCards(targetCard);
			if(openCards.length>1){
				if(openCards[0].firstElementChild.getAttribute("class")==openCards[1].firstElementChild.getAttribute("class")){
					lockCards();
					openCards=[];
				}
				else{
					setTimeout(hideCards,1000);
				}
				moveCounter();
				if(lockedCards.length==16){
					win();
				}
			}
		}
		
	}
}


