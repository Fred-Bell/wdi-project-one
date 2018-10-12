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

//DOM elements
const $allSquares = $container.children();
const $removeThis = $('.not-enterable');

//Objects
const character1 = {
  currentPosition: 284,
  moveSpeed: 3
};



$removeThis.remove();
$container.css('height', '60vh');
$container.css('width', '60vw');
$container.css('top', '15vh');
$container.css('left', '20vw');


const $testSquare = $allSquares.eq(284);
$testSquare.css('background-color', 'green');
// $testSquare.html('');
// $testSquare.append('<img src="knife.png"/>');
// $('img').css('transform', 'rotate(270deg)');


const $moveButton = $('#move-button');
$moveButton.click(function(){
  const position = character1.currentPosition;
  const moveSpeed = character1.moveSpeed;
  const enterable = [];
  for (let i = 0; i < moveSpeed; i++){
    enterable.push(position - (moveSpeed - i));
    enterable.push(position + (moveSpeed - i));
    enterable.push(position - (moveSpeed - i) * 30);
    enterable.push(position + (moveSpeed - i) * 30);
  }
  for (let i = 0; i < enterable.length; i++){
    const $enterable = $allSquares.eq(enterable[i]);
    $enterable.addClass('enterable');
  }
});
