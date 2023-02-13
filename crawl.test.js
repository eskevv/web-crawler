const { normalize_url } = require("./crawl.js");
const { get_urls_from_html } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalize_url strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalize_url(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalize_url remove trailing slashes", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalize_url(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalize_url capitals", () => {
  const input = "https://BLOG.Boot.dev/path/";
  const actual = normalize_url(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("normalize_url strip http", () => {
  const input = "http://BLOG.Boot.dev/path/";
  const actual = normalize_url(input);
  const expected = "blog.boot.dev/path";
  expect(actual).toEqual(expected);
});

test("get_urls_from_html absolute", () => {
  const input_body = `
<html>
  <body>
    <a href="https://blog.boot.dev/">Boot.dev Blog </a>
    </body>
    </html>`
    
    const input_base_url = "blog.boot.dev";
    const actual = get_urls_from_html(input_body, input_base_url);
    const expected = ["https://blog.boot.dev/"];
    expect(actual).toEqual(expected);
  });
  
  test("get_urls_from_html relative", () => {
    const input_body = `
    <html>
    <body>
    <a href="/path/">Boot.dev Blog</a>
    </body>
    </html>`
    
    const input_base_url = "https://blog.boot.dev";
    const actual = get_urls_from_html(input_body, input_base_url);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
  });
  
  test("get_urls_from_html relative-absolute", () => {
    const input_body = `
<html>
  <body>
    <a href="https://blog.boot.dev/path1/">Boot.dev Blog Path One</a>
    <a href="/path2/">Boot.dev Blog Path Two</a>
  </body>
</html>`

  const input_base_url = "https://blog.boot.dev";
  const actual = get_urls_from_html(input_body, input_base_url);
  const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"];
  expect(actual).toEqual(expected);
});

  test("get_urls_from_html relative-absolute", () => {
    const input_body = `
<html>
  <body>
    <a href="invalid">Invalid URL</a>
  </body>
</html>`

  const input_base_url = "https://blog.boot.dev";
  const actual = get_urls_from_html(input_body, input_base_url);
  const expected = [];
  expect(actual).toEqual(expected);
});