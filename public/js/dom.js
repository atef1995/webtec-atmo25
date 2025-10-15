const movementStep = 15

const box = document.getElementById('box')
const boxes = document.getElementsByClassName('box')
const centerBox = () => {
  box.style.position = 'absolute'
  box.style.top = window.innerHeight / 2 + 'px'
  box.style.right = window.innerWidth / 2 + 'px'
}
centerBox()

window.onresize = centerBox

const toggleSelected = (box) => {
  if (box.classList.contains('outline')) {
    box.classList.remove('outline', 'selected')
  } else {
    box.classList.add('outline', 'selected')
  }
}

box.addEventListener('click', (e) => toggleSelected(e.target))

const doubleClick = () => {
  box.classList.add('animateSize')
  box.style.width = '2px'
  box.style.height = '2px'

  setTimeout(() => {
    box.remove()
  }, 2000)
}

box.addEventListener('dblclick', () => doubleClick())

/**
 * Handles out of bounds
 * @param {HTMLElement} element 
 */
const onOutOfBounds = (element) => {
  let rightPxNum = parseInt(element.style.right.replace('px', ''))
  let topPxNum = parseInt(element.style.top.replace('px', ''))
  const elementWidth = element.offsetWidth
  const elementHeight = element.offsetHeight
  const windowInnerWidth = parseInt(window.innerWidth)
  const windowInnerHeight = parseInt(window.innerHeight)

  if (rightPxNum > windowInnerWidth - elementWidth) {
    rightPxNum = 0
  } else if (rightPxNum < 0) {
    rightPxNum = windowInnerWidth - elementWidth + 10
  } else if (topPxNum > windowInnerHeight - elementHeight) {
    topPxNum = 0
  } else if (topPxNum < 0) {
    topPxNum = windowInnerHeight - elementHeight
  }
  console.log({
    windowInnerHeight, windowInnerWidth,
    elementWidth, element, rightPxNum, topPxNum
  })

  return [rightPxNum, topPxNum]
}

/**
 * @param {KeyboardEvent} ev 
 */
const keyboardPress = (ev) => {
  ev.preventDefault()
  const colorArray = ['bg-red', 'bg-orange', 'bg-yellow', 'bg-green', 'bg-blue', 'bg-indigo', 'bg-violet']
  const selectedBoxes = document.getElementsByClassName('selected')
  if (ev.key === 'e') {
    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      if (element.classList.contains('circular')) {
        element.classList.remove('circular')
      } else {
        element.classList.add('circular')
      }
    }
  } else if (ev.key === 'r') {
    console.log('r pressed')

    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      let indexOfNextColor = 0

      element.classList.forEach((value) => {
        if (colorArray.includes(value)) {
          console.log('removing color' + value)
          element.classList.remove(value)
          indexOfNextColor = colorArray.indexOf(value) + 1
        }
      })
      if (indexOfNextColor >= colorArray.length) {
        element.classList.add(colorArray[0])
      } else {
        element.classList.add(colorArray[indexOfNextColor])
      }
    }
  } else if (ev.key === 'i' || ev.key === 'u') {
    for (let index = 0; index < boxes.length; index++) {
      const element = boxes[index]
      toggleSelected(element)
    }
  } else if (ev.key === 'y') {
    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      deleteElement(element)
    }
  } else if (ev.key === 'p') {
    console.log('p pressed')

    const newBox = document.createElement('div')
    newBox.className = 'box'
    newBox.style.position = 'absolute'
    newBox.style.top = Math.floor(Math.random() * window.innerHeight + 1) + 'px'
    newBox.style.right = Math.floor(Math.random() * window.innerWidth + 1) + 'px'
    newBox.addEventListener('click', (e) => toggleSelected(e.target))

    document.body.appendChild(newBox)
  } else if (ev.key === 'ArrowUp') {
    console.log("up pressed")

    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      const [_, topPxNum] = onOutOfBounds(element)
      element.style.top = topPxNum - movementStep + 'px'
      console.log(element.style.top)

    }
  } else if (ev.key === 'ArrowRight') {

    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      const [rightPxNum] = onOutOfBounds(element)
      element.style.right = rightPxNum - movementStep + 'px'
    }
  }
  else if (ev.key === 'ArrowLeft') {
    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      const [rightPxNum] = onOutOfBounds(element)

      element.style.right = rightPxNum + movementStep + 'px'
    }
  } else if (ev.key === 'ArrowDown') {

    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      const [_, topPxNum] = onOutOfBounds(element)
      element.style.top = topPxNum + movementStep + 'px'
    }
  }

}

const deleteElement = (element) => {
  element.classList.add('animateSize')
  element.style.width = '2px'
  element.style.height = '2px'

  setTimeout(() => {
    element.remove()
  }, 2000)
}

document.addEventListener('keydown', (ev) => keyboardPress(ev))