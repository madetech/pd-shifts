function generateCsv(totals) {
  const records = Object.keys(totals).map(user =>
    [
      user,
      totals[user].weekdayShifts,
      totals[user].weekendShifts,
      totals[user].totalShifts,
    ].join(",")
  );

  const output = records.sort((a, b) => a[0].localeCompare(b[0]));
  output.unshift("User,Weekday Shifts,Weekend Shifts,Total Shifts");

  return output.join("\n");
}

module.exports = generateCsv;
