/**
 * This file contains the functions you shall implement to solve the lab.
 * Implement them one by one and check if they pass all tests.
 * 
 * Execute the lab in the browser through lab.html and review the output in the 
 * console, or execute the lab through node using `node lab` in the terminal.
 */



/**
 * Create an array that holds the items 1, 2, 3, 42, "hello".
 *
 * @returns {Array} the resulting array.
 */
export function createArray() {
  return [1, 2, 3, 42, "hello"]
}



/**
 * Returns the length of an array.
 *
 * @param {Array} arr The array to use.
 * @returns {number} The length of the array.
 */
export function arrayLength(arr) {
  return arr.length
}



/**
 * Add the two variables to the end of the array and return the array.
 * 
 * @param {Array} arr The array to use.
 * @param {*} item1 The first variable to add.
 * @param {*} item2 The second variable to add.
 * 
 * @returns {Array} The resulting array.
 */
export function addToArray(arr, item1, item2) {
  arr.push(item1)
  arr.push(item2)
  return arr
}



/**
 * Returns the nth element in the array.
 *
 * @param {number} n The index of the element to retrieve.
 * @param {Array} arr The array to use.
 * @returns {*} The nth element in the array.
 */
export function nthElement(arr, n) {
  return arr[n]
}



/**
 * Use Array.slice() to extract the 2nd and 3rd element from the array.
 * Add the elements to the end of the array and return it. 
 * Hint: Array.slice()
 *
 * @param {Array} arr The array to use.
 * @returns {Array} The array with the 2nd and 3rd element in the end.
 */
export function sliceArray(arr) {
  const sliced = arr.slice(1, 3)
  return [...arr, ...sliced]
}



/**
 * Use Array.splice() to extract the 1st to 3rd element from the array.
 * Add the elements to the end of the array and return it. 
 * Hint: Array.splice()
 *
 * @param {Array} arr The array to use.
 * @returns {Array} The array with the 1st to 3rd element in the end.
 */
export function spliceArray(arr) {
  const spliced = arr.splice(0, 3)
  return [...arr, ...spliced]
}



/**
 * Return the largest number in the array.
 * Hint: Math.max()
 * 
 * @param {Array} arr The array to use.
 * @returns {number} The largest number in the array.
 */
export function largest(arr) {
  return Math.max(...arr)
}



/**
 * Return the average number of the array.
 * 
 * @param {Array} arr The array to use.
 * @returns {number} The average.
 */
export function average(arr) {
  const sum = arr.reduce((acc, curr) => acc + curr, 0)
  return sum / arr.length
}



/**
 * Return the two arrays as one concatinated (merged) array.
 * 
 * @param {Array} arr1 The first array to use.
 * @param {Array} arr2 The second array to use.
 * 
 * @returns {Array} The resulting array.
 */
export function mergeArrays(arr1, arr2) {
  return [...arr1, ...arr2]
}




/**
 * Return an array without duplicates.
 * 
 * @param {Array} arr The array to use.
 * @returns {Array} The resulting array without duplicates.
 */
export function removeDuplicates(arr) {
  return [...new Set(arr)]
}



/**
 * Return a string containing the first and the last items in the array "arr". Separate the items with a hyphen (-).
 * 
 * @param {Array} arr The array to use.
 * @returns {string} The resulting string.
 */
export function firstLast(arr) {
  return `${arr[0]}-${arr[arr.length - 1]}`
}



/**
 * Return the index of the passed item. If the item do not exist, return -1.
 * Hint: Array.indexOf()
 * 
 * @param {Array} arr The array to use.
 * @param {*} item The item so use.
 * 
 * @returns {number} The index.
 */
export function findindex(arr, item) {
  return arr.indexOf(item)
}