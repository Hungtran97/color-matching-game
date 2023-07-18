import { getColorBackground, getTimerElement } from "./selectors.js";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}


export const getRandomColorPairs = (count) => {
  const hueList = ['red', 'yellow', 'green', 'blue', 'pink', 'monochrome', 'goldenrod', 'purple']
  const colorList = [];

  for (let i = 0; i < count; i++) {
    //RandomColor function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      hue: hueList[i % hueList.length],
    });

    colorList.push(color);
  }

  // double current color list
  const fullColorList = [...colorList, ...colorList];

  // Shuffle color list
  shuffle(fullColorList);

  return fullColorList;
}
export function changeColorBackground(color) {
  const backgroundElement = getColorBackground()
  if (backgroundElement) backgroundElement.style.backgroundColor = color
}
export function showTimerText (text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}
export function createTimer ({seconds, onChange, onFinish}) {

  let intervalID = null
  function start () {
    clear()
    let currentSeconds = seconds
    intervalID = setInterval(() => {
      // if (onChange) onChange(currentSeconds)
      onChange?.(currentSeconds)
      currentSeconds--
      if (currentSeconds < 0) {
        clear()
        onFinish?.()
      }
    }, 1000)
  }

  function clear() {
    clearInterval(intervalID)
  }

  return {
    start,
    clear,
  }
}