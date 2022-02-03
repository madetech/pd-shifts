function generateCsv(totals) {
  const output = [];
  output.push("User,Weekday Shifts,Weekend Shifts,Total Shifts");

  Object.keys(totals).forEach(user =>
    output.push([
      user,
      totals[user].weekdayShifts,
      totals[user].weekendShifts,
      totals[user].totalShifts,
    ].join(","))
  );

  return output.join("\n");
}

module.exports = generateCsv;
