const { api } = require('@pagerduty/pdjs');
const dayjs = require('dayjs');
const { isWeekend, isBankHoliday } = require('./shifts.js');

async function getShiftsByUser({ from, until, token, schedules: scheduleIds, maxShiftLength }) {
  const schedules = await Promise.all(
    scheduleIds.map(id => getScheduleShiftsByUser({ from, until, token, schedule: id, maxShiftLength }))
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

async function getScheduleShiftsByUser({ from, until, token, schedule, maxShiftLength }) {
  const pd = api({ token });
  const pdSchedule = await pd.get(`/schedules/${schedule}?since=${from}&until=${until}`);
  const scheduleEntries = pdSchedule.data.schedule.final_schedule.rendered_schedule_entries;

  return scheduleEntries.reduce((shifts, shift) => {
    const user = shift.user.summary;

    if (!shifts[user]) {
      shifts[user] = [];
    }

    const { start: startString, end: endString } = shift;
    const start = dayjs(startString);
    const end = dayjs(endString);

    let shiftStart = start;
    let maxShiftEnd = shiftStart.add(maxShiftLength, 'hour');

    while(maxShiftEnd.isBefore(end)) {
      shifts[user].push({
        start: shiftStart,
        end: maxShiftEnd,
        isWeekend: isWeekend({ start: shiftStart }),
        isBankHoliday: isBankHoliday({ start: shiftStart }),
      });

      shiftStart = maxShiftEnd;
      maxShiftEnd = shiftStart.add(maxShiftLength, 'hour');
    }

    shifts[user].push({
      start: shiftStart,
      end,
      isWeekend: isWeekend({ start: shiftStart }),
      isBankHoliday: isBankHoliday({ start: shiftStart }),
    });

    return shifts;
  }, {});
}

module.exports.getShiftsByUser = getShiftsByUser;
module.exports.getScheduleShiftsByUser = getScheduleShiftsByUser;
