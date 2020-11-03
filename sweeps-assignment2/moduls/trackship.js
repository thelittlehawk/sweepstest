const axios = require("axios");

const TARGET = "https://sweeps.proxy.beeceptor.com/m0nit0r.com/track_ship";
const METHOD = "PUT";

const prepareUrl = (url, timestamp) => `${url}/${timestamp}`;

const prepareTimestamp = (timestamp) => new Date(timestamp) / 1000;

const removeKeyFromDictionary = (dict, key) => {
  delete dict[key];
  return dict;
};

const handleEvent = async (event) => {
  try {
    const data = removeKeyFromDictionary(event, "timestamp");
    console.info(`[INFO][TRACKSHIP]`, data);
    const response = await axios[METHOD.toLowerCase()](
      prepareUrl(TARGET, prepareTimestamp(event["timestamp"])),
      data
    );
    return { successful: response.status, message: response.data };
  } catch (error) {
    console.log(`[ERROR][TRACKSHIP] ${error}`);
    return false;
  }
};

module.exports = { handleEvent };
