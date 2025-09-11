/**
 * This file contains the functions you shall implement to solve the lab.
 * Implement them one by one and check if they pass all tests.
 * 
 * Execute the lab in the browser through lab.html and review the output in the 
 * console, or execute the lab through node using `node lab` in the terminal.
 */



/**
 * Returns a boolean weither the incoming value is larger than 42.
 *
 * @param {number} value The value to use.
 * @returns {boolean} true the incoming value is larger than 42, else false.
 */
export function isLarger(value) {
  return value > 42
}



/**
 * Returns "Positive" if the incoming value is positive, "Negative" if it is negative and "Neither" if it is zero.
 *
 * @param {number} value The value to use.
 * @returns {string} The answering string.
 */
export function isPositiveNegative(value) {
  return value > 0 ? "Positive" : value < 0 ? "Negative" : "Neither"
}



/**
 * Returns "Odd" if the incoming value is odd and "Even" if it is even.
 *
 * @param {number} value The value to use.
 * @returns {string} The answering string.
 */
export function isOddEven(value) {
  return value % 2 === 0 ? "Even" : "Odd"
}



/**
 * Returns "Black Jack" if the total sum is 21. If the sum is larger, return "Busted" and if it is lower, return "Draw".
 *
 * @param {number} value1 The first value to use.
 * @param {number} value2 The second value to use.
 * @param {number} value3 The third value to use.
 * @returns {string} The answering string.
 */
export function blackJack(value1, value2, value3) {
  const sum = value1 + value2 + value3
  if (sum === 21) {
    return "Black Jack"
  } else if (sum > 21) {
    return "Busted"
  }
  return "Draw"
}



/**
 * Returns the specific grade for a test score.
 * Score equal or higher than 90: A
 * Score equal or higher than 80: B
 * Score equal or higher than 70: C
 * Score lower than 70: F
 *
 * @param {number} score The score to use.
 * @returns {string} The answering grade.
 */
export function gradeChecker(score) {
  if (score >= 90) {
    return "A"
  } else if (score >= 80 && score < 90) {
    return "B"
  } else if (score >= 70 && score < 80) {
    return "C"
  }
  return "F"
}



/**
 * Returns a string based on the incoming temperature.
 * Temperature below 10: "Cold"
 * Temperature between or equal to 10 and 25: "Warm"
 * Temperature above 25: "Hot"
 *
 * @param {number} temp The temperature to use.
 * @returns {string} The answering string.
 */
export function temperature(temp) {
  if (temp < 10) {
    return "Cold"
  } else if (temp >= 10 && temp <= 25) {
    return "Warm"
  } else {
    return "Hot"
  }
}



/**
 * Returns the action based on the incoming traffic light color.
 * If the color is "Red", return "Stop"
 * If the color is "Yellow", return "Wait"
 * If the color is "Green", return "Go"
 * Otherwise return "Invalid color"
 * 
 * The check should not be case-sensitive.
 *
 * @param {number} color The color to use.
 * @returns {string} The answering string.
 */
export function trafficlight(color) {
  const lowerColor = color.toLowerCase()
  if (lowerColor === "red") {
    return "Stop"
  } else if (lowerColor === "yellow") {
    return "Wait"
  } else if (lowerColor === "green") {
    return "Go"
  } else {
    return "Invalid color"
  }
}



/**
 * Returns a boolean weither the incoming number is equal to the integer representation of the incoming string.
 *
 * @param {number} value The number to use.
 * @param {string} text The string to use.
 * @returns {boolean} The answering boolean.
 */
export function intRepresentation(value, text) {
  return value === parseInt(text)
}



/**
 * Returns "Fizz", "Buzz", "FizzBuzz" or the passed value.
 * This is a code exercise called "FizzBuzz".
 * If the incoming number is divisible by 3, return "Fizz". 
 * If the incoming number is divisible by 5, return "Buzz". 
 * If the incoming number is divisible by 3 and 5, return "FizzBuzz".
 * Otherwise you return the actual number. 
 *
 * Read more: https://en.wikipedia.org/wiki/Fizz_buzz
 * 
 * @param {number} value The value to use.
 * @returns {string|number} The answering result.
 */
export function fizzBuzz(value) {
  if ((value % 3 === 0) && (value % 5 === 0)) {
    return "FizzBuzz"
  } else if (value % 5 === 0) {
    return "Buzz"
  } else if (value % 3 === 0) {
    return "Fizz"
  }
  return value
}



/**
 * Returns the action based on the incoming traffic light color, using the switch statement.
 * If the color is "Red", return "Stop"
 * If the color is "Yellow", return "Wait"
 * If the color is "Green", return "Go"
 * Otherwise return "Invalid color"
 * 
 * The check should not be case-sensitive.
 *
 * @param {number} color The color to use.
 * @returns {string} The answering string.
 */
export function trafficlightSwitch(color) {
  switch (color.toLowerCase()) {
  case "red":
    return "Stop"
  case "yellow":
    return "Wait"
  case "green":
    return "Go"
  default:
    return "Invalid color"
  }
}



/**
 * Returns the result from a calculation on the incoming values, using the switch statement.
 * Default 
 *
 * @param {number} value1 The first value to use.
 * @param {number} value2 The second value to use.
 * @param {string} op The operator to use (+, -, *, /, %).
 * @param {boolean} reverse Boolean if values should be reversed so value2 is the first value to use.
 * @returns {number} The result.
 */
export function calculator(value1, value2, op, reverse = false) {
  if (reverse) {
    let temp = value1
    value1 = value2
    value2 = temp
  }
  switch (op) {
  case "+":
    return value1 + value2
  case "-":
    return value1 - value2
  case "/":
    return value1 / value2
  case "*":
    return value1 * value2
  case "%":
    return value1 % value2
  default:
    return -1
  }
}
