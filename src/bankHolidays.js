const fs = require('fs');
const bankHolidayJson = require('../data/bank-holidays.json');

const bankHolidays = bankHolidayJson['england-and-wales'].events.map(holiday => holiday.date);

module.exports = bankHolidays;
