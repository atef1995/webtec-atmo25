const mainContent = document.getElementById("main-content")
const gameLength = document.getElementById("game-length")
const bgPicture = document.getElementById("background-picture")
const gameSpeed = document.getElementById("game-speed")
const info = document.getElementById("info")
const gameSection = document.getElementById("game-section")
const confirmButton = document.getElementById("confirmButton")


/**
 * Starts the duck hunt game with user-selected settings
 * Validates game parameters and loads game assets as blobs
 */
const startGame = async () => {
  const gameLengthValue = parseInt(gameLength.value)
  const bgPictureValue = parseInt(bgPicture.value)
  const gameSpeedValue = parseInt(gameSpeed.value)

  info.style.display = ''

  // Validate game length (must be 10, 30, or 60 seconds)
  if (gameLengthValue !== 10 && gameLengthValue !== 30 && gameLengthValue !== 60) {
    info.innerText = "error: wrong game length value"
    return
  }

  // Validate background image selection (0-5)
  if (bgPictureValue < 0 || bgPictureValue > 5) {
    info.innerText = "error: wrong background image value"
    return
  }

  // Validate game speed (1-3)
  if (gameSpeedValue < 1 || gameSpeedValue > 3) {
    info.innerText = "error: wrong game speed value"
    return
  }

  info.innerText = "loading game..."

  try {
    // Fetch duck image as blob - removed no-cors to allow blob reading
    const duckResponse = await fetch("https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/duck/duck.png")
    const duckImageUrl = await getImageUrl(duckResponse)

    // Fetch background image as blob
    const backgroundResponse = await fetch(`https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/backgrounds/${bgPictureValue}.jpg`)
    const backgroundImageUrl = await getImageUrl(backgroundResponse)

    // Store game configuration
    gameData.length = gameLengthValue
    gameData.speed = gameSpeedValue
    gameData.duckImageUrl = duckImageUrl
    gameData.backgroundImageUrl = backgroundImageUrl

    // Set background image for game section
    gameSection.style.backgroundImage = `url(${backgroundImageUrl})`

    info.style.display = "none"
    console.log(gameData)
  } catch (error) {
    info.innerText = "error: failed to load game assets"
    console.error("Failed to load images:", error)
  }
}


/**
 * Converts a fetch response to a blob URL
 * @param {Response} response - The fetch response containing image data
 * @returns {Promise<string>} A blob URL that can be used in img src or CSS
 */
const getImageUrl = async (response) => {
  const imageBlob = await response.blob()
  const imageUrl = URL.createObjectURL(imageBlob)
  return imageUrl
}

confirmButton.addEventListener("click", () => startGame())
const gameData = {
}

document.addEventListener("DOMContentLoaded", () => {
  info.style.display = "none"

})