function tally(shiftsByUser) {
  const totals = {};

  Object.keys(shiftsByUser).forEach((user) => {
    const shifts = shiftsByUser[user];

    totals[user] = {
      //      totalShifts: shifts.length,
      totalShifts: shifts.length - shifts.filter((shift) => shift.isInHours).length,
      weekendShifts: shifts.filter((shift) => shift.isWeekend || shift.isBankHoliday).length,
      weekdayShifts: shifts.filter((shift) => !shift.isWeekend
                                              && !shift.isBankHoliday
                                              && !shift.isInHours).length,
      //      weekdayShifts: shifts.filter((shift) => !shift.isWeekend &&
      //                                                !shift.isBankHoliday).length,

    };
  });

  return totals;
}

module.exports = tally;
