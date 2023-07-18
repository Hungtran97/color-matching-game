import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from "../constants.js";
import { getColorElementList, getColorListElement, getNotActiveElementList, getPlayAgainButton, getTimerElement } from "./selectors.js";
import { getRandomColorPairs, showTimerText, createTimer, changeColorBackground } from "./utils.js";

let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer ({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
})
function handleTimerChange (second) {
  const fullSeconds = `0${second}s`.slice(-3)
  showTimerText(fullSeconds)
}
function handleTimerFinish () {
  gameStatus = GAME_STATUS.FINISHED
  showTimerText('Game Over!')
  showReplayButton()
}

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
    changeColorBackground(first)
    
    if (isWin) {
      showReplayButton()
      timer.clear()
      showTimerText('You Win!')
      gameStatus = GAME_STATUS.FINISHED
    }
    selections =[]
    return
  }
  
  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) gameStatus = GAME_STATUS.PLAYING
    // if (timer.seconds <= 0) gameStatus = GAME_STATUS.FINISHED 
  }, 400)
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

    const liElementlist = getColorElementList();
    if (liElementlist) {
      liElementlist.forEach(cell => {
        cell.className = ""       
    })
    }
    startTimer()
    hideReplayButton()
    initColors()
    
  })
  
}
function startTimer () {
  timer.start()
}


//main
(() => {
  initColors()
  attachEventColorList()
  handleReplayButton()
  startTimer()
}) ()
