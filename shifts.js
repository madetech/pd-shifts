function isWeekend(shift) {
  const start = new Date(shift.start);
  const startDay = start.getDay();

  // If the shift starts on a Saturday or Sunday, it's a weekend shift
  return startDay === 6 || startDay === 0;
}

module.exports.isWeekend = isWeekend;
