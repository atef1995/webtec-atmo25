// Set current year in copyright notice
document.addEventListener('DOMContentLoaded', function () {
  const currentYear = new Date().getFullYear()
  const yearElement = document.getElementById('current-year')
  if (yearElement) {
    yearElement.textContent = currentYear
  }
})

console.log('Hello from hello.js!')