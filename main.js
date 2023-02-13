
const { crawl_page } = require("./crawl.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log("too many main args provided");
    process.exit(1);
  }

  const url_provided = process.argv[2];

  console.log(`<- starting crawl of ${url_provided} ->\n`);

  const pages = await crawl_page(url_provided, url_provided, {});

  for (const page of Object.entries(pages)) {
    console.log(page);
  }
}

main();

