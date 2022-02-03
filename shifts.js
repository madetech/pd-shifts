const bankHolidays = require('./bankHolidays.js');

function isWeekend(shift) {
  const start = new Date(shift.start);
  const startDay = start.getDay();

  // If the shift starts on a Saturday or Sunday, it's a weekend shift
  return startDay === 6 || startDay === 0;
}

function isBankHoliday(shift) {
  const holidays = bankHolidays;
  const startDate = new Date(shift.start);
  const start = startDate.toISOString().split("T")[0];

  return holidays.indexOf(start) >= 0;
}

module.exports.isWeekend = isWeekend;
module.exports.isBankHoliday = isBankHoliday;
