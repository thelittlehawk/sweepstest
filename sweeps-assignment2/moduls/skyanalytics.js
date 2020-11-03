const axios = require("axios");

const TARGET = "https://sweeps.proxy.beeceptor.com/skyanalytics/get";
const METHOD = "POST";

const getInternationalMapcode = async (longlat) => {
  const response = await axios(
    `https://api.mapcode.com/mapcode/codes/${longlat}`
  );
  return response.data.international.mapcode;
};

const capitalize = async (obj) => {
  const returnObject = {};
  Object.entries(obj).forEach(async ([key, value]) =>
    key !== "t"
      ? (returnObject[`${key[0].toUpperCase()}${key.slice(1)}`] = value)
      : (returnObject[key] = value)
  );
  returnObject["Lat-lon"] = await getInternationalMapcode(
    returnObject["Lat-lon"].toString()
  );
  return returnObject;
};

const handleEvent = async (event) => {
  try {
    const data = await capitalize(event);
    console.info(`[INFO][SKYANALYTICS]`, data);
    const response = await axios[METHOD.toLowerCase()](TARGET, data);
    return { successful: response.status, message: response.data };
  } catch (error) {
    console.log(`[ERROR][SKYANALYTICS] ${error}`);
    return false;
  }
};

module.exports = { handleEvent };
