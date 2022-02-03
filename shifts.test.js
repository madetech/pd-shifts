const { expect } = require("@jest/globals");
const { isWeekend } = require("./shifts");

describe("isWeekend()", () => {
  it.each([
    ["2022-01-03T09:00:00+00:00", "Monday"],
    ["2022-01-04T09:00:00+00:00", "Tuesday"],
    ["2022-01-05T09:00:00+00:00", "Wednesday"],
    ["2022-01-06T09:00:00+00:00", "Thursday"],
    ["2022-01-07T09:00:00+00:00", "Friday"],
  ])('should return false if shift starts on a $day', (start, day) => {
    // When
    const result = isWeekend({ start });

    // Then
    expect(result).toBe(false);
  });

  it.each([
    ["2022-01-08T09:00:00+00:00", "Saturday"],
    ["2022-01-09T09:00:00+00:00", "Sunday"],
  ])('should return true if shift starts on a $day', (start, day) => {
    // When
    const result = isWeekend({ start });

    // Then
    expect(result).toBe(true);
  });
});
