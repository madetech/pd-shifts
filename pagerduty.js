const { api } = require('@pagerduty/pdjs');

async function getShiftsByUser({ from, until, token, schedules }) {
  const shifts = await Promise.all(
    schedules.map(async schedule =>
      await getScheduleShiftsByUser({ from, until, token, schedule })
    )
  );

  return shifts;
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

    shifts[user].push({ start, end });
    return shifts;
  }, {});
}

module.exports.getShiftsByUser = getShiftsByUser;
module.exports.getScheduleShiftsByUser = getScheduleShiftsByUser;
