// DOM element references
const mainContent = document.getElementById("main-content")
const gameLength = document.getElementById("game-length")
const bgPicture = document.getElementById("background-picture")
const gameSpeed = document.getElementById("game-speed")
const info = document.getElementById("info")
const gameSection = document.getElementById("game-section")
const confirmButton = document.getElementById("confirmButton")
const ankan = document.getElementById("ankan")

// Global game state object
const gameData = {
  length: 0,           // Game duration in seconds
  speed: 0,            // Duck movement interval in seconds
  backgroundImageUrl: null,
  duckImageUrl: null,
  score: 0,            // Player's score
  timeRemaining: 0,    // Time left in the game
  isRunning: false,    // Game running state
  intervalId: null,    // Interval for duck repositioning
  startTime: null      // Game start timestamp
}

/**
 * Sets up the game configuration based on user input
 * Validates parameters and initializes gameData object
 * @returns {Object} Configuration object with validated settings or null if invalid
 */
const setupGame = () => {
  const gameLengthValue = parseInt(gameLength.value)
  let bgPictureValue = parseInt(bgPicture.value)
  const gameSpeedValue = parseInt(gameSpeed.value)

  // Validate game length (must be 10, 30, or 60 seconds)
  if (gameLengthValue !== 10 && gameLengthValue !== 30 && gameLengthValue !== 60) {
    info.style.display = ''
    info.innerText = "error: wrong game length value (must be 10, 30, or 60)"
    return null
  }

  // Validate background image selection (0-5)
  if (bgPictureValue < 0 || bgPictureValue > 5) {
    info.style.display = ''
    info.innerText = "error: wrong background image value (must be 0-5)"
    return null
  }

  // Handle random background selection (0 = random)
  if (bgPictureValue === 0) {
    bgPictureValue = Math.floor(Math.random() * 5) + 1
  }

  // Validate game speed (1-3)
  if (gameSpeedValue < 1 || gameSpeedValue > 3) {
    info.style.display = ''
    info.innerText = "error: wrong game speed value (must be 1-3)"
    return null
  }

  // Return validated configuration
  return {
    length: gameLengthValue,
    speed: gameSpeedValue,
    backgroundId: bgPictureValue
  }
}

/**
 * Starts the duck hunt game with user-selected settings
 * Validates game parameters and loads game assets as blobs
 */
const startGame = async () => {
  // Setup and validate game configuration
  const config = setupGame()

  if (!config) {
    return // Validation failed, error message already displayed
  }

  // Show loading state
  info.style.display = ''
  info.innerText = "loading game..."

  try {
    // Fetch duck image as blob
    const duckResponse = await fetch("https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/duck/duck.png")
    const duckImageUrl = await getImageUrl(duckResponse)

    // Fetch background image as blob
    const backgroundResponse = await fetch(`https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/backgrounds/${config.backgroundId}.jpg`)
    const backgroundImageUrl = await getImageUrl(backgroundResponse)

    // Store game configuration in global gameData object
    gameData.length = config.length
    gameData.speed = config.speed
    gameData.duckImageUrl = duckImageUrl
    gameData.backgroundImageUrl = backgroundImageUrl
    gameData.score = 0
    gameData.timeRemaining = config.length
    gameData.isRunning = true
    gameData.startTime = Date.now()

    // Set up UI
    ankan.innerHTML = `<img src="${duckImageUrl}" alt="duck">`
    gameSection.style.backgroundImage = `url(${backgroundImageUrl})`
    mainContent.style.display = "none"
    info.style.display = "none"

    // Position duck initially
    randomiseDuckPlacement()

    // Set up interval for duck repositioning based on speed
    gameData.intervalId = setInterval(() => {
      randomiseDuckPlacement()
    }, config.speed * 1000)

    // Start game mechanics
    gameLoop()
  } catch (error) {
    info.innerText = "error: failed to load game assets"
    console.error("Failed to load images:", error)
  }
}

/**
 * Main game loop that manages timing and game state
 * Checks if time has run out and calls endGame if necessary
 */
const gameLoop = () => {
  if (!gameData.isRunning) return

  // Calculate time remaining
  const elapsedTime = (Date.now() - gameData.startTime) / 1000
  gameData.timeRemaining = gameData.length - elapsedTime

  // Check if game time has ended
  if (gameData.timeRemaining <= 0) {
    endGame()
    return
  }

  // Continue game loop
  requestAnimationFrame(gameLoop)
}

/**
 * Positions the duck randomly within the viewport
 * Ensures the entire duck stays within visible bounds
 */
const randomiseDuckPlacement = () => {
  // Get viewport and duck dimensions
  const viewportWidth = gameSection.offsetWidth
  const viewportHeight = gameSection.offsetHeight
  const duckWidth = ankan.offsetWidth
  const duckHeight = ankan.offsetHeight

  // Calculate random position ensuring duck stays fully visible
  const maxX = viewportWidth - duckWidth
  const maxY = viewportHeight - duckHeight

  const randomX = Math.floor(Math.random() * maxX)
  const randomY = Math.floor(Math.random() * maxY)

  ankan.style.left = randomX + 'px'
  ankan.style.top = randomY + 'px'
}

/**
 * Handles duck click events
 * Increments score and repositions duck
 */
const handleDuckClick = () => {
  if (!gameData.isRunning) return

  // Increment score
  gameData.score++

  // Reposition duck immediately after hit
  randomiseDuckPlacement()
}

/**
 * Ends the game and displays final score
 * Clears intervals, stops game loop, and shows restart option
 */
const endGame = () => {
  // Stop game state
  gameData.isRunning = false

  // Clear duck repositioning interval
  if (gameData.intervalId) {
    clearInterval(gameData.intervalId)
    gameData.intervalId = null
  }

  // Hide duck
  ankan.style.display = 'none'

  // Reset background
  gameSection.style.backgroundImage = 'none'

  // Display final score
  mainContent.style.display = 'flex'
  info.style.display = ''
  info.innerHTML = `Game Over!<br>Your score: ${gameData.score}<br><button id="restart-button">Play Again</button>`

  // Add restart button listener
  const restartButton = document.getElementById('restart-button')
  restartButton.addEventListener('click', () => {
    // Reset UI
    info.style.display = 'none'
    ankan.style.display = 'block'

    // Reset form values
    gameLength.value = ''
    bgPicture.value = ''
    gameSpeed.value = ''

    // Show setup form
    mainContent.style.display = 'flex'
  })
}

// Set up duck click event listener
ankan.addEventListener('click', handleDuckClick)

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


document.addEventListener("DOMContentLoaded", () => {
  info.style.display = "none"

})