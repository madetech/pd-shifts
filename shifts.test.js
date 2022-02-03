const { isWeekend, isBankHoliday } = require("./shifts");

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

describe("isBankHoliday()", () => {
  it.each([
    ["2022-01-03T09:00:00+00:00", "New Year’s Day"],
    ["2022-04-15T09:00:00+00:00", "Good Friday"],
    ["2022-04-18T09:00:00+00:00", "Easter Monday"],
    ["2022-05-02T09:00:00+00:00", "Early May bank holiday"],
    ["2022-06-02T09:00:00+00:00", "Spring bank holiday"],
    ["2022-06-03T09:00:00+00:00", "Platinum Jubilee bank holiday"],
    ["2022-08-29T09:00:00+00:00", "Summer bank holiday"],
    ["2022-12-26T09:00:00+00:00", "Boxing Day"],
    ["2022-12-27T09:00:00+00:00", "Christmas Day"],
  ])('should return true if shift starts on $day', (start, day) => {
    // When
    const result = isBankHoliday({ start });

    // Then
    expect(result).toBe(true);
  });

  it("should return false if shift doesn't start on a bank holiday", () => {
    // When
    const result = isBankHoliday({ start: "2022-01-04T09:00:00+00:00" });

    // Then
    expect(result).toBe(false);
  });
});
