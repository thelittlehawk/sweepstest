class CookieGenerator {
  constructor(isLocal) {
    this.expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    this.domain = isLocal ? "sweeps.dev.local" : "sweeps-assignment1.faik-catibusic.workers.dev";
  }
  createCookieWithDomain(name, value) {
    return `${name}=${value}; expires=Wed, 02-Dec-20 14:23:05 GMT; domain=${this.domain};`;
  }
  createCookie(name, value) {
    return `${name}=${value}; expires=${this.expirationDate};`;
  }
}

export { CookieGenerator };
