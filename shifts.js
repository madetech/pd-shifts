const bankHolidays = require('./bankHolidays.js');

function isWeekend({ start }) {
  const startDay = start.day();

  // If the shift starts on a Saturday or Sunday, it's a weekend shift
  return startDay === 6 || startDay === 0;
}

function isBankHoliday({ start }) {
  const holidays = bankHolidays;
  const startString = start.format('YYYY-MM-DD');

  return holidays.indexOf(startString) >= 0;
}

module.exports.isWeekend = isWeekend;
module.exports.isBankHoliday = isBankHoliday;
