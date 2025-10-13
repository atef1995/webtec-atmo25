const box = document.getElementById("box")

const centerBox = () => {
  console.log(window.innerHeight + " ," + window.innerWidth)
  box.style.position = "absolute"
  box.style.top = window.innerHeight / 2 + "px"
  box.style.right = window.innerWidth / 2 + "px"
}
centerBox()

window.onresize = centerBox

box.addEventListener('click', () => {
  if (box.classList.contains('outline')) {
    box.classList.remove('outline')
  } else {
    box.classList.add('outline')
  }
})

box.addEventListener('dblclick', () => {
  box.classList.add('animateSize')
  box.style.width = "2px"
  box.style.height = "2px"

  setTimeout(() => {
    box.remove()
  }, 2000)
})