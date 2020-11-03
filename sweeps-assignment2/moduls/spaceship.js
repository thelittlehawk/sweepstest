const axios = require("axios");

const TARGET = "https://sweeps.proxy.beeceptor.com/spaceship/r";
const METHOD = "POST";

const flatten = (obj, parentKey = "") => {
  const returnObject = {};
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (Array.isArray(value)) returnObject[newKey] = value.toString();
    else if (typeof value === "object")
      Object.assign(returnObject, flatten(value, newKey));
    else returnObject[newKey] = value;
  });
  return returnObject;
};

const handleEvent = async (event) => {
  try {
    const data = flatten(event);
    console.info(`[INFO][SPACESHIP]`, data);
    const response = await axios[METHOD.toLowerCase()](TARGET, data);
    return { successful: response.status, message: response.data };
  } catch (error) {
    console.log(`[ERROR][SPACESHIP] ${error}`);
    return false;
  }
};

module.exports = { handleEvent };
