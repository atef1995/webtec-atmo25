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
