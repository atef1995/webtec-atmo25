// In-session highscore list (cleared on page reload)
const highscores = []
const localDuckImage = 'img/duck-png.png'
const localBackgrounds = [
  'photo-1548679847-1d4ff48016c7.avif',
  'photo-1548943544-56e76b7c16d0.avif',
  'photo-1549472579-e133f59d8b23.avif',
  'photo-1549558549-415fe4c37b60.avif'
]

// Global game object
const game = {
  backgroundPicture: 0,
  gameLength: 30,
  gameSpeed: 2,
  duckSize: 100,
  difficulty: 'normal',
  difficultyLabel: 'Normal',
  score: 0,
  timeRemaining: 0,
  isRunning: false,
  duckImage: null,
  backgroundImage: null,
  intervalId: null,
  timerIntervalId: null
}

// DOM elements
const mainContent = document.getElementById('main-content')
const gameSection = document.getElementById('game-section')
const infoText = document.getElementById('info')
const confirmButton = document.getElementById('confirmButton')
const scoreDisplay = document.getElementById('score')
const ankan = document.getElementById('ankan')
const highscoreSection = document.getElementById('highscore-section')

// Pre-select difficulty from URL query param (e.g. duckhunt.html?difficulty=easy)
const params = new URLSearchParams(window.location.search)
const urlDifficulty = params.get('difficulty')
if (urlDifficulty) {
  const radio = document.querySelector(`input[name="difficulty"][value="${urlDifficulty}"]`)
  if (radio) radio.checked = true
}

// Event listener for confirm button
confirmButton.addEventListener('click', setupGame)

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = () => reject(new Error(`Kunde inte ladda bild: ${src}`))
    image.src = src
  })
}

// Setup game: fetch JSON config then load images
async function setupGame() {
  const selectedRadio = document.querySelector('input[name="difficulty"]:checked')
  if (!selectedRadio) {
    alert('Välj en svårighetsgrad!')
    return
  }

  const difficulty = selectedRadio.value

  infoText.textContent = 'Laddar konfiguration...'
  infoText.classList.add('loading')
  confirmButton.disabled = true

  try {
    // Fetch difficulty config from JSON file
    const configResponse = await fetch(`${difficulty}.json`)
    if (!configResponse.ok) throw new Error('Kunde inte ladda konfiguration')
    const config = await configResponse.json()

    // Apply config to game
    game.gameLength = config.gameLength
    game.gameSpeed = config.gameSpeed
    game.duckSize = config.duckSize
    game.backgroundPicture = config.backgroundPicture
    game.difficulty = config.difficulty
    game.difficultyLabel = config.label
    game.score = 0
    game.timeRemaining = game.gameLength

    infoText.textContent = 'Laddar bilder...'

    // Select local background image (0 means random)
    let backgroundIndex = game.backgroundPicture - 1
    if (
      game.backgroundPicture === 0 ||
      backgroundIndex < 0 ||
      backgroundIndex >= localBackgrounds.length
    ) {
      backgroundIndex = Math.floor(Math.random() * localBackgrounds.length)
    }

    game.duckImage = localDuckImage
    game.backgroundImage = `img/backgrounds/${localBackgrounds[backgroundIndex]}`

    await Promise.all([
      preloadImage(game.duckImage),
      preloadImage(game.backgroundImage)
    ])

    infoText.textContent = 'Startar spelet...'
    infoText.classList.remove('loading')

    setTimeout(() => {
      startGame()
    }, 800)

  } catch (error) {
    console.error('Fel:', error)
    infoText.textContent = 'Fel vid laddning. Försök igen.'
    infoText.classList.remove('loading')
    confirmButton.disabled = false
  }
}

// Start game function
function startGame() {
  mainContent.classList.add('hidden')
  gameSection.classList.add('active')
  highscoreSection.style.display = 'none'

  // Apply duck size from config
  ankan.style.width = `${game.duckSize}px`
  ankan.style.height = `${game.duckSize}px`
  ankan.style.display = 'block'

  gameSection.style.backgroundImage = `url('${game.backgroundImage}')`
  ankan.style.backgroundImage = `url('${game.duckImage}')`

  game.isRunning = true
  game.score = 0
  game.timeRemaining = game.gameLength

  // Reset score display position
  scoreDisplay.style.cssText = ''
  updateScore()

  // Countdown timer
  game.timerIntervalId = setInterval(() => {
    game.timeRemaining--
    updateScore()
    if (game.timeRemaining <= 0) {
      endGame()
    }
  }, 1000)

  // Duck movement
  moveDuck()
  game.intervalId = setInterval(moveDuck, game.gameSpeed * 1000)
}

// Update score display
function updateScore() {
  scoreDisplay.textContent = `Poäng: ${game.score} | Tid: ${game.timeRemaining}s`
}

// Move duck to random position within game area
function moveDuck() {
  if (!game.isRunning) return

  const maxX = gameSection.offsetWidth - game.duckSize
  const maxY = gameSection.offsetHeight - game.duckSize

  ankan.style.left = `${Math.floor(Math.random() * maxX)}px`
  ankan.style.top = `${Math.floor(Math.random() * maxY)}px`
}

// Handle duck click
function handleDuckClick() {
  if (!game.isRunning) return
  game.score++
  updateScore()
  moveDuck()
}

ankan.addEventListener('click', handleDuckClick)

// End game: save score and show highscore table
function endGame() {
  game.isRunning = false

  clearInterval(game.intervalId)
  game.intervalId = null
  clearInterval(game.timerIntervalId)
  game.timerIntervalId = null

  ankan.style.display = 'none'
  scoreDisplay.style.display = 'none'

  // Clear previous "current" flags and add new score
  highscores.forEach(h => { h.isCurrent = false })
  highscores.push({ score: game.score, difficulty: game.difficultyLabel, isCurrent: true })
  highscores.sort((a, b) => b.score - a.score)

  showHighscores()

  // Play again button
  const restartButton = document.createElement('button')
  restartButton.textContent = 'Spela Igen'
  restartButton.className = 'confirmButton'
  restartButton.id = 'restartButton'
  restartButton.addEventListener('click', resetGame)
  highscoreSection.appendChild(restartButton)
}

// Render highscore table
function showHighscores() {
  highscoreSection.innerHTML = ''

  const title = document.createElement('h2')
  title.textContent = `Spelet slut! Poäng: ${game.score}`
  highscoreSection.appendChild(title)

  const subtitle = document.createElement('p')
  subtitle.textContent = 'Highscorelista'
  subtitle.style.cssText = 'color:#ff5722;font-size:1.1rem;margin-bottom:12px;'
  highscoreSection.appendChild(subtitle)

  const table = document.createElement('table')
  table.className = 'highscore-table'

  const thead = document.createElement('thead')
  thead.innerHTML = '<tr><th>#</th><th>Poäng</th><th>Svårighetsgrad</th></tr>'
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  highscores.forEach((entry, index) => {
    const tr = document.createElement('tr')
    if (entry.isCurrent) tr.className = 'current-score'
    tr.innerHTML = `<td>${index + 1}</td><td>${entry.score}</td><td>${entry.difficulty}</td>`
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)

  highscoreSection.appendChild(table)
  highscoreSection.style.display = 'flex'
}

// Reset game back to setup screen
function resetGame() {
  highscoreSection.style.display = 'none'
  highscoreSection.innerHTML = ''

  scoreDisplay.style.cssText = ''
  scoreDisplay.style.display = ''

  ankan.style.display = 'block'

  gameSection.classList.remove('active')
  mainContent.classList.remove('hidden')

  infoText.textContent = 'Duckhunt 2'
  confirmButton.disabled = false

  game.duckImage = null
  game.backgroundImage = null
}
