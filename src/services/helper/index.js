export function combineUrls(urls) {
  return urls.reduce((r, u) => r + "/" + u, "");
}
