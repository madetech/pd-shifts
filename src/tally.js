function tally(shiftsByUser) {
  const totals = {};

  Object.keys(shiftsByUser).forEach((user) => {
    const shifts = shiftsByUser[user];

    const userTotals = {
      totalShifts: 0,
      weekendShifts: 0,
      weekdayShifts: 0,
    };

    shifts.forEach((shift) => {
      if (!shift.isInHours) {
        userTotals.totalShifts += 1;
      }
      if (shift.isWeekend || shift.isBankHoliday) {
        userTotals.weekendShifts += 1;
      }
      if (!shift.isWeekend && !shift.isBankHoliday && !shift.isInHours) {
        userTotals.weekdayShifts += 1;
      }
    });

    // totals[user] = {
    // totalShifts: shifts.length,
    // totalShifts: shifts.filter((shift) => !shift.isInHours).length
    // totalShifts: shifts.length - shifts.filter((shift) => shift.isInHours).length,
    // weekendShifts: shifts.filter((shift) => shift.isWeekend || shift.isBankHoliday).length,
    // weekdayShifts: shifts.filter((shift) => !shift.isWeekend &&
    //                                         !shift.isBankHoliday &&
    //                                         !shift.isInHours).length,
    //      weekdayShifts: shifts.filter((shift) => !shift.isWeekend &&
    //                                              !shift.isBankHoliday).length,

    totals[user] = userTotals;
  });

  return totals;
}

module.exports = tally;
