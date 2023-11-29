const bankHolidays = require('./bankHolidays');

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

function getTime(dateTime) {
  function addZero(n) { return (n < 10 ? '0' : '') + n; }

  const hh = dateTime.hour();
  const mm = dateTime.minute();
  const ss = dateTime.second();
  return `${addZero(hh)}:${addZero(mm)}:${addZero(ss)}`;
}

function isInHours({ start, end }) {
  if (isWeekend({ start }) || isBankHoliday({ start })) {
    return false;
  }
  const startTime = getTime(start);
  const endTime = getTime(end);
  return start.day() === end.day() && startTime >= '09:00:00' && endTime <= '17:00:00';
}

module.exports.isWeekend = isWeekend;
module.exports.isBankHoliday = isBankHoliday;
module.exports.isInHours = isInHours;
