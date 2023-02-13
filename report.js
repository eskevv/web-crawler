function sort_pages(pages) {
  const pages_array = Object.entries(pages);
  pages_array.sort((a, b) => {
    const a_hits = a[1];
    const b_hits = b[1];

    return b[1] - a[1];
  });

  return pages_array;
}

module.exports = {
  sort_pages
}