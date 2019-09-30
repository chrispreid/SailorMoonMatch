const cards = document.querySelectorAll('.flipper');
const board = document.getElementsByClassName('.cards');
let hasFlippedCard = false;
let lockCards = false;
let firstCard, secondCard
let startBtn = document.querySelector('.start');
let homeBtn = document.querySelector('#moon-girl');
let startScrn = document.querySelector('.start-game');
let matchNumber = 0;
let resetBtn = document.querySelector('.reset');
let chosenCards = [];
let timerInterval;
let highScore = 0;
let themeSong = new Audio('https://s1.vocaroo.com/media/download_temp/Vocaroo_s1O91NbTCzeE.mp3');
let evilLaugh = new Audio('https://s1.vocaroo.com/media/download_temp/Vocaroo_s13AqqWkcQP1.mp3');
let winSong = new Audio('https://s1.vocaroo.com/media/download_temp/Vocaroo_s18eVe8TLEUo.mp3');


function startGame() {
  startScrn.style.display = 'none';
  timer();
  shuffle();
  showCards();
  themeSong.play();
}
startBtn.addEventListener("click", startGame);

function flipCard() {
  if (lockCards) return;
  if (this === firstCard) return;
  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;
  } else {
    // second click
    hasFlippedCard = false; 
    secondCard = this;
  
  checkForMatch(); 
  }
}

function showCards() {
  cards.forEach(card => {
    card.classList.add('flip');
   setTimeout(() => {
      lockCards = false;
      card.classList.remove('flip');
      resetCards();
  }, 2000);
  })
  
}

function checkForMatch() {
  
  if ((firstCard && secondCard) && firstCard.dataset.framework === secondCard.dataset.framework) {
    if (firstCard.dataset.framework === 'queen-beryl' && matchNumber < 5) {
      lose();
    lockCards = true;
    return;
    }
    chosenCards.push(firstCard.dataset.framework)
    window.setTimeout(disableCards, 1000);
  }  else {
    unflipCards();
  }  
  }  

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('invis');
    secondCard.classList.add('invis');
    resetCards();
    matchNumber++;
}

function unflipCards() {
  lockCards = true;
    setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetCards();
  }, 950);
}

function resetCards() {
[hasFlippedCard, lockCards] = [false, false];
[firstCard, secondCard] = [null, null];
}

function shuffle() {
  cards.forEach(card => {
  let shuffleCards = Math.floor(Math.random() * 12);
  card.style.order = shuffleCards;
  });
};

cards.forEach(card => card.addEventListener('click', flipCard));

let matched = document.getElementsByClassName('invis');

function resetGame() {           
  let matchNumber = 0;
  document.querySelectorAll(`.flip`).forEach(flippedCard => {
    flippedCard.classList.remove('flip');
  });

  chosenCards.forEach(chosenName => {
    document.querySelectorAll(`[data-framework=${chosenName}]`).forEach(selectedCard => {
		  selectedCard.classList.remove('invis');
      selectedCard.addEventListener('click', flipCard)
      });
    });
       
  themeSong.load();
  themeSong.play();

    
      // timeout set because of the transition lag
  setTimeout(() => {
    shuffle();
    showCards();
    resetCards();
    timer();
  }, 400);

     
};

resetBtn.addEventListener('click', resetGame);

const loseGame = document.querySelector('.lose-over');
const winGame = document.querySelector('.win-over');
const loseGif = document.querySelector('.laugh');
const winGif = document.querySelector('.yay');
const loseAlert = document.querySelector('.lose');
const winAlert = document.querySelector('.win');
const scoreAlert = document.querySelector('.score');


function lose() {

  loseGame.style.display = 'flex';
  loseGif.style.display = 'flex';
  loseAlert.innerText = "You Lose!";

  themeSong.pause();
  evilLaugh.load();
  evilLaugh.play();

  const loseRestart = document.querySelector('.lose-start');
  loseRestart.addEventListener('click', () => {
    loseGame.style.display = 'none';
    resetGame();
    evilLaugh.pause();
    themeSong.load();
    themeSong.play();
    });
  }

function win() {
  winGame.style.display = 'flex';
  winGif.style.display = 'flex';
  winAlert.innerText = "You Win!";
  scoreAlert.innerText = `Your best time is ${60 - highScore} seconds!`

  themeSong.pause();
  winSong.load();
  winSong.play();

  const winRestart = document.querySelector('.win-start');
  winRestart.addEventListener('click', () => {
    winGame.style.display = 'none';
    resetGame();
    winSong.pause();
    themeSong.load();
    themeSong.play();
  });
}

function timer() {
  const time = document.querySelector('.timer');
  let counter = 60;
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
      counter--;
    if (counter < 0) {
      clearInterval(timerInterval);
      lockCards = true;
      lose();
      return;
    } else  {
      time.innerText = counter;
    }

    if (matchNumber === 6){
      clearInterval(timerInterval);
      if (highScore === 0 || counter > highScore) {
        highScore = counter;
      } 
      lockCards = true;
      win();
      matchNumber = 0;
      return;
    } 

  }, 1000);
}

startBtn.addEventListener('click', startGame); 

function homeScreen() {
  window.location.reload();
}
homeBtn.addEventListener('click', homeScreen); 
