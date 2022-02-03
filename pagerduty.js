const { api } = require('@pagerduty/pdjs');
const { isWeekend } = require('./shifts.js');

async function getShiftsByUser({ from, until, token, schedules: scheduleIds }) {
  const schedules = await Promise.all(
    scheduleIds.map(id => getScheduleShiftsByUser({ from, until, token, schedule: id }))
  );

  return schedules.reduce((allShifts, schedule) => {
    Object.keys(schedule).forEach(user => {
      if(!allShifts[user]) {
        allShifts[user] = [];
      }

      allShifts[user] = allShifts[user].concat(schedule[user]);
    });

    return allShifts;
  }, {});
}

async function getScheduleShiftsByUser({ from, until, token, schedule }) {
  const pd = api({ token });
  const pdSchedule = await pd.get(`/schedules/${schedule}?since=${from}&until=${until}`);
  const scheduleEntries = pdSchedule.data.schedule.final_schedule.rendered_schedule_entries;

  return scheduleEntries.reduce((shifts, shift) => {
    const { start, end } = shift;
    const user = shift.user.summary;

    if (!shifts[user]) {
      shifts[user] = [];
    }

    shifts[user].push({ start, end, isWeekend: isWeekend(shift) });
    return shifts;
  }, {});
}

module.exports.getShiftsByUser = getShiftsByUser;
module.exports.getScheduleShiftsByUser = getScheduleShiftsByUser;
