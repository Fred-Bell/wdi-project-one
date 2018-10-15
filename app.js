//Functions
function startGame(){
  $('.start-menu').css('display', 'none');
}

function placeCharacter(){
  let currentArray;
  if (isPlayer1){
    currentArray = player1Characters;
  } else{
    currentArray = player2Characters;
  }
  currentCharacter = currentArray[placedCharacters];
  currentCharacter.currentPosition = parseInt($(this).html());
  occupiedSquares.push(currentCharacter.currentPosition);
  $(this).addClass('player' + currentCharacter.player + '-type' + currentCharacter.troopType + '-soldier');
  placedCharacters = placedCharacters + 1;
  $(this).off();
  if (placedCharacters === currentArray.length){
    $finishedPlacementScreen.css('display', 'flex');
  }
}

function finishPlacement1(){
  isPlayer1 = !isPlayer1;
  placedCharacters = 0;
  $finishedPlacementScreen.css('display', 'none');
  $finishedButton.off();
  $finishedButton.click(finishPlacement2);
  $playerBanner.html('Player 2\'s placement phase');
  $allSquares.removeClass().addClass('grid-square');
}

function finishPlacement2(){
  isPlayer1 = true;
  currentCharacter = character1;
  $allSquares.eq(currentCharacter.currentPosition).addClass('selected');
  $('#slot-' + currentCharacter.player + '-' + currentCharacter.characterSlot).find('.icon').addClass('active');
  $finishedPlacementScreen.css('display', 'none');
  $finishedButton.off();
  $playerBanner.html('Player 1\'s turn');
  for (let i = 0; i < player1Characters.length; i++){
    const addingCharacter = player1Characters[i];
    $allSquares.eq(addingCharacter.currentPosition).addClass('player' + addingCharacter.player + '-type' + addingCharacter.troopType + '-soldier');
  }
  $('#placement-controls').css('display', 'none');
  $allSquares.off();
}

function moveMode(){
  const position = currentCharacter.currentPosition;
  const moveSpeed = currentCharacter.moveSpeed;
  const enterables = [];
  for (let i = 0; i < moveSpeed; i++){
    enterables.push(position - (moveSpeed - i));
    enterables.push(position + (moveSpeed - i));
    enterables.push(position - (moveSpeed - i) * 30);
    enterables.push(position + (moveSpeed - i) * 30);
    enterables.push((position - (moveSpeed - i) * 30) + i);
    enterables.push((position - (moveSpeed - i) * 30) - i);
    enterables.push((position + (moveSpeed - i) * 30) + i);
    enterables.push((position + (moveSpeed - i) * 30) - i);
    enterables.push((position - (moveSpeed - i) * 30) - i * 0.5);
    enterables.push((position - (moveSpeed - i) * 30) + i * 0.5);
    enterables.push((position + (moveSpeed - i) * 30) - i * 0.5);
    enterables.push((position + (moveSpeed - i) * 30) + i * 0.5);
    enterables.push((position - (moveSpeed - i) * 30) - i / 3);
    enterables.push((position - (moveSpeed - i) * 30) + i / 3);
    enterables.push((position + (moveSpeed - i) * 30) - i / 3);
    enterables.push((position + (moveSpeed - i) * 30) + i / 3);
    enterables.push((position - (moveSpeed - i) * 30) - i / 3 * 2);
    enterables.push((position - (moveSpeed - i) * 30) + i / 3 * 2);
    enterables.push((position + (moveSpeed - i) * 30) - i / 3 * 2);
    enterables.push((position + (moveSpeed - i) * 30) + i / 3 * 2);

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
  const $currentCharacter = $allSquares.eq(currentCharacter.currentPosition);
  $currentCharacter.addClass('player' + currentCharacter.player + '-type' + currentCharacter.troopType+ '-soldier');
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
  if (currentCharacter.troopType === 3){
    for (let i = 156; i < 444; i++ ){
      attackables.push(i);
    }
  } else {
    for (let i = 0; i < attackRange; i++){
      attackables.push(position - (attackRange - i));
      attackables.push(position + (attackRange - i));
      attackables.push(position - (attackRange - i) * 30);
      attackables.push(position + (attackRange - i) * 30);
      attackables.push(position - (attackRange - i) * 30 + 1);
      attackables.push(position + (attackRange - i) * 30 - 1);
      attackables.push(position - (attackRange - i) * 30 - 1);
      attackables.push(position + (attackRange - i) * 30 + 1);
    }
  }
  for (let i = 0; i < 8; i++){
    if (attackables.includes(occupiedSquares[i])) {
      const attackable = $allSquares.eq(occupiedSquares[i]);
      attackable.addClass('attackable');
    }
  }
  let currentTeam;
  if (currentCharacter.player === 1){
    currentTeam = player1Characters;
  } else{
    currentTeam = player2Characters;
  }
  for ( let i = 0; i < currentTeam.length; i++){
    $allSquares.eq(currentTeam[i].currentPosition).removeClass('attackable');
  }
  if ($('.attackable').length === 0){
    const $newP = $('<p></p>');
    $newP.html('Nobody in range!');
    $allSquares.eq(currentCharacter.currentPosition).append($newP);
    setTimeout(function(){
      $newP.remove();
    }, 2000);
  }

  $('.attackable').click(handleAttack);
  $attackButton.off();
  $moveButton.off();
  $attackButton.click(cancelAttack);
  $attackButton.html('CANCEL');
  $endTurnButton.off();
  if (currentCharacter.troopType === 4){
    $moveButton.html('HEAL WOUNDS'); //need to write lightning bolt function (like move function ligtup 4 squares)
    $moveButton.css('background-color', 'green');
    $endTurnButton.html('FIRE BALL');
    $endTurnButton.css('background-color', 'orange');
    $endTurnButton.click(fireball);
  }
}

function handleAttack(){
  if (currentCharacter.troopType === 4){
    $moveButton.html('MOVE');
    $moveButton.css('background-color', 'black');
    $endTurnButton.html('END TURN');
    $endTurnButton.css('background-color', 'purple');
    $moveButton.off();
    $endTurnButton.off();
  }
  const attackedCharacterArray = livingCharacters.filter(character => {
    return character.currentPosition === parseInt($(this).html());
  });
  const attackedCharacter = attackedCharacterArray[0];
  const damageDealt = Math.floor(Math.random() * 4) + currentCharacter.attack;
  attackedCharacter.currentHealth = attackedCharacter.currentHealth - damageDealt;
  if (attackedCharacter.currentHealth <= 0) {
    attackedCharacter.currentHealth = 0;
    $('.attackable').off();
    $allSquares.eq(attackedCharacter.currentPosition).removeClass().addClass('grid-square').addClass('blood');
    $('#slot-' + attackedCharacter.player + '-' + attackedCharacter.characterSlot).children('.icon').html('X');
    const indexInLiving = livingCharacters.indexOf(attackedCharacter);
    livingCharacters.splice(indexInLiving, 1);
    const indexInOccupied = occupiedSquares.indexOf(attackedCharacter.currentPosition);
    occupiedSquares.splice(indexInOccupied, 1);
    if (attackedCharacter.player === 1){
      const indexInPlayer1 = player1Characters.indexOf(attackedCharacter);
      player1Characters.splice(indexInPlayer1, 1);
      if (player1Characters.length === 0) {
        const $newDiv = $('<div></div>').addClass('victory-screen');
        $newDiv.html('PLAYER 2 WINS!!!!');
        $('body').prepend($newDiv);
      }
    }
    if (attackedCharacter.player === 2){
      const indexInPlayer2 = player2Characters.indexOf(attackedCharacter);
      player2Characters.splice(indexInPlayer2, 1);
      if (player2Characters.length === 0) {
        const $newDiv = $('<div></div>').addClass('victory-screen');
        $newDiv.html('PLAYER 1 WINS!!!!');
        $('body').prepend($newDiv);
      }

    }
  }
  const $newP = $('<p></p>');
  $newP.html(damageDealt);
  $allSquares.eq(attackedCharacter.currentPosition).append($newP);
  setTimeout(function(){
    $newP.remove();
  }, 2000);
  if (currentCharacter.troopType === 3){
    const $newDiv = $('<div></div>');
    $newDiv.addClass('arrow');
    $newDiv.css({top: $allSquares.eq(currentCharacter.currentPosition).offset().top + 'px', left: $allSquares.eq(currentCharacter.currentPosition).offset().left + 'px'});
    $('body').append($newDiv);
    $newDiv.css({top: $allSquares.eq(attackedCharacter.currentPosition).offset().top + 'px', left: $allSquares.eq(attackedCharacter.currentPosition).offset().left + 'px'});
    setTimeout(function(){
      $newDiv.remove();
    }, 200);
  }
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
    $moveButton.css('background-color', 'blue');
  }
}

function cancelAttack(){
  if (currentCharacter.troopType === 4){
    $moveButton.html('MOVE');
    $moveButton.css('background-color', 'black');
    $endTurnButton.html('END TURN');
    $endTurnButton.css('background-color', 'purple');
    $moveButton.off();
    $endTurnButton.off();
    $allSquares.off();
  }
  $attackButton.html('ATTACK');
  $('.attackable').off();
  $('.attackable').removeClass('attackable');
  hasAttacked = false;
  $attackButton.off();
  $attackButton.click(attackMode);
  $endTurnButton.click(endTurn);
  if (!hasMoved){
    $moveButton.click(moveMode);
    $moveButton.css('background-color', 'blue');
  }
}

function fireball(){
  $('.attackable').off();
  $('.attackable').removeClass('attackable');
  $allSquares.mouseover(function(){
    $(this).click(handleFireball);
    const position = parseInt($(this).html());
    const blastzone = [position, position - 1, position + 1, position - 30, position + 30, position - 31, position + 31, position -29, position + 29];
    for ( let i = 0; i < blastzone.length; i++){
      $allSquares.eq(blastzone[i]).addClass('fireball');
    }
  });
  $allSquares.mouseout(function(){
    $allSquares.removeClass('fireball');
    $allSquares.off('click');
  });
}

function handleFireball(){
  const position = parseInt($(this).html());
  const $newDiv = $('<div></div>');
  $newDiv.attr('id', 'explosion');
  $newDiv.css({top: $allSquares.eq(position - 30).offset().top + 'px', left: $allSquares.eq(position - 2).offset().left + 'px'});
  $('body').append($newDiv);
  setTimeout(function(){
    $newDiv.remove();
  }, 2000);
  const blastzone = [position, position - 1, position + 1, position - 30, position + 30, position - 31, position + 31, position -29, position + 29];
  for (let i = 0; i < 8; i++){
    if (blastzone.includes(parseInt(addedCharacters[i].currentPosition))) {
      const burntCharacter = addedCharacters[i];
      const damageDealt = (Math.floor(Math.random() * 3) + 2);
      burntCharacter.currentHealth = burntCharacter.currentHealth - damageDealt;
      const $newP = $('<p></p>');
      $newP.html(damageDealt);
      $allSquares.eq(burntCharacter.currentPosition).append($newP);
      setTimeout(function(){
        $newP.remove();
      }, 2000);
      if (burntCharacter.currentHealth <= 0) {
        burntCharacter.currentHealth = 0;
        $('.attackable').off();
        $allSquares.eq(burntCharacter.currentPosition).removeClass().addClass('grid-square').addClass('blood');
        $('#slot-' + burntCharacter.player + '-' + burntCharacter.characterSlot).children('.icon').html('X');
        const indexInLiving = livingCharacters.indexOf(burntCharacter);
        livingCharacters.splice(indexInLiving, 1);
        const indexInOccupied = occupiedSquares.indexOf(burntCharacter.currentPosition);
        occupiedSquares.splice(indexInOccupied, 1);
        if (burntCharacter.player === 1){
          const indexInPlayer1 = player1Characters.indexOf(burntCharacter);
          player1Characters.splice(indexInPlayer1, 1);
          if (player1Characters.length === 0) {
            const $newDiv = $('<div></div>').addClass('victory-screen');
            $newDiv.html('PLAYER 2 WINS!!!!');
            $('body').prepend($newDiv);
          }
        }
        if (burntCharacter.player === 2){
          const indexInPlayer2 = player2Characters.indexOf(burntCharacter);
          player2Characters.splice(indexInPlayer2, 1);
          if (player2Characters.length === 0) {
            const $newDiv = $('<div></div>').addClass('victory-screen');
            $newDiv.html('PLAYER 1 WINS!!!!');
            $('body').prepend($newDiv);
          }
        }
      }
      const $attackedHealth = $('#slot-' + burntCharacter.player + '-' + burntCharacter.characterSlot).children('p');
      $attackedHealth.html(burntCharacter.currentHealth + '/' + burntCharacter.maxHealth);
      const healthPercentage = (burntCharacter.currentHealth / burntCharacter.maxHealth) * 100;
      const $attackedBar = $('#slot-' + burntCharacter.player + '-' + burntCharacter.characterSlot).find('.health-green');
      $attackedBar.css('width', healthPercentage + '%');
    }
  }
  cancelAttack();
  $attackButton.off();
  $attackButton.css('background-color', 'black');
  $allSquares.removeClass('fireball');
  $allSquares.off();
  hasAttacked = true;
}


function endTurn(){
  $('#slot-' + currentCharacter.player + '-' + currentCharacter.characterSlot).find('.icon').removeClass('active');
  $allSquares.eq(currentCharacter.currentPosition).removeClass('selected');
  isPlayer1 = !isPlayer1;
  if (isPlayer1){
    $playerBanner.html('Player 1\'s turn');
    if (player1Characters.length -1 < characterIndex1){
      characterIndex1 = 0;
    }
    currentCharacter = player1Characters[characterIndex1];
    characterIndex1++;
  } else{
    $playerBanner.html('Player 2\'s turn');
    if (player2Characters.length - 1 < characterIndex2){
      characterIndex2 = 0;
    }
    currentCharacter = player2Characters[characterIndex2];
    characterIndex2++;
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
  $allSquares.eq(currentCharacter.currentPosition).addClass('selected');
  $('#slot-' + currentCharacter.player + '-' + currentCharacter.characterSlot).find('.icon').addClass('active');
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
let characterIndex1 = 1;
let characterIndex2 = 0;
let placedCharacters = 0;

//DOM elements
const $allSquares = $container.children();
const $removeThis = $('.not-enterable');
const $moveButton = $('#move-button');
const $attackButton = $('#attack-button');
const $endTurnButton = $('#end-turn');
const $startButton = $('#start-button');
const $finishedButton = $('#finished-button');
const $playerBanner = $('h1');
const $finishedPlacementScreen = $('#finished-placement-screen');


//Objects
const character1 = {
  currentPosition: 0,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 5,
  player: 1,
  characterSlot: 1,
  troopType: 1
};

const character2 = {
  currentPosition: 0,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 10,
  currentHealth: 10,
  attack: 5,
  player: 2,
  characterSlot: 1,
  troopType: 1
};

const character3 = {
  currentPosition: 281,
  moveSpeed: 3,
  attackRange: 30,
  maxHealth: 5,
  currentHealth: 5,
  attack: 2,
  player: 1,
  characterSlot: 2,
  troopType: 3
};

const character4 = {
  currentPosition: 288,
  moveSpeed: 3,
  attackRange: 30,
  maxHealth: 5,
  currentHealth: 5,
  attack: 2,
  player: 2,
  characterSlot: 2,
  troopType: 3
};

const character5 = {
  currentPosition: 401,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 8,
  currentHealth: 8,
  attack: 1,
  player: 1,
  characterSlot: 3,
  troopType: 4
};

const character6 = {
  currentPosition: 408,
  moveSpeed: 3,
  attackRange: 1,
  maxHealth: 8,
  currentHealth: 8,
  attack: 1,
  player: 2,
  characterSlot: 3,
  troopType: 4
};

const character7 = {
  currentPosition: 341,
  moveSpeed: 4,
  attackRange: 1,
  maxHealth: 15,
  currentHealth: 15,
  attack: 6,
  player: 1,
  characterSlot: 4,
  troopType: 2
};
const character8 = {
  currentPosition: 348,
  moveSpeed: 4,
  attackRange: 1,
  maxHealth: 15,
  currentHealth: 15,
  attack: 6,
  player: 2,
  characterSlot: 4,
  troopType: 2
};

//Arrays
const occupiedSquares = [];
const livingCharacters = [];
const addedCharacters = [character1, character2, character3, character4, character5, character6, character7, character8];
const player1Characters = [character1, character3, character5, character7];
const player2Characters = [character2, character4, character6, character8];

///////////////////////////////////////////////////////////////////////////////////
$removeThis.remove();

for (let i = 0; i < addedCharacters.length; i++){
  const addingCharacter = addedCharacters[i];
  livingCharacters.push(addingCharacter);
  const $addingSlot = $('#slot-' + addingCharacter.player + '-' + addingCharacter.characterSlot);
  const $addingHealth = $addingSlot.children('p');
  $addingHealth.html(addingCharacter.currentHealth + '/' + addingCharacter.maxHealth);
  $addingSlot.children('.health-bar').css('background-color', 'red');
  $addingSlot.find('.health-green').css('width', '100%');
  $addingSlot.children('.icon').addClass('player' + addingCharacter.player + '-type' + addingCharacter.troopType + '-soldier');
}

$allSquares.click(placeCharacter);
$finishedButton.click(finishPlacement1);
$startButton.click(startGame);
$moveButton.click(moveMode);
$attackButton.click(attackMode);
$endTurnButton.click(endTurn);
