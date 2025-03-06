/**
 * Retrieves an array of numbers by splitting a number into multiple parts.
 *
 * @param {number} num - The number to split.
 * @param {number} parts - The number of parts to split the number into.
 * @returns {number[]} An array of numbers.
 */
const splitNumber = (num = 1, parts = 1): number[] => {
  const n = Math.floor(num / parts);
  const numbers: number[] = [];

  for (let i = 0; i < parts; i++) {
    numbers.push(n);
  }

  if (numbers.reduce((a, b) => a + b, 0) === num) {
    return numbers;
  }

  for (let i = 0; i < parts; i++) {
    numbers[i]++;
    if (numbers.reduce((a, b) => a + b, 0) === num) {
      return numbers;
    }
  }

  return numbers;
};

export default splitNumber;
