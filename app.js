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
  console.log('moved');
  const index = occupiedSquares.indexOf(currentCharacter.currentPosition);
  if (index > -1){
    occupiedSquares.splice(index, 1);
  }
  currentCharacter.currentPosition = parseInt($(this).html());
  $('.enterable').off();
  $('.enterable').removeClass().addClass('grid-square');
  $('.player' + currentCharacter.player + '-soldier').removeClass().addClass('grid-square');
  $currentCharacter = $allSquares.eq(currentCharacter.currentPosition);
  $currentCharacter.addClass('player' + currentCharacter.player + '-soldier');
  occupiedSquares.push(currentCharacter.currentPosition);
  $moveButton.off();
  $endTurnButton.click(endTurn);
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
}

function handleAttack(){
  console.log('murked');
  //need to write this function
  //every time end turn is pressed it adds another event listener to attackMode
  //maybe add an if statement so it only does that if attack has been used
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
  $moveButton.click(moveMode);
  $attackButton.click(attackMode);
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
// $container.css('height', '60vh');
// $container.css('width', '60vw');
// $container.css('top', '15vh');
// $container.css('left', '20vw');

//Global variables
let isPlayer1 = true;

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
  currentPosition: 290,
  moveSpeed: 3,
  attackRange: 1,
  player: 1
};

const character2 = {
  currentPosition: 292,
  moveSpeed: 3,
  attackRange: 1,
  player: 2
};

//Arrays
const occupiedSquares = [];



///////////////////////////////////////////////////////////////////////////////////
$removeThis.remove();

let currentCharacter = character1;
$allSquares.eq(character1.currentPosition).addClass('player1-soldier');
$allSquares.eq(character2.currentPosition).addClass('player2-soldier');


occupiedSquares.push(character1.currentPosition);
occupiedSquares.push(character2.currentPosition);



$moveButton.click(moveMode);
$attackButton.click(attackMode);
$endTurnButton.click(endTurn);
