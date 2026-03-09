// Global game object
const game = {
  difficulty: 'normal',
  backgroundPicture: 0,
  gameLength: 30,
  gameSpeed: 2,
  duckSize: 100,
  score: 0,
  timeRemaining: 0,
  isRunning: false,
  duckImage: null,
  backgroundImage: null,
  intervalId: null,
  timerIntervalId: null
}

// Highscore list (resets on page reload)
const highscores = []

// DOM elements
const mainContent = document.getElementById('main-content')
const gameSection = document.getElementById('game-section')
const infoText = document.getElementById('info')
const difficultyForm = document.getElementById('difficulty-form')
const confirmButton = document.getElementById('confirmButton')
const scoreDisplay = document.getElementById('score')
const ankan = document.getElementById('ankan')

// Check URL parameter for pre-selected difficulty
const urlParams = new URLSearchParams(window.location.search)
const urlDifficulty = urlParams.get('difficulty')

if (urlDifficulty && ['easy', 'normal', 'hard'].includes(urlDifficulty)) {
  const radio = difficultyForm.querySelector(`input[value="${urlDifficulty}"]`)
  if (radio) {
    radio.checked = true
  }
}

// Event listener for confirm button
confirmButton.addEventListener('click', setupGame)

// Get selected difficulty from form
function getSelectedDifficulty() {
  const selected = difficultyForm.querySelector('input[name="difficulty"]:checked')
  return selected ? selected.value : 'normal'
}

// Setup game function — fetch config from JSON
async function setupGame() {
  const difficulty = getSelectedDifficulty()
  game.difficulty = difficulty

  // Show loading message
  infoText.textContent = 'Laddar konfiguration...'
  infoText.classList.add('loading')
  confirmButton.disabled = true

  try {
    // Fetch config from JSON file
    const configResponse = await fetch(`${difficulty}.json`)
    if (!configResponse.ok) throw new Error('Failed to fetch config')
    const config = await configResponse.json()

    // Apply config
    game.gameLength = config.gameLength
    game.gameSpeed = config.gameSpeed
    game.duckSize = config.duckSize
    game.backgroundPicture = config.backgroundPicture
    game.score = 0
    game.timeRemaining = game.gameLength

    infoText.textContent = 'Laddar bilder...'

    // If background is 0, randomize it
    const bgNumber = game.backgroundPicture === 0
      ? Math.floor(Math.random() * 5) + 1
      : game.backgroundPicture

    // Fetch duck image
    const duckUrl = 'https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/duck/duck.png'
    const duckResponse = await fetch(duckUrl)
    if (!duckResponse.ok) throw new Error('Failed to fetch duck image')
    const duckBlob = await duckResponse.blob()
    game.duckImage = URL.createObjectURL(duckBlob)

    // Fetch background image
    const bgUrl = `https://raw.githubusercontent.com/bth-webtec/teacher/main/kmom06/backgrounds/${bgNumber}.jpg`
    const bgResponse = await fetch(bgUrl)
    if (!bgResponse.ok) throw new Error('Failed to fetch background image')
    const bgBlob = await bgResponse.blob()
    game.backgroundImage = URL.createObjectURL(bgBlob)

    // Images loaded successfully
    infoText.textContent = 'Redo! Startar spelet...'
    infoText.classList.remove('loading')

    setTimeout(() => {
      startGame()
    }, 1000)

  } catch (error) {
    console.error('Error loading game:', error)
    infoText.textContent = 'Fel vid laddning. Försök igen.'
    infoText.classList.remove('loading')
    confirmButton.disabled = false
  }
}

// Start game function
function startGame() {
  // Hide setup screen, show game screen
  mainContent.classList.add('hidden')
  gameSection.classList.add('active')

  // Set background image
  gameSection.style.backgroundImage = `url('${game.backgroundImage}')`

  // Set duck image and size from config
  ankan.style.backgroundImage = `url('${game.duckImage}')`
  ankan.style.width = `${game.duckSize}px`
  ankan.style.height = `${game.duckSize}px`

  // Initialize game state
  game.isRunning = true
  game.score = 0
  game.timeRemaining = game.gameLength

  // Update score display
  updateScore()

  // Start game timer (countdown)
  game.timerIntervalId = setInterval(() => {
    game.timeRemaining--
    updateScore()

    if (game.timeRemaining <= 0) {
      endGame()
    }
  }, 1000)

  // Start duck movement
  moveDuck()
  game.intervalId = setInterval(moveDuck, game.gameSpeed * 1000)
}

// Update score display
function updateScore() {
  const difficultyLabels = { easy: 'Lätt', normal: 'Normal', hard: 'Svår' }
  const label = difficultyLabels[game.difficulty] || game.difficulty
  scoreDisplay.textContent = `Poäng: ${game.score} | Tid: ${game.timeRemaining}s | ${label}`
}

// Move duck to random position
function moveDuck() {
  if (!game.isRunning) return

  // Get game section dimensions
  const gameWidth = gameSection.offsetWidth
  const gameHeight = gameSection.offsetHeight

  // Get duck dimensions from config
  const duckWidth = game.duckSize
  const duckHeight = game.duckSize

  // Calculate random position ensuring duck stays fully inside
  const maxX = gameWidth - duckWidth
  const maxY = gameHeight - duckHeight

  const randomX = Math.floor(Math.random() * maxX)
  const randomY = Math.floor(Math.random() * maxY)

  // Position the duck
  ankan.style.left = `${randomX}px`
  ankan.style.top = `${randomY}px`
}

// Handle duck click
function handleDuckClick() {
  if (!game.isRunning) return

  // Increment score
  game.score++
  updateScore()

  // Move duck immediately after being clicked
  moveDuck()
}

// Add click event listener to duck
ankan.addEventListener('click', handleDuckClick)

// End game function
function endGame() {
  // Stop the game
  game.isRunning = false

  // Clear intervals
  if (game.intervalId) {
    clearInterval(game.intervalId)
    game.intervalId = null
  }
  if (game.timerIntervalId) {
    clearInterval(game.timerIntervalId)
    game.timerIntervalId = null
  }

  // Hide duck
  ankan.style.display = 'none'

  // Save to highscore list
  highscores.push({
    score: game.score,
    difficulty: game.difficulty,
    date: new Date().toLocaleTimeString('sv-SE')
  })

  // Sort highscores by score descending
  highscores.sort((a, b) => b.score - a.score)

  // Show game over with highscore table
  showGameOver()
}

// Reset game function
function resetGame() {
  // Remove restart button if it exists
  const restartButton = gameSection.querySelector('.confirmButton')
  if (restartButton) {
    restartButton.remove()
  }

  // Reset score display styling
  scoreDisplay.style.fontSize = '2rem'
  scoreDisplay.style.top = '20px'
  scoreDisplay.style.right = '20px'
  scoreDisplay.style.left = 'auto'
  scoreDisplay.style.transform = 'none'

  // Show duck again
  ankan.style.display = 'block'

  // Hide game section, show setup
  gameSection.classList.remove('active')
  mainContent.classList.remove('hidden')

  // Reset form
  infoText.textContent = 'Duckhunt 2'
  confirmButton.disabled = false

  // Clean up blob URLs
  if (game.duckImage) {
    URL.revokeObjectURL(game.duckImage)
    game.duckImage = null
  }
  if (game.backgroundImage) {
    URL.revokeObjectURL(game.backgroundImage)
    game.backgroundImage = null
  }
}

// Show game over screen with highscore table
function showGameOver() {
  const difficultyLabels = { easy: 'Lätt', normal: 'Normal', hard: 'Svår' }

  // Create overlay
  const overlay = document.createElement('div')
  overlay.className = 'game-over-overlay'
  overlay.id = 'game-over-overlay'

  // Game over title
  const title = document.createElement('h2')
  title.className = 'game-over-title'
  title.textContent = 'Spelet är slut!'
  overlay.appendChild(title)

  // Final score
  const scoreText = document.createElement('p')
  scoreText.className = 'game-over-score'
  scoreText.textContent = `Din poäng: ${game.score} (${difficultyLabels[game.difficulty]})`
  overlay.appendChild(scoreText)

  // Highscore table
  const table = document.createElement('table')
  table.className = 'highscore-table'

  const thead = document.createElement('thead')
  thead.innerHTML = '<tr><th>#</th><th>Poäng</th><th>Nivå</th><th>Tid</th></tr>'
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  highscores.forEach((entry, index) => {
    const row = document.createElement('tr')
    if (entry.score === game.score && entry.date === highscores.find(h => h.score === game.score && h.date === entry.date).date) {
      row.className = index === highscores.findIndex(h => h === entry) ? '' : ''
    }
    const label = difficultyLabels[entry.difficulty] || entry.difficulty
    row.innerHTML = `<td>${index + 1}</td><td>${entry.score}</td><td>${label}</td><td>${entry.date}</td>`

    // Highlight the latest entry
    if (entry === highscores.find(h => h.score === game.score && h.date === entry.date) && !row.classList.contains('highlighted')) {
      row.classList.add('current-score')
    }
    tbody.appendChild(row)
  })
  table.appendChild(tbody)
  overlay.appendChild(table)

  // Restart button
  const restartBtn = document.createElement('button')
  restartBtn.className = 'confirmButton'
  restartBtn.textContent = 'Spela Igen'
  restartBtn.addEventListener('click', () => {
    overlay.remove()
    resetGame()
  })
  overlay.appendChild(restartBtn)

  gameSection.appendChild(overlay)
}
