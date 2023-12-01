const dayjs = require('dayjs');
const { isWeekend, isBankHoliday, isInHours } = require('../src/shifts');

describe('isWeekend()', () => {
  it.each([
    { date: '2022-01-03', name: 'Monday' },
    { date: '2022-01-04', name: 'Tuesday' },
    { date: '2022-01-05', name: 'Wednesday' },
    { date: '2022-01-06', name: 'Thursday' },
    { date: '2022-01-07', name: 'Friday' },
  ])('should return false if shift starts on a $name', ({ date }) => {
    // When
    const result = isWeekend({ start: dayjs(`${date}T09:00:00+00:00`) });

    // Then
    expect(result).toBe(false);
  });

  it.each([
    { date: '2022-01-08', name: 'Saturday' },
    { date: '2022-01-09', name: 'Sunday' },
  ])('should return true if shift starts on a $name', ({ date }) => {
    // When
    const result = isWeekend({ start: dayjs(`${date}T09:00:00+00:00`) });

    // Then
    expect(result).toBe(true);
  });
});

describe('isBankHoliday()', () => {
  it.each([
    { date: '2022-01-03', name: 'New Year’s Day' },
    { date: '2022-04-15', name: 'Good Friday' },
    { date: '2022-04-18', name: 'Easter Monday' },
    { date: '2022-05-02', name: 'Early May bank holiday' },
    { date: '2022-06-02', name: 'Spring bank holiday' },
    { date: '2022-06-03', name: 'Platinum Jubilee bank holiday' },
    { date: '2022-08-29', name: 'Summer bank holiday' },
    { date: '2022-12-26', name: 'Boxing Day' },
    { date: '2022-12-27', name: 'Christmas Day' },
  ])('should return true if shift starts on $name', ({ date }) => {
    // When
    const result = isBankHoliday({ start: dayjs(`${date}T09:00:00+00:00`) });

    // Then
    expect(result).toBe(true);
  });

  it("should return false if shift doesn't start on a bank holiday", () => {
    // When
    const result = isBankHoliday({ start: dayjs('2022-01-04T09:00:00+00:00') });

    // Then
    expect(result).toBe(false);
  });
});

describe('isInHours()', () => {
  it('should return true for a shift entirely within business hours on a weekday', () => {
    const start = dayjs('2023-11-30T09:00:00+00:00');
    const end = dayjs('2023-11-30T17:00:00+00:00');

    // When
    const result = isInHours({ start, end });
    expect(result).toBe(true);
  });

  it('should return false for a shift not entirely within business hours on a weekday', () => {
    const start = dayjs('2023-11-30T08:00:00+00:00');
    const end = dayjs('2023-11-30T17:00:00+00:00');

    // When
    const result = isInHours({ start, end });

    // Then
    expect(result).toBe(false);
  });

  it('should return false for an out of hours shift on a weekday', () => {
    const start = dayjs('2023-11-30T17:00:00+00:00');
    const end = dayjs('2023-12-01T09:00:00+00:00');

    // When
    const result = isInHours({ start, end });

    // Then
    expect(result).toBe(false);
  });

  it('should return false for a shift on a weekend', () => {
    const start = dayjs('2023-12-02T09:00:00+00:00');
    const end = dayjs('2023-12-03T09:00:00+00:00');

    // When
    const result = isInHours({ start, end });

    // Then
    expect(result).toBe(false);
  });

  it('should return false for a shift on a bank holiday', () => {
    const start = dayjs('2024-01-01T09:00:00+00:00');
    const end = dayjs('2024-01-02T09:00:00+00:00');

    // When
    const result = isInHours({ start, end });

    // Then
    expect(result).toBe(false);
  });
});
