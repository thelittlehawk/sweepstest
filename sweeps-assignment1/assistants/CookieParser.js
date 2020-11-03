/**
 * Extract cookies from Cookie string. Cookies are stored internaly in an array.
 */
class CookiesParser {
  constructor(cookieString) {
    this.cookies = [];
    if (cookieString) {
      const cookies = cookieString.split(";");
      cookies.forEach(cookie => {
        const cookiePair = cookie.split("=", 2);
        const cookieName = cookiePair[0].trim();
        this.cookies.push({ name: cookieName, value: cookiePair[1] });
      });
    }
  }

  getCookies() {
    return this.cookies;
  }

  getCookieByName(name) {
    const filteredCookies = this.cookies.filter(x => x.name === name);
    return filteredCookies.length ? filteredCookies[0] : null;
  }
}

export { CookiesParser };
