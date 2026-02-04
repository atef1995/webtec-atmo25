// Global game object
const game = {
  backgroundPicture: 0,
  gameLength: 30,
  gameSpeed: 2,
  score: 0,
  timeRemaining: 0,
  isRunning: false,
  duckImage: null,
  backgroundImage: null,
  intervalId: null,
  timerIntervalId: null
};

// DOM elements
const mainContent = document.getElementById('main-content');
const gameSection = document.getElementById('game-section');
const infoText = document.getElementById('info');
const backgroundInput = document.getElementById('background-picture');
const gameLengthInput = document.getElementById('game-length');
const gameSpeedInput = document.getElementById('game-speed');
const confirmButton = document.getElementById('confirmButton');
const scoreDisplay = document.getElementById('score');
const ankan = document.getElementById('ankan');

// Initialize input default values
backgroundInput.value = 0;
gameLengthInput.value = 30;
gameSpeedInput.value = 2;

// Event listener for confirm button
confirmButton.addEventListener('click', setupGame);

// Setup game function
async function setupGame() {
  // Get user input values
  game.backgroundPicture = parseInt(backgroundInput.value);
  game.gameLength = parseInt(gameLengthInput.value);
  game.gameSpeed = parseInt(gameSpeedInput.value);
  game.score = 0;
  game.timeRemaining = game.gameLength;

  // Validate inputs
  if (game.backgroundPicture < 0 || game.backgroundPicture > 5) {
    alert('Background picture must be between 0 and 5');
    return;
  }
  if (![10, 20, 30].includes(game.gameLength)) {
    alert('Game length must be 10, 20, or 30 seconds');
    return;
  }
  if (game.gameSpeed < 1 || game.gameSpeed > 3) {
    alert('Game speed must be between 1 and 3');
    return;
  }

  // Show loading message
  infoText.textContent = 'Loading images...';
  infoText.classList.add('loading');
  confirmButton.disabled = true;

  try {
    // If background is 0, randomize it
    const bgNumber = game.backgroundPicture === 0 
      ? Math.floor(Math.random() * 5) + 1 
      : game.backgroundPicture;

    // Fetch duck image
    const duckUrl = 'https://raw.githubusercontent.com/david-mcneil/webtec/main/assets/images/duckhunt/anka.png';
    const duckResponse = await fetch(duckUrl);
    if (!duckResponse.ok) throw new Error('Failed to fetch duck image');
    const duckBlob = await duckResponse.blob();
    game.duckImage = URL.createObjectURL(duckBlob);

    // Fetch background image
    const bgUrl = `https://raw.githubusercontent.com/david-mcneil/webtec/main/assets/images/duckhunt/${bgNumber}.jpg`;
    const bgResponse = await fetch(bgUrl);
    if (!bgResponse.ok) throw new Error('Failed to fetch background image');
    const bgBlob = await bgResponse.blob();
    game.backgroundImage = URL.createObjectURL(bgBlob);

    // Images loaded successfully
    infoText.textContent = 'Images loaded! Starting game...';
    infoText.classList.remove('loading');

    setTimeout(() => {
      startGame();
    }, 1000);

  } catch (error) {
    console.error('Error loading images:', error);
    infoText.textContent = 'Error loading images. Please try again.';
    infoText.classList.remove('loading');
    confirmButton.disabled = false;
  }
}

// Start game function
function startGame() {
  // Hide setup screen, show game screen
  mainContent.classList.add('hidden');
  gameSection.classList.add('active');

  // Set background image
  gameSection.style.backgroundImage = `url('${game.backgroundImage}')`;

  // Set duck image
  ankan.style.backgroundImage = `url('${game.duckImage}')`;

  // Initialize game state
  game.isRunning = true;
  game.score = 0;
  game.timeRemaining = game.gameLength;

  // Update score display
  updateScore();

  // Start game timer (countdown)
  game.timerIntervalId = setInterval(() => {
    game.timeRemaining--;
    updateScore();

    if (game.timeRemaining <= 0) {
      endGame();
    }
  }, 1000);

  // Start duck movement
  moveDuck();
  game.intervalId = setInterval(moveDuck, game.gameSpeed * 1000);
}

// Update score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${game.score} | Time: ${game.timeRemaining}s`;
}

// Move duck to random position
function moveDuck() {
  if (!game.isRunning) return;

  // Get game section dimensions
  const gameWidth = gameSection.offsetWidth;
  const gameHeight = gameSection.offsetHeight;

  // Get duck dimensions
  const duckWidth = 100; // Set in CSS
  const duckHeight = 100; // Set in CSS

  // Calculate random position ensuring duck stays fully inside
  const maxX = gameWidth - duckWidth;
  const maxY = gameHeight - duckHeight;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  // Position the duck
  ankan.style.left = `${randomX}px`;
  ankan.style.top = `${randomY}px`;
}
