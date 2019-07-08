// object oriented version tutorial https://wsvincent.com/javascript-object-oriented-deck-cards/
// http://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript

// Ventti (Finnish blackjack variant)
// A = 1 or 14, J = 11, Q = 12, K = 13 - target is 21, >21 is bust
// All cards are open
// Start with two cards

// BUG if A comes as first card, doesn't check the value -> can result in auto-lose
// BUG if game is lost at start, doesn't update LOSER text

// Define the elements on the page
const dealButton = document.getElementById('deal-card');
const startButton = document.getElementById('start-game');
const stayButton = document.getElementById('stay');

// Define cards, card deck back unicode &#127136
const values = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const suits = ['Spades', 'Hearts', 'Diamonds', 'Clubs'];
let deck = new Array();

let cardImages = [];
const cardUnicodePrefix = '&#127';
// Prepare the card images in Unicode, array order will be the same in card creation
function prepareCardImages() {
    var excludeCards = [148, 151, 152, 164, 167, 168, 180, 183, 184, 196, 199];  //exclude non-standard playing cards in the unicode bank
    for (var i = 0; i < 63; i++) {
        if (excludeCards.indexOf((137 + i)) < 0) {
            cardImages.push('' + cardUnicodePrefix + (137 + i));
        }
    }
  console.log("Prepared card images!");  
}

// Build a deck of cards
function makeDeck() {
  deck = []; // if a deck already exists, this will remove the contents
  let l = 0;
  for (let i = 0; i < suits.length; i++){
    for (let j = 0; j < values.length; j++){
      let card = { value : values[j], suit : suits[i],  cardImage: (cardImages[l]) };
      deck.push(card);
      l++;
    }
  }
  console.log("Made a deck!");
  return deck;
}

// Define count, used to keep track of the number of cards in the deck
let count = 0;

// Define currentPlayer, used to keep track whose turn it is
let currentPlayer = 0;

// Define 2 players, player 0 & player 1, players have hands to store cards and points
let players = new Array();

function createPlayers(){
  // Creates two players
  for (let i = 0; i < 2; i++){
    let hand = new Array();
    let player = { name: "Player" + i, points: 0, hand: hand};
    players.push(player);
  }
}

createPlayers();

// Pick a random number in a deck of cards later
function pickRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;  
}

// Shuffle the deck, pick two random locations in the deck and exchange them, repeat 1000 times
function shuffle(arr) {
  for (let i = 0; i < 1000; i++) {
    let locationA = pickRandomInt(0, 51);
    let locationB = pickRandomInt(0, 51);
    
    // make a temporary placeholder and exchange the locations
    let temp = arr[locationA];
    arr[locationA] = arr[locationB];
    arr[locationB] = temp;
  }
  console.log(`The deck is shuffled, card locations changed 1000 times!`);
  return deck;
}


// The value of an Ace is 14, when player would get up to 20 or 21
// Add a toggle later to let the player decide the value of their Aces
function itsAnAce(){
  console.log('Ace drawn!');
  if (players[currentPlayer].points === 6 || 7){
    players[currentPlayer].hand[players[currentPlayer].hand.length-1].value = 14;
  } else {
    players[currentPlayer].hand[players[currentPlayer].hand.length-1].value = 1;
  }
}

// Start game, recreate players, make deck, shuffle, deal two cards to players
function gameStart() {
  document.getElementById('player-turn').innerHTML = "";
  document.getElementById('player-hand-0').innerHTML = "";
  document.getElementById('player-hand-1').innerHTML = "";
  currentPlayer = 0;
  count = 0;
  players = [];
  createPlayers();
  players[0].name = "Player";
  players[1].name = "House";
  startButton.innerHTML = 'Restart game';
  dealButton.disabled = false;
  stayButton.disabled = false;
  prepareCardImages();
  makeDeck();
  shuffle(deck);
  repeat(drawCard, 2);
}

// Draw a card for player, remove it from the deck and add to current player's hand
function drawCard(){
    console.log(`Drawn card number ${count+1}`);
    var card = deck.pop();
    players[currentPlayer].hand.push(card);
    if (card.value == 'A') { itsAnAce(); } // Check if the card is an ace, adjust the value
    // Count player's points 
    renderCards(card, currentPlayer);
    players[currentPlayer].points += card.value;
    console.log(players[currentPlayer].hand);
    updatePointsTurn();
    count++;
    document.getElementById('card-count').innerHTML = `${count} cards drawn`;
    check();
    changeTurn();
}

// Render cards on the table
function renderCards(card, player){
  let element = document.createElement('div');
  // element.className = 'card';
  redCards(card, element);
  element.innerHTML =  card.cardImage;
  let dealtCard = document.getElementById('player-hand-' + player);
  dealtCard.appendChild(element);
}

// If card is Hearts or Diamonds, make it red - Hearts || Diamonds didn't work?
function redCards(card, element) {
  return (card.suit === "Hearts") ? element.className = 'card red' : (card.suit === "Diamonds") ? element.className = 'card red' : element.className = 'card';
}

function stay(){
    updatePointsTurn();
    changeTurn();
}

function endGame(){
  dealButton.disabled = true;
  stayButton.disabled = true;
  document.getElementById('player-turn').innerHTML = `GAME OVER, ${players[currentPlayer].name.toUpperCase()} LOST!`;
}

// Check the points of player, if it is over 21 - end game
function check(){
  if (players[currentPlayer].points > 21){
    console.log(`LOST THE GAME, OVER 21! Player ${players[currentPlayer].name} has ${players[currentPlayer].points} points.` );
    endGame();
  } else {
    console.log(`${players[currentPlayer].name}'s points  + ${players[currentPlayer].points}`);
  }
}

// Update the scoreboard and player turn
function updatePointsTurn(){
  if (currentPlayer === 0){
    document.getElementById('player0-score').innerHTML = players[currentPlayer].points;
    document.getElementById('player-turn').innerHTML = `${players[1].name}'s turn`;
  } else if (currentPlayer === 1){
    document.getElementById('player1-score').innerHTML = players[currentPlayer].points;
    document.getElementById('player-turn').innerHTML = `${players[0].name}'s turn`;
  }
}

// Change the turn of player
function changeTurn(){
  return (currentPlayer === 1) ? currentPlayer = 0 : currentPlayer = 1;
}

// Function for repeating function x times
function repeat(fn, x){
  let i = 0;
  while (i < x){
    fn();
    i++;
  }
}

// Deal button
dealButton.addEventListener('click', function(){
  drawCard();
});

// Start game button
startButton.addEventListener('click', function(){
  gameStart();
});

// Stay button
stayButton.addEventListener('click', function(){
  stay();
});