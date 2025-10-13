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
  box.classList.add('outline')
})