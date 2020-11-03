const http = require("http");
const spaceshipHandler = require("./moduls/spaceship");
const trackshipHandler = require("./moduls/trackship");
const skyanalyticsHandler = require("./moduls/skyanalytics");

const port = 1337;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(
      `{"message": "Only POST method  is allowed.", "error": "${http.STATUS_CODES[405]}"}`
    );
  } else {
    if (req.url === "/") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", async () => {
        try {
          const jsonBody = JSON.parse(body);
          if (jsonBody && jsonBody.events && jsonBody.events.length > 0) {
            const responses = await Promise.all(
              jsonBody.events.map(async (eventJSON) => ({
                t: eventJSON.t,
                spaceship: await spaceshipHandler.handleEvent(eventJSON),
                trackship: await trackshipHandler.handleEvent(eventJSON),
                skyanalytics: await skyanalyticsHandler.handleEvent(eventJSON),
              }))
            );
            res.end(
              `{ "data": ${JSON.stringify(
                responses
              )}, "message": "Request processed successfully.", "error": "" }`
            );
          } else {
            res.statusCode = 422;
            res.end(
              `{ "message": "Make sure that body has key events of type array, and that there is at least one event.", "error": "${http.STATUS_CODES[422]}" }`
            );
          }
        } catch (error) {
          console.error("[ERROR]", error);
          res.statusCode = 400;
          res.end(
            `{ "message": "Please make sure to send valid JSON body.", "error": "${http.STATUS_CODES[400]}" }`
          );
        }
      });
    }
  }
});

server.listen(port, () => {
  console.log(`[INFO] Server listening on port ${port}`);
});
