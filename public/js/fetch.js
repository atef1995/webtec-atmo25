// DOM element references
const yearSelector = document.getElementById('year-selector')
const tableBody = document.getElementById('table-body')
const loadingElement = document.getElementById('loading')
const errorMessage = document.getElementById('error-message')

// Countries to fetch data for
const countries = [
  { name: 'Sweden', filename: 'sweden' },
  { name: 'Norway', filename: 'norway' },
  { name: 'Denmark', filename: 'denmark' }
]

// Base URL for data files
const BASE_URL = 'https://raw.githubusercontent.com/bth-webtec/teacher/refs/heads/main/kmom05/data'

/**
 * Initializes the year selector with years from 1900 to 2019
 */
const initializeYearSelector = () => {
  const startYear = 1900
  const endYear = 2019

  // Populate year selector with options
  for (let year = endYear; year >= startYear; year--) {
    const option = document.createElement('option')
    option.value = year
    option.textContent = year
    yearSelector.appendChild(option)
  }
}

/**
 * Fetches CO2 data for a specific country
 * @param {string} countryFilename - The filename of the country data
 * @returns {Promise<Object>} The country data object
 */
const fetchCountryData = async (countryFilename) => {
  const url = `${BASE_URL}/${countryFilename}.json`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${countryFilename}`)
  }

  return await response.json()
}

/**
 * Finds data for a specific year in the country's data array
 * @param {Array} data - Array of yearly data objects
 * @param {number} year - The year to search for
 * @returns {Object|null} The data object for the specified year or null if not found
 */
const findYearData = (data, year) => {
  return data.find(entry => entry.year === year) || null
}

/**
 * Formats a number with thousands separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A'
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

/**
 * Determines winner for each metric and returns comparison results
 * @param {Array} countriesData - Array of country data objects
 * @returns {Object} Object containing winner indices for each metric
 */
const determineWinners = (countriesData) => {
  const winners = {
    population: { index: -1, value: -Infinity, higher: true },
    co2: { index: -1, value: Infinity, higher: false }, // Lower is better
    co2PerCapita: { index: -1, value: Infinity, higher: false }, // Lower is better
    gdp: { index: -1, value: -Infinity, higher: true }
  }

  countriesData.forEach((countryData, index) => {
    // Population - higher is tracked
    if (countryData.population > winners.population.value) {
      winners.population.value = countryData.population
      winners.population.index = index
    }

    // CO2 emissions - lower is better
    if (countryData.co2 !== null && countryData.co2 < winners.co2.value) {
      winners.co2.value = countryData.co2
      winners.co2.index = index
    }

    // CO2 per capita - lower is better
    if (countryData.co2PerCapita !== null && countryData.co2PerCapita < winners.co2PerCapita.value) {
      winners.co2PerCapita.value = countryData.co2PerCapita
      winners.co2PerCapita.index = index
    }

    // GDP - higher is better
    if (countryData.gdp !== null && countryData.gdp > winners.gdp.value) {
      winners.gdp.value = countryData.gdp
      winners.gdp.index = index
    }
  })

  return winners
}

/**
 * Displays the fetched data in the table
 * @param {Array} countriesData - Array of country data objects with their names
 * @param {number} year - The selected year
 */
const displayData = (countriesData, year) => {
  // Clear existing table data
  tableBody.innerHTML = ''

  // Determine winners for each metric
  const winners = determineWinners(countriesData)

  // Create table rows for each country
  countriesData.forEach((countryData, index) => {
    const row = document.createElement('tr')

    // Country name
    const countryCell = document.createElement('td')
    countryCell.textContent = countryData.country
    row.appendChild(countryCell)

    // Population
    const populationCell = document.createElement('td')
    populationCell.textContent = formatNumber(countryData.population)
    if (winners.population.index === index) {
      populationCell.classList.add('winner')
    }
    row.appendChild(populationCell)

    // CO2 emissions
    const co2Cell = document.createElement('td')
    co2Cell.textContent = formatNumber(countryData.co2)
    if (winners.co2.index === index && countryData.co2 !== null) {
      co2Cell.classList.add('winner')
    }
    row.appendChild(co2Cell)

    // CO2 per capita
    const co2PerCapitaCell = document.createElement('td')
    co2PerCapitaCell.textContent = formatNumber(countryData.co2PerCapita)
    if (winners.co2PerCapita.index === index && countryData.co2PerCapita !== null) {
      co2PerCapitaCell.classList.add('winner')
    }
    row.appendChild(co2PerCapitaCell)

    // GDP
    const gdpCell = document.createElement('td')
    gdpCell.textContent = formatNumber(countryData.gdp)
    if (winners.gdp.index === index && countryData.gdp !== null) {
      gdpCell.classList.add('winner')
    }
    row.appendChild(gdpCell)

    tableBody.appendChild(row)
  })
}

/**
 * Main function to fetch and display data for all countries for a selected year
 * Triggered when user selects a year from the dropdown
 */
const fetchData = async () => {
  const selectedYear = parseInt(yearSelector.value)

  // Validate year selection
  if (!selectedYear || selectedYear < 1900 || selectedYear > 2019) {
    errorMessage.textContent = 'Please select a valid year between 1900 and 2019'
    errorMessage.style.display = 'block'
    return
  }

  // Hide error message and show loading
  errorMessage.style.display = 'none'
  loadingElement.style.display = 'block'
  tableBody.innerHTML = ''

  try {
    // Fetch data for all countries in parallel
    const fetchPromises = countries.map(country => fetchCountryData(country.filename))
    const allCountryData = await Promise.all(fetchPromises)

    // Extract data for the selected year from each country
    const countriesData = allCountryData.map((countryData, index) => {
      const yearData = findYearData(countryData.data, selectedYear)

      return {
        country: countries[index].name,
        population: yearData?.population || null,
        co2: yearData?.co2 || null,
        co2PerCapita: yearData?.co2_per_capita || null,
        gdp: yearData?.gdp || null
      }
    })

    // Display the data in the table
    displayData(countriesData, selectedYear)

    // Hide loading indicator
    loadingElement.style.display = 'none'
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error)
    errorMessage.textContent = `Error loading data: ${error.message}`
    errorMessage.style.display = 'block'
    loadingElement.style.display = 'none'
  }
}

/**
 * Initialize the application
 */
const init = () => {
  // Populate year selector
  initializeYearSelector()

  // Add event listener for year selection
  yearSelector.addEventListener('change', fetchData)
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init)
