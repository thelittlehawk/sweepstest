import { doc } from "prettier";

function displayCookies() {
  console.log(document.cookie);
}

function setCookie(cookie) {
  document.cookie = cookie;
}

export { displayCookies, setCookie };
