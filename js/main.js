import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from "../constants.js";
import { getColorElementList, getColorListElement, getNotActiveElementList, getPlayAgainButton, getTimerElement } from "./selectors.js";
import { getRandomColorPairs } from "./utils.js";

let selections = []
let gameStatus = GAME_STATUS.PLAYING
let time = GAME_TIME;

function initColors () {
  const colorList = getRandomColorPairs(PAIRS_COUNT);
  const liList = getColorElementList();
  liList.forEach((liElement, index) => {
    const overlayElement = liElement.querySelector('.overlay');
    liElement.dataset.color = colorList[index];
    if (overlayElement) {
      overlayElement.style.backgroundColor = colorList[index];
    }

  })
}
function showTimer (time){
  const timerElement = getTimerElement()
  if (!timerElement) return
  if (typeof time === 'number') {
  timerElement.textContent = `${time}s`
}
  if (typeof time === 'string') {
  timerElement.textContent = `${time}`
}
}
function showReplayButton () {
  const replayButtonElement = getPlayAgainButton()
  if (replayButtonElement) {
    replayButtonElement.style.display = 'unset'
  }
}
function hideReplayButton () {
  const replayButtonElement = getPlayAgainButton()
  if (replayButtonElement) {
    replayButtonElement.style.display = 'none'
  }
}

function handleTimer () {
  let timer = setInterval(function () {
    showTimer(time)
    time = time -1
    if (gameStatus.includes(GAME_STATUS.FINISHED)) {
      clearTimeout(timer)
      showTimer('You Win!')
    }
    if (time < -1 ) {
      gameStatus = GAME_STATUS.FINISHED
      clearTimeout(timer)
      showTimer('Game over')
      showReplayButton()
    }

  }, 1000)
}
function handleClickColor (liElement) {
  const blockingAction = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);
  if (!liElement || blockingAction) return
  liElement.classList.add('active')
  
  selections.push(liElement)
  
  if (selections.length < 2) return;
  
  const first = selections[0].dataset.color
  const second = selections[1].dataset.color
  const isMatch = first === second
  
  if (isMatch) {
    const isWin = getNotActiveElementList().length === 0
    
    if (isWin) {
      showReplayButton()
      gameStatus = GAME_STATUS.FINISHED
    }
    selections =[]
    return
  }
  
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    gameStatus = GAME_STATUS.PLAYING
  }, 500)
  gameStatus = GAME_STATUS.BLOCKING
}
function attachEventColorList () {
  const ulElement = getColorListElement();
  
  if (!ulElement) return;
  ulElement.addEventListener('click', (event) => {
    if (event.target.tagName !== 'LI') return
    handleClickColor(event.target)
    
  })
}
function handleReplayButton () {
  const replayButtonElement = getPlayAgainButton();
  
  if (!replayButtonElement) return;
  replayButtonElement.addEventListener('click', (event) => {
    gameStatus = GAME_STATUS.PLAYING
    time = GAME_TIME;

    const liElementlist = getColorElementList();
    if (liElementlist) {
      liElementlist.forEach(cell => {
        cell.className = ""       
    })
    }
    handleTimer()
    hideReplayButton()
    initColors()
    
  })
  
}


//main
(() => {
  handleTimer()
  initColors()
  attachEventColorList()
  handleReplayButton()
}) ()
