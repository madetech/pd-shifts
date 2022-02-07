const { api } = require('@pagerduty/pdjs');
const { getScheduleShiftsByUser, getShiftsByUser } = require('./pagerduty');

jest.mock('@pagerduty/pdjs');
const pagerdutyApi = jest.fn();
api.mockReturnValue({ get: pagerdutyApi });

const makeApiResponse = (entries => ({
  data: {
    schedule: {
      final_schedule: {
        rendered_schedule_entries: entries
      }
    }
  }
}));

describe("getScheduleShiftsByUser()", () => {
  const fakeParams = {
    from: "2022-01-01",
    until: "2022-01-08",
    token: "fakeToken",
    schedule: "fakeScheduleId",
  };

  it("Returns empty object when schedule has no shifts", async () => {
    // Given
    pagerdutyApi.mockResolvedValue(makeApiResponse([]));

    // When
    const shifts = await getScheduleShiftsByUser(fakeParams);

    // Then
    expect(Object.keys(shifts)).toHaveLength(0);
  });

  it("Returns object with keys for each user that has a shift", async () => {
    // Given
    pagerdutyApi.mockResolvedValue(makeApiResponse([
      {
        start: '2022-01-02T09:00:00+00:00',
        end: '2022-01-03T09:00:00+00:00',
        user: { summary: 'Alice' },
      },
      {
        start: '2022-01-03T09:00:00+00:00',
        end: '2022-01-04T09:00:00+00:00',
        user: { summary: 'Bob' },
      },
      {
        start: '2022-01-04T09:00:00+00:00',
        end: '2022-01-04T17:00:00+00:00',
        user: { summary: 'Charlie' },
      },
    ]));

    // When
    const shifts = await getScheduleShiftsByUser(fakeParams);

    // Then
    expect(shifts).toHaveProperty('Alice[0].start', '2022-01-02T09:00:00.000Z');
    expect(shifts).toHaveProperty('Alice[0].end', '2022-01-03T09:00:00+00:00');
    expect(shifts).toHaveProperty('Bob[0].start', '2022-01-03T09:00:00.000Z');
    expect(shifts).toHaveProperty('Bob[0].end', '2022-01-04T09:00:00+00:00');
    expect(shifts).toHaveProperty('Charlie[0].start', '2022-01-04T09:00:00.000Z');
    expect(shifts).toHaveProperty('Charlie[0].end', '2022-01-04T17:00:00+00:00');
  });

  it("Aggregates shifts for the same user", async () => {
    // Given
    pagerdutyApi.mockResolvedValue(makeApiResponse([
      {
        start: '2022-01-02T09:00:00+00:00',
        end: '2022-01-03T09:00:00+00:00',
        user: { summary: 'Alice' },
      },
      {
        start: '2022-01-03T09:00:00+00:00',
        end: '2022-01-04T09:00:00+00:00',
        user: { summary: 'Alice' },
      },
      {
        start: '2022-01-04T09:00:00+00:00',
        end: '2022-01-04T17:00:00+00:00',
        user: { summary: 'Alice' },
      },
    ]));

    // When
    const shifts = await getScheduleShiftsByUser(fakeParams);

    // Then
    expect(shifts).toHaveProperty('Alice[0].start', '2022-01-02T09:00:00.000Z');
    expect(shifts).toHaveProperty('Alice[0].end', '2022-01-03T09:00:00+00:00');
    expect(shifts).toHaveProperty('Alice[1].start', '2022-01-03T09:00:00.000Z');
    expect(shifts).toHaveProperty('Alice[1].end', '2022-01-04T09:00:00+00:00');
    expect(shifts).toHaveProperty('Alice[2].start', '2022-01-04T09:00:00.000Z');
    expect(shifts).toHaveProperty('Alice[2].end', '2022-01-04T17:00:00+00:00');
  });

  it("Uses schedule, from and until parameters to query PagerDuty API", async () => {
    // Given
    const params = {
      from: "2022-01-01",
      until: "2022-01-08",
      schedule: "TestSchedule",
    };

    // When
    await getScheduleShiftsByUser({ ...fakeParams, ...params });

    // Then
    expect(pagerdutyApi).toHaveBeenCalledWith(`/schedules/TestSchedule?since=2022-01-01&until=2022-01-08`);
  });

  it("splits up a single long shift into multiple back-to-back shifts", async () => {
    // Given
    pagerdutyApi.mockResolvedValue(makeApiResponse([
      {
        start: '2022-01-02T09:00:00+00:00',
        end: '2022-01-04T17:00:00+00:00',
        user: { summary: 'Alice' },
      },
    ]));

    // When
    const shifts = await getScheduleShiftsByUser({ ...fakeParams, maxShiftLength: 24 });

    // Then
    expect(shifts['Alice']).toHaveLength(3);
  });
});

describe("getShiftsByUser()", () => {
  it("Merges the output of getScheduleShiftsByUser() for each schedule", async () => {
    // Given
    pagerdutyApi
      .mockResolvedValueOnce(makeApiResponse([
        {
          start: '2022-01-02T09:00:00+00:00',
          end: '2022-01-03T09:00:00+00:00',
          user: { summary: 'Alice' },
        },
      ]))
      .mockResolvedValueOnce(makeApiResponse([
        {
          start: '2022-01-03T09:00:00+00:00',
          end: '2022-01-04T09:00:00+00:00',
          user: { summary: 'Bob' },
        },
      ]));

    // When
    const shifts = await getShiftsByUser({
      from: "2022-01-01",
      until: "2022-01-08",
      token: "fakeToken",
      schedules: ["fakeScheduleId1", "fakeScheduleId2"],
    });

    // Then
    expect(shifts).toHaveProperty('Alice[0].start', '2022-01-02T09:00:00.000Z');
    expect(shifts).toHaveProperty('Alice[0].end', '2022-01-03T09:00:00+00:00');
    expect(shifts).toHaveProperty('Bob[0].start', '2022-01-03T09:00:00.000Z');
    expect(shifts).toHaveProperty('Bob[0].end', '2022-01-04T09:00:00+00:00');
  });
});
