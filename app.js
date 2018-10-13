//Functions
function moveMode(){
  const position = currentCharacter.currentPosition;
  const moveSpeed = currentCharacter.moveSpeed;
  const enterables = [];
  for (let i = 0; i < moveSpeed; i++){
    enterables.push(position - (moveSpeed - i));
    enterables.push(position + (moveSpeed - i));
    enterables.push(position - (moveSpeed - i) * 30);
    enterables.push(position + (moveSpeed - i) * 30);
  }
  for (let i = 0; i < enterables.length; i++){
    const isEnterable = $allSquares.eq(enterables[i]);
    isEnterable.addClass('enterable');
  }
  for (let i = 0; i < enterables.length; i++){
    const isOccupied = $allSquares.eq(occupiedSquares[i]);
    isOccupied.removeClass('enterable');
  }
  $('.enterable').click(handleMove);
  $endTurnButton.off();
}

function handleMove(){
  const index = occupiedSquares.indexOf(currentCharacter.currentPosition);
  if (index > -1){
    occupiedSquares.splice(index, 1);
  }
  currentCharacter.currentPosition = parseInt($(this).html());
  $('.enterable').off();
  $('.enterable').removeClass('enterable');
  $('.player' + currentCharacter.player + '-soldier').removeClass().addClass('grid-square');
  $currentCharacter = $allSquares.eq(currentCharacter.currentPosition);
  $currentCharacter.addClass('player' + currentCharacter.player + '-soldier');
  occupiedSquares.push(currentCharacter.currentPosition);
  $moveButton.off();
  $moveButton.css('background-color', 'black');
  $endTurnButton.click(endTurn);
  hasMoved = true;
}

function attackMode(){
  const position = currentCharacter.currentPosition;
  const attackRange = currentCharacter.attackRange;
  const attackables = [];
  for (let i = 0; i < attackRange; i++){
    attackables.push(position - (attackRange - i));
    attackables.push(position + (attackRange - i));
    attackables.push(position - (attackRange - i) * 30);
    attackables.push(position + (attackRange - i) * 30);
  }
  for (let i = 0; i < attackables.length; i++){
    if (attackables.includes(occupiedSquares[i])) {
      const attackable = $allSquares.eq(occupiedSquares[i]);
      attackable.addClass('attackable');
    }
  }
  $('.attackable').click(handleAttack);
  $attackButton.off();
  $endTurnButton.off();
}

function handleAttack(){
  const attackedCharacterArray = livingCharacters.filter(character => {
    return character.currentPosition === parseInt($(this).html());
  });
  const attackedCharacter = attackedCharacterArray[0];
  attackedCharacter.currentHealth = attackedCharacter.currentHealth - (Math.floor(Math.random() * 4) + 4);
  const $attackedHealth = $('#slot-' + attackedCharacter.player + '-' + attackedCharacter.characterSlot).children('p');
  $attackedHealth.html(attackedCharacter.currentHealth + '/' + attackedCharacter.maxHealth);
  const healthPercentage = (attackedCharacter.currentHealth / attackedCharacter.maxHealth) * 100;
  const $attackedBar = $('#slot-' + attackedCharacter.player + '-' + attackedCharacter.characterSlot).find('.health-green');
  $attackedBar.css('width', healthPercentage + '%');
  $('.attackable').off();
  $('.attackable').removeClass('attackable');
  hasAttacked = true;
  $attackButton.css('background-color', 'black');
  $endTurnButton.click(endTurn);

  //need to write an if statement checking if attackedCharacter.currentHealth = 0
  // then make what happens when a character dies
  // also need to fix character move but no attack bug
  //need to fix clicking attack button and not attacking breaknig button
}

function endTurn(){
  isPlayer1 = !isPlayer1;
  if (isPlayer1){
    $playerBanner.html('Player 1\'s turn');
    currentCharacter = character1;
  } else{
    $playerBanner.html('Player 2\'s turn');
    currentCharacter = character2;
  }
  if (hasMoved){
    $moveButton.click(moveMode);
    hasMoved = false;
    $moveButton.css('background-color', 'blue');
  }
  if (hasAttacked){
    $attackButton.click(attackMode);
    hasAttacked = false;
    $attackButton.css('background-color', 'red');
  }
}

//generates our grid
const $container = $('.container');
for(let i = 1; i < 600 ; i++){
  const $newDiv = $('<div></div>').addClass('not-enterable');
  $container.append($newDiv);
  if (i > 125 && i < 145 || i > 155 && i < 174 || i > 185 && i < 204 || i > 215 && i < 234
    || i > 245 && i < 264 || i > 275 && i < 294 || i > 305 && i < 324 || i > 335 && i < 354
    || i > 365 && i < 384 || i > 395 && i < 414 || i > 425 && i < 444 || i > 455 && i < 474){
    $newDiv.attr('class', 'grid-square');
    $newDiv.html(i);
  }
  if(i < 154 || i > 445){
    $newDiv.attr('class', 'not-enterable');
    $newDiv.html('');
  }
}

//Global variables
let isPlayer1 = true;
let hasMoved = false;
let hasAttacked = false;

//DOM elements
const $allSquares = $container.children();
const $removeThis = $('.not-enterable');
const $moveButton = $('#move-button');
const $attackButton = $('#attack-button');
const $endTurnButton = $('#end-turn');
const $playerBanner = $('h1');
let $currentCharacter;

//Objects
const character1 = {
  currentPosition: 345,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  player: 1,
  characterSlot: 1,
  background: 'url(images/knife.png))'
};

const character2 = {
  currentPosition: 352,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  player: 2,
  characterSlot: 1,
  background: 'url(images/axe.png))'
};

//Arrays
const occupiedSquares = [];
const livingCharacters = [ character1, character2 ];


///////////////////////////////////////////////////////////////////////////////////
$removeThis.remove();


//need to refactor this mess so it can be applied to all characters entered in the game
let currentCharacter = character1;
$allSquares.eq(character1.currentPosition).addClass('player1-soldier');
$allSquares.eq(character2.currentPosition).addClass('player2-soldier');
occupiedSquares.push(character1.currentPosition);
occupiedSquares.push(character2.currentPosition);
const $character1Slot = $('#slot-' + character1.player + '-' + character1.characterSlot);
const $character1Health = $character1Slot.children('p');
$character1Health.html(character1.currentHealth + '/' + character1.maxHealth);
$character1Slot.children('.health-bar').css('background-color', 'red');
$character1Slot.find('.health-green').css('width', '100%');
$character1Slot.children('.icon-left').css('background-image', 'url(images/knife.png)');
const $character2Slot = $('#slot-' + character2.player + '-' + character2.characterSlot);
const $character2Health = $character2Slot.children('p');
$character2Health.html(character2.currentHealth + '/' + character2.maxHealth);
$character2Slot.children('.health-bar').css('background-color', 'red');
$character2Slot.find('.health-green').css('width', '100%');
$character2Slot.children('.icon-right').css('background-image', 'url(images/axe.png)');







$moveButton.click(moveMode);
$attackButton.click(attackMode);
$endTurnButton.click(endTurn);
$moveButton.css('background-color', 'blue');
$attackButton.css('background-color', 'red');
