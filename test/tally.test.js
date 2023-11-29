const tally = require('../src/tally');

describe('tally()', () => {
  it('returns an object containing a count for each user', () => {
    // Given
    const shifts = {
      Alice: [{ start: '2022-01-03T09:00:00+00:00' }],
      Bob: [{ start: '2022-01-04T09:00:00+00:00' }],
      Charlie: [{ start: '2022-01-05T09:00:00+00:00' }],
    };

    // When
    const totals = tally(shifts);
    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 1);
    expect(totals).toHaveProperty('Bob.totalShifts', 1);
    expect(totals).toHaveProperty('Charlie.totalShifts', 1);
  });

  it('correctly counts multiple shifts for the same user', () => {
    // Given
    const shifts = {
      Alice: [
        { start: '2022-01-03T09:00:00+00:00' },
        { start: '2022-01-04T09:00:00+00:00' },
        { start: '2022-01-05T09:00:00+00:00' },
      ],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 3);
  });

  it('provides separate counts for weekday and weekend shifts', () => {
    // Given
    const shifts = {
      Alice: [{ start: '2022-01-03T09:00:00+00:00' }],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.weekendShifts');
    expect(totals).toHaveProperty('Alice.weekdayShifts');
  });

  it('correctly counts shifts when shifts include weekend (Saturday or Sunday), no bank holiday, and no in hours', () => {
    // Given
    const shifts = {
      Alice: [
        {
          start: '2023-11-26T09:00:00+00:00', end: '2023-11-27T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-11-27T09:00:00+00:00', end: '2023-11-28T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-11-28T09:00:00+00:00', end: '2023-11-29T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
      ],
      Bob: [
        {
          start: '2023-12-02T09:00:00+00:00', end: '2023-12-03T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-12-03T09:00:00+00:00', end: '2023-12-04T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-12-04T09:00:00+00:00', end: '2023-12-05T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
      ],
      Charlie: [
        {
          start: '2023-12-08T17:00:00+00:00', end: '2023-12-09T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-12-09T09:00:00+00:00', end: '2023-12-10T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-12-10T09:00:00+00:00', end: '2023-12-11ßT09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
      ],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 3);
    expect(totals).toHaveProperty('Alice.weekendShifts', 1);
    expect(totals).toHaveProperty('Alice.weekdayShifts', 2);

    expect(totals).toHaveProperty('Bob.totalShifts', 3);
    expect(totals).toHaveProperty('Bob.weekendShifts', 2);
    expect(totals).toHaveProperty('Bob.weekdayShifts', 1);

    expect(totals).toHaveProperty('Charlie.totalShifts', 3);
    expect(totals).toHaveProperty('Charlie.weekendShifts', 2);
    expect(totals).toHaveProperty('Charlie.weekdayShifts', 1);
  });

  it('correctly counts shifts when shifts include bank holiday, no weekend (Saturday or Sunday), and no in hours', () => {
    // Given
    const shifts = {
      Alice: [
        {
          start: '2024-05-06T09:00:00+00:00', end: '2024-05-07T09:00:00+00:00', isWeekend: false, isBankHoliday: true, isInHours: false,
        },
        {
          start: '2024-05-07T09:00:00+00:00', end: '2024-05-08T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2024-05-08T09:00:00+00:00', end: '2024-05-09T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
      ],
      Bob: [
        {
          start: '2024-12-25T09:00:00+00:00', end: '2024-12-26T09:00:00+00:00', isWeekend: false, isBankHoliday: true, isInHours: false,
        },
        {
          start: '2024-12-26T09:00:00+00:00', end: '2024-12-27T09:00:00+00:00', isWeekend: false, isBankHoliday: true, isInHours: false,
        },
        {
          start: '2024-12-27T09:00:00+00:00', end: '2024-12-28T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
      ],
      Charlie: [
        {
          start: '2024-03-28T17:00:00+00:00', end: '2024-03-29T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2024-03-29T09:00:00+00:00', end: '2024-03-30T09:00:00+00:00', isWeekend: false, isBankHoliday: true, isInHours: false,
        },
      ],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 3);
    expect(totals).toHaveProperty('Alice.weekendShifts', 1);
    expect(totals).toHaveProperty('Alice.weekdayShifts', 2);

    expect(totals).toHaveProperty('Bob.totalShifts', 3);
    expect(totals).toHaveProperty('Bob.weekendShifts', 2);
    expect(totals).toHaveProperty('Bob.weekdayShifts', 1);

    expect(totals).toHaveProperty('Charlie.totalShifts', 2);
    expect(totals).toHaveProperty('Charlie.weekendShifts', 1);
    expect(totals).toHaveProperty('Charlie.weekdayShifts', 1);
  });

  it('correctly counts shifts when shifts include in hours, no bank holiday, and no weekend (Saturday or Sunday)', () => {
    // Given
    const shifts = {
      Alice: [
        {
          start: '2023-11-27T09:00:00+00:00', end: '2023-11-28T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-11-28T09:00:00+00:00', end: '2023-11-29T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2023-11-29T09:00:00+00:00', end: '2023-11-29T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
      ],
      Bob: [
        {
          start: '2023-12-05T09:00:00+00:00', end: '2023-12-05T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
        {
          start: '2023-12-06T09:00:00+00:00', end: '2023-12-06T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
        {
          start: '2023-12-07T09:00:00+00:00', end: '2023-12-08T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
      ],
      Charlie: [
        {
          start: '2023-12-13T09:00:00+00:00', end: '2023-12-13T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
        {
          start: '2023-12-14T09:00:00+00:00', end: '2023-12-14T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
        {
          start: '2023-12-15T09:00:00+00:00', end: '2023-12-15T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
      ],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 2);
    expect(totals).toHaveProperty('Alice.weekendShifts', 0);
    expect(totals).toHaveProperty('Alice.weekdayShifts', 2);

    expect(totals).toHaveProperty('Bob.totalShifts', 1);
    expect(totals).toHaveProperty('Bob.weekendShifts', 0);
    expect(totals).toHaveProperty('Bob.weekdayShifts', 1);

    expect(totals).toHaveProperty('Charlie.totalShifts', 0);
    expect(totals).toHaveProperty('Charlie.weekendShifts', 0);
    expect(totals).toHaveProperty('Charlie.weekdayShifts', 0);
  });

  it('correctly counts shifts when shifts include in hours, bank holiday, and weekend (Saturday or Sunday)', () => {
    // Given
    const shifts = {
      Alice: [
        {
          start: '2024-05-05T09:00:00+00:00', end: '2024-05-06T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2024-05-06T09:00:00+00:00', end: '2024-05-07T09:00:00+00:00', isWeekend: false, isBankHoliday: true, isInHours: false,
        },
        {
          start: '2024-05-07T09:00:00+00:00', end: '2024-05-07T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
      ],
      Bob: [
        {
          start: '2024-08-10T09:00:00+00:00', end: '2024-08-11T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2024-08-11T09:00:00+00:00', end: '2024-08-12T09:00:00+00:00', isWeekend: true, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2024-08-12T09:00:00+00:00', end: '2024-08-12T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
      ],
      Charlie: [
        {
          start: '2024-01-01T09:00:00+00:00', end: '2024-01-02T09:00:00+00:00', isWeekend: false, isBankHoliday: true, isInHours: false,
        },
        {
          start: '2024-01-02T09:00:00+00:00', end: '2024-01-03T09:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: false,
        },
        {
          start: '2024-01-03T09:00:00+00:00', end: '2024-01-03T17:00:00+00:00', isWeekend: false, isBankHoliday: false, isInHours: true,
        },
      ],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 2);
    expect(totals).toHaveProperty('Alice.weekendShifts', 2);
    expect(totals).toHaveProperty('Alice.weekdayShifts', 0);

    expect(totals).toHaveProperty('Bob.totalShifts', 2);
    expect(totals).toHaveProperty('Bob.weekendShifts', 2);
    expect(totals).toHaveProperty('Bob.weekdayShifts', 0);

    expect(totals).toHaveProperty('Charlie.totalShifts', 2);
    expect(totals).toHaveProperty('Charlie.weekendShifts', 1);
    expect(totals).toHaveProperty('Charlie.weekdayShifts', 1);
  });
});
