const box = document.getElementById("box")

const centerBox = () => {
  console.log(window.innerHeight + " ," + window.innerWidth)
  box.style.position = "absolute"
  box.style.top = window.innerHeight / 2 + "px"
  box.style.right = window.innerWidth / 2 + "px"
}
centerBox()

window.onresize = centerBox

const toggleSelected = () => {
  if (box.classList.contains('outline')) {
    box.classList.remove('outline', 'selected')
  } else {
    box.classList.add('outline', 'selected')
  }
}

box.addEventListener('click', () => toggleSelected())

const doubleClick = () => {
  box.classList.add('animateSize')
  box.style.width = "2px"
  box.style.height = "2px"

  setTimeout(() => {
    box.remove()
  }, 2000)
}

box.addEventListener('dblclick', () => doubleClick())

const keyboardPress = (ev) => {
}

document.addEventListener('keydown', (ev) => {
  ev.preventDefault()

  const selectedBoxes = document.getElementsByClassName('selected')
  if (ev.key === "e") {
    for (let index = 0; index < selectedBoxes.length; index++) {
      const element = selectedBoxes[index]
      if (element.classList.contains("circular")) {
        element.classList.remove("circular")
      } else {
        element.classList.add("circular")
      }
    }
  }
})