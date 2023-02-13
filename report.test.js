const { sort_pages } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sort_pages", () => {
  const input = {
    "https://wagslane.dev/path": 1,
    "https://wagslane.dev": 3,
  };

  const actual = sort_pages(input);
  const expected = [
    ["https://wagslane.dev", 3],
    ["https://wagslane.dev/path", 1],
  ]
  expect(actual).toEqual(expected);
});
