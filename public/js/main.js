const gameLength = document.getElementById("game-length")
const bgPicture = document.getElementById("background-picture")
const gameSpeed = document.getElementById("game-speed")
const info = document.getElementById("info")

const confirmButton = document.getElementById("confirmButton")


confirmButton.addEventListener("click", () => setUpGame())
const gameData = {
}

const setUpGame = async () => {
  const gameLengthValue = parseInt(gameLength.value)
  const bgPictureValue = parseInt(bgPicture.value)
  console.log({ gameLengthValue });

  if (gameLengthValue !== 10 && gameLengthValue !== 30 && gameLengthValue != 60) {
    info.innerText = "error: wrong game length value"
    return
  }

  if (bgPictureValue < 0 || bgPictureValue > 5) {
    info.innerText = "error: wrong background image value"
    return
  }

  if (gameSpeed < 1 || gameSpeed > 3) {
    info.innerText = "error: wrong game speed value"
    return
  }

  info.innerText = "please wait"

  const ankanRawImage = await fetch("https://github.com/bth-webtec/teacher/blob/main/kmom06/duck/duck.png", {
    mode: 'no-cors'
  })
  const ankaBlob = await ankanRawImage.blob()
  const ankaImageUrl = URL.createObjectURL(ankaBlob)
  gameData.length = gameLength.value
  console.log(gameData)
  gameData.ankaImageUrl = ankaImageUrl
}

document.addEventListener("DOMContentLoaded", () => {
  info.style.display = false

})