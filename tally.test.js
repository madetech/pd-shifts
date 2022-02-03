const tally = require("./tally");

describe("tally()", () => {
  it("returns an object containing a count for each user", () => {
    // Given
    const shifts = {
      "Alice": [{ start: "2022-01-03T09:00:00+00:00" }],
      "Bob": [{ start: "2022-01-04T09:00:00+00:00" }],
      "Charlie": [{ start: "2022-01-05T09:00:00+00:00" }],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 1);
    expect(totals).toHaveProperty('Bob.totalShifts', 1);
    expect(totals).toHaveProperty('Charlie.totalShifts', 1);
  });

  it("correctly counts multiple shifts for the same user", () => {
    // Given
    const shifts = {
      "Alice": [
        { start: "2022-01-03T09:00:00+00:00" },
        { start: "2022-01-04T09:00:00+00:00" },
        { start: "2022-01-05T09:00:00+00:00" },
      ],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.totalShifts', 3);
  });

  it("provides separate counts for weekday and weekend shifts", () => {
    // Given
    const shifts = {
      "Alice": [{ start: "2022-01-03T09:00:00+00:00" }],
    };

    // When
    const totals = tally(shifts);

    // Then
    expect(totals).toHaveProperty('Alice.weekendShifts');
    expect(totals).toHaveProperty('Alice.weekdayShifts');
  })
});
