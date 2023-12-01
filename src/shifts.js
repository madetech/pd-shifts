const bankHolidays = require('./bankHolidays');

function isWeekend({ start }) {
  const startDay = start.day();

  // 6 = Saturday, 0 = Sunday
  return startDay === 6 || startDay === 0;
}

function isBankHoliday({ start }) {
  const formattedDate = start.format('YYYY-MM-DD');

  return bankHolidays.includes(formattedDate);
}

function formatTimeComponent(timeComponent) {
  return timeComponent < 10 ? `0${timeComponent}` : timeComponent.toString();
}

function formattedTime(dateTime) {
  const hours = formatTimeComponent(dateTime.hour());
  const minutes = formatTimeComponent(dateTime.minute());
  const seconds = formatTimeComponent(dateTime.second());

  return `${hours}:${minutes}:${seconds}`;
}

function isInHours({ start, end }) {
  if (isWeekend({ start }) || isBankHoliday({ start })) {
    return false;
  }
  const startTime = formattedTime(start);
  const endTime = formattedTime(end);
  return start.day() === end.day() && startTime >= '09:00:00' && endTime <= '17:00:00';
}

module.exports.isWeekend = isWeekend;
module.exports.isBankHoliday = isBankHoliday;
module.exports.isInHours = isInHours;
