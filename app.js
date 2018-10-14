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
  $moveButton.off();
  $moveButton.click(cancelMove);
  $moveButton.html('CANCEL');
  $('.enterable').click(handleMove);
  $endTurnButton.off();
  $attackButton.off();
}

function handleMove(){
  $allSquares.eq(currentCharacter.currentPosition).removeClass().addClass('grid-square');
  const index = occupiedSquares.indexOf(currentCharacter.currentPosition);
  if (index > -1){
    occupiedSquares.splice(index, 1);
  }
  currentCharacter.currentPosition = parseInt($(this).html());
  $('.enterable').off();
  $('.enterable').removeClass('enterable');
  $currentCharacter = $allSquares.eq(currentCharacter.currentPosition);
  $currentCharacter.addClass('player' + currentCharacter.player + '-soldier');
  occupiedSquares.push(currentCharacter.currentPosition);
  $moveButton.off();
  $moveButton.css('background-color', 'black');
  $moveButton.html('MOVE');
  $endTurnButton.click(endTurn);
  hasMoved = true;
  if (!hasAttacked){
    $attackButton.click(attackMode);
  }
}

function cancelMove(){
  $moveButton.html('MOVE');
  $('.enterable').off();
  $('.enterable').removeClass('enterable');
  hasMoved = false;
  $moveButton.off();
  $moveButton.click(moveMode);
  $endTurnButton.click(endTurn);
  if (!hasAttacked){
    $attackButton.click(attackMode);
  }
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
  for (let i = 0; i < 8; i++){
    if (attackables.includes(occupiedSquares[i])) {
      const attackable = $allSquares.eq(occupiedSquares[i]);
      attackable.addClass('attackable');
    }
  }
  $('.attackable').click(handleAttack);
  $attackButton.off();
  $moveButton.off();
  $attackButton.click(cancelAttack);
  $attackButton.html('CANCEL');
  $endTurnButton.off();
}

function handleAttack(){
  const attackedCharacterArray = livingCharacters.filter(character => {
    return character.currentPosition === parseInt($(this).html());
  });
  const attackedCharacter = attackedCharacterArray[0];
  const damageDealt = Math.floor(Math.random() * 4) + currentCharacter.attack;
  attackedCharacter.currentHealth = attackedCharacter.currentHealth - damageDealt;
  if (attackedCharacter.currentHealth <= 0) {
    attackedCharacter.currentHealth = 0;
    $allSquares.eq(attackedCharacter.currentPosition).removeClass().addClass('grid-square').addClass('blood');
    $('#slot-' + attackedCharacter.player + '-' + attackedCharacter.characterSlot).children('.icon').html('X');
    const indexInLiving = livingCharacters.indexOf(attackedCharacter);
    livingCharacters.splice(indexInLiving, 1);
    const indexInOccupied = occupiedSquares.indexOf(attackedCharacter.currentPosition);
    occupiedSquares.splice(indexInOccupied, 1);
  }
  const $newP = $('<p></p>');
  $newP.html(damageDealt);
  $allSquares.eq(attackedCharacter.currentPosition).append($newP);
  function removeP(){
    $newP.remove();
  }
  setTimeout(removeP, 2000);
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
  $attackButton.html('ATTACK');
  if (!hasMoved){
    $moveButton.click(moveMode);
  }
}

function cancelAttack(){
  $attackButton.html('ATTACK');
  $('.attackable').off();
  $('.attackable').removeClass('attackable');
  hasAttacked = false;
  $attackButton.off();
  $attackButton.click(attackMode);
  $endTurnButton.click(endTurn);
  if (!hasMoved){
    $moveButton.click(moveMode);
  }
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
let currentCharacter;

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
  currentPosition: 339,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 1,
  characterSlot: 1
};

const character2 = {
  currentPosition: 350,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 2,
  characterSlot: 1
};

const character3 = {
  currentPosition: 277,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 1,
  characterSlot: 2
};

const character4 = {
  currentPosition: 292,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 2,
  characterSlot: 2
};

const character5 = {
  currentPosition: 397,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 1,
  characterSlot: 3
};

const character6 = {
  currentPosition: 412,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 2,
  characterSlot: 3
};

const character7 = {
  currentPosition: 337,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 1,
  characterSlot: 4
};
const character8 = {
  currentPosition: 352,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 4,
  player: 2,
  characterSlot: 4
};

//Arrays
const occupiedSquares = [];
const livingCharacters = [];
const addedCharacters = [character1, character2, character3, character4, character5, character6, character7, character8];

///////////////////////////////////////////////////////////////////////////////////
$removeThis.remove();


currentCharacter = character1;

for (let i = 0; i < addedCharacters.length; i++){
  const addingCharacter = addedCharacters[i];
  occupiedSquares.push(addingCharacter.currentPosition);
  livingCharacters.push(addingCharacter);
  const $addingSlot = $('#slot-' + addingCharacter.player + '-' + addingCharacter.characterSlot);
  const $addingHealth = $addingSlot.children('p');
  $addingHealth.html(addingCharacter.currentHealth + '/' + addingCharacter.maxHealth);
  $addingSlot.children('.health-bar').css('background-color', 'red');
  $addingSlot.find('.health-green').css('width', '100%');
  $addingSlot.children('.icon').addClass('player' + addingCharacter.player + '-soldier');
  $allSquares.eq(addingCharacter.currentPosition).addClass('player' + addingCharacter.player + '-soldier');
}




$moveButton.click(moveMode);
$attackButton.click(attackMode);
$endTurnButton.click(endTurn);
$moveButton.css('background-color', 'blue');
$attackButton.css('background-color', 'red');
