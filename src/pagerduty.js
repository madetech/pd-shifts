const { api } = require('@pagerduty/pdjs');
const dayjs = require('dayjs');
const { isWeekend, isBankHoliday } = require('./shifts');

async function getScheduleShiftsByUser({
  from, until, token, schedule, maxShiftLength,
}) {
  const queryFrom = dayjs(from).subtract(maxShiftLength, 'hour').format('YYYY-MM-DD');
  const queryUntil = dayjs(until).format('YYYY-MM-DD');

  const pd = api({ token });
  const pdSchedule = await pd.get(`/schedules/${schedule}?since=${queryFrom}&until=${queryUntil}`);
  const scheduleEntries = pdSchedule.data.schedule.final_schedule.rendered_schedule_entries;

  return scheduleEntries.reduce((acc, shift) => {
    const shifts = acc;
    const user = shift.user.summary;

    if (!shifts[user]) {
      shifts[user] = [];
    }

    const addShift = ({ start, end }) => {
      if (start.isAfter(from) && start.isBefore(until)) {
        shifts[user].push({
          start: start.toISOString(),
          end: end.toISOString(),
          isWeekend: isWeekend({ start }),
          isBankHoliday: isBankHoliday({ start }),
        });
      }
    };

    const { start: startString, end: endString } = shift;
    const start = dayjs(startString);
    const end = dayjs(endString);

    let shiftStart = start;
    let maxShiftEnd = shiftStart.add(maxShiftLength, 'hour');

    while (maxShiftEnd.isBefore(end)) {
      addShift({ start: shiftStart, end: maxShiftEnd });
      shiftStart = maxShiftEnd;
      maxShiftEnd = shiftStart.add(maxShiftLength, 'hour');
    }

    addShift({ start: shiftStart, end });

    return shifts;
  }, {});
}

async function getShiftsByUser({
  from, until, token, schedules: scheduleIds, maxShiftLength,
}) {
  const schedules = await Promise.all(
    scheduleIds.map((id) => getScheduleShiftsByUser({
      from, until, token, schedule: id, maxShiftLength,
    })),
  );

  return schedules.reduce((acc, schedule) => {
    const allShifts = acc;

    Object.keys(schedule).forEach((user) => {
      if (!allShifts[user]) {
        allShifts[user] = [];
      }

      allShifts[user] = allShifts[user].concat(schedule[user]);
    });

    return allShifts;
  }, {});
}

module.exports.getShiftsByUser = getShiftsByUser;
module.exports.getScheduleShiftsByUser = getScheduleShiftsByUser;
