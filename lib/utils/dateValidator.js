const isYearValid = (y) => {
    return typeof (y) === "number";
};

const isMonthValid = (m) => {
    if (typeof (m) !== "number") {
        return false;
    }
    return m >= 1 && m <= 12;
};

const isLeapYear = y => {
    // If year is not evenly divisible by 4 it isn"t a leap year
    if (y % 4) {
        return false;
    }
    // If year is evenly divisible by 4 and is not
    // evenly divisible by 100 it is a leap year
    if (y % 100) {
        return true;
    }
    // If a year is evenly divisible by 4 and it is evenly divisible
    // by 100 and it is evenly divisible by 400 it is a leap year
    return (y % 400 === 0);
};

const isDayValid = (y, m, d) => {
    var daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Validate numerics and min day range
    if (typeof (d) !== "number" || d < 1) {
        return false;
    }
    // Validate for leap year (2/29)
    if (m === 2 && d === 29) {
        return isLeapYear(y);
    }
    // Validate for all other dates
    if (d <= daysInMonths[m - 1]) {
        return true;
    }
    return false;
};

module.exports = (m, d, y) => {
    return (isYearValid(y) && isMonthValid(m) && isDayValid(y, m, d));
};