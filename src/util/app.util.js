export function enableAppScroll() {
  const appElement = document.getElementById("app");
  appElement.style.overflowY = "unset";
  appElement.style.height = "";
}
