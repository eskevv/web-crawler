const { JSDOM } = require("jsdom");
const { text } = require("stream/consumers");

async function crawl_page(base_url, current_url, pages) {
  const base_url_object = new URL(base_url);
  const current_url_object = new URL(current_url);

  if (base_url_object.hostname !== current_url_object.hostname) {
    return pages;
  }

  const normalized_current_url = normalize_url(current_url);

  if (pages[normalized_current_url] > 0) {
    pages[normalized_current_url]++;
    return pages;
  }

  pages[normalized_current_url] = 1;

  console.log(`actively crawling: ${current_url}`);

  try {
    const resp = await fetch(current_url);
    if (resp.status > 399) {
      console.log(`error in fetch with status code: ${resp.status} on page: ${current_url}`);
      return pages;
    }

    const content_type = resp.headers.get("content-type");

    if (!content_type.includes("text/html")) {
      console.log(`non html response, content type: ${content_type} on page: ${current_url}`);
      return pages;
    }

    const html_body = await resp.text();
    const next_urls = get_urls_from_html(html_body, base_url);

    for (const next_url of next_urls) {
      pages = await crawl_page(base_url, next_url, pages);
    }
    return pages;

  } catch (error) {
    console.log(`error in fetch: ${error.message}, on page: ${current_url}`);
  }
}

function get_urls_from_html(html_body, base_url) {
  const urls = [];
  const dom = new JSDOM(html_body);
  const link_elements = dom.window.document.querySelectorAll("a");
  for (const link_element of link_elements) {
    if (link_element.href.slice(0, 1) === "/") {
      try {
        const url_object = new URL(`${base_url}${link_element.href}`);
        urls.push(url_object.href)
      } catch (err) {
        console.log(`error with relative url: ${err.message}`);
      }
    } else {
      try {
        const url_object = new URL(`${link_element.href}`);
        urls.push(url_object.href)
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
    }
  }

  return urls;
}

function normalize_url(url_string) {
  const url_object = new URL(url_string);
  const host_path = `${url_object.hostname}${url_object.pathname}`;
  if (host_path.length > 0 && host_path.slice(-1) === "/") {
    return host_path.slice(0, -1);
  }
  return host_path;
}

module.exports = {
  normalize_url,
  get_urls_from_html,
  crawl_page
}