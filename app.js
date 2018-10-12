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
const $endTurnButton = $('#end-turn');
const $playerBanner = $('h1');

//Objects
const character1 = {
  currentPosition: 277,
  moveSpeed: 3
};

//Arrays
const occupiedSquares = [];

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
}

function handleMove(){
  const index = occupiedSquares.indexOf(currentCharacter.currentPosition);
  if (index > -1){
    occupiedSquares.splice(index, 1);
  }
  character1.currentPosition = parseInt($(this).html());
  $('.enterable').removeClass().addClass('grid-square');
  $('.selected').removeClass().addClass('grid-square');
  $selectedSquare = $allSquares.eq(currentCharacter.currentPosition);
  $selectedSquare.addClass('selected');
  occupiedSquares.push(currentCharacter.currentPosition);
}

function endTurn(){
  isPlayer1 = !isPlayer1;
  if (isPlayer1){
    $playerBanner.html('Player 1\'s turn');
  } else{
    $playerBanner.html('Player 2\'s turn');
  }
}

///////////////////////////////////////////////////////////////////////////////////
$removeThis.remove();

const currentCharacter = character1;
let $selectedSquare = $allSquares.eq(character1.currentPosition);
$selectedSquare.addClass('selected');
occupiedSquares.push(character1.currentPosition);
// $testSquare.html('');
// $testSquare.append('<img src="knife.png"/>');
// $('img').css('transform', 'rotate(270deg)');

$moveButton.click(moveMode);
$endTurnButton.click(endTurn);
