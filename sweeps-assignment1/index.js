import { CookiesParser } from "./assistants/CookieParser";
import { CookieGenerator } from "./assistants/CookieGenerator";
// import { displayCookies, setCookie } from "./assistants/ClientLibrary";

// Environement variables and environement dependent funcionalities
const isLocal = true;
const domain = isLocal ? "http://sweeps.dev.local:8787/" : "https://sweeps-assignment1.faik-catibusic.workers.dev/";

/**
 * Event listener for all incoming requests to the worker.
 * @param event
 */
addEventListener("fetch", event => event.respondWith(handleRequest(event.request)));

async function handleRequest(request) {
  const { method } = request;
  if ("OPTIONS" === method) {
    return handleOptions(request);
  } else if ("POST" === method) {
    const response = new Response(JSON.stringify({ clientIpAddress: request.headers.get("CF-Connecting-IP") }), {
      headers: { "Content-Type": "application/json" }
    });
    const cookieGenerator = new CookieGenerator();
    const newNameCookie = cookieGenerator.createCookieWithDomain("name", "Test Name Cookie");
    const newQuoteCookie = cookieGenerator.createCookieWithDomain("quote", "Test Quote Cookie");
    response.headers.append("Set-Cookie", `${newNameCookie}`);
    response.headers.append("Set-Cookie", `${newQuoteCookie}`);
    return response;
  } else if ("GET" === method) {
    // First request for the script will always come as GET. Here we check if there are cookies
    // set or we need to send code to the browser to make POST request in order to set them.
    return handleGETRequest(request);
  } else {
    return new Response("Unsuported method", { status: 400 });
  }
}

function sendCookieToServer(name, quote) {
  fetch(domain, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      quote: quote
    })
  })
    .then(response => response.json())
    .then(data => console.log("Caller IP address:", data.clientIpAddress))
    .catch(error => console.error("Error:", error));
}

const handleGETRequest = async request => {
  const cookieString = request.headers.get("Cookie");
  const cookieGenerator = new CookieGenerator(isLocal);

  if (cookieString) {
    const requestCookies = new CookiesParser(cookieString);
    const nameCookie = requestCookies.getCookieByName("name");
    const quoteCookie = requestCookies.getCookieByName("quote");
    if (nameCookie && quoteCookie) {
      // Both cookies (name & quote) are present. Here we prepare
      // code that will print those cookies in the browser and also
      // set two new cookies (local_name & local_quote) from JavaScript
      // code in the browser.
      const localNameCookie = cookieGenerator.createCookie("local_name", nameCookie.value);
      const localQuoteCookie = cookieGenerator.createCookie("local_quote", quoteCookie.value);

      const response = new Response(
        `console.log(document.cookie); document.cookie = '${localNameCookie}'; document.cookie = '${localQuoteCookie}';`,
        { headers: { "content-type": "text/html" } }
      );
      response.headers.set("Link", "client.js; rel=preload; as=script; nopush");
      return response;
    } else {
      return new Response("We need both cookies (name & quote) to be present.", { status: 422 });
    }
  } else {
    const response = new Response(`${sendCookieToServer.toString()}; ${sendCookieToServer.name}(name, quote);`, {
      headers: {
        "content-type": "text/html",
        "Access-Control-Allow-Origin": "http://sweeps.dev.local:8080",
        "Access-Control-Allow-Methods": "GET, HEAD, POST,  OPTIONS",
        "Access-Control-Max-Age": "86400"
      }
    });
    return response;
  }
};
function handleOptions(request) {
  // For pre-flight request
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    let respHeaders = {
      "Access-Control-Allow-Origin": request.headers.get("Origin"),
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers")
    };
    return new Response(null, {
      headers: respHeaders
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS"
      }
    });
  }
}
