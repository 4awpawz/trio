/**
 * Determines if a number is plural.
 * All numbers greater than or equal to 0 except 1 are considered plural.
 */

module.exports = n => n >= 0 && n !== 1;
