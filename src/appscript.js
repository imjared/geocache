const CLOUDFUNCTION_ENDPOINT = "";

/**
 * Calculate the travel time between two locations
 * on Google Maps.
 *
 * =GOOGLEMAPS_DURATION("NY 10005", "Hoboken NJ")
 *
 * @param {String} origin The address of starting point
 * @param {String} destination The address of destination
 * @return {String} The time in minutes
 * @customFunction_
 */
const GOOGLEMAPS_DURATION = (origin, destination) => {
  const options = {
    method: "post",
    muteHttpExceptions: true,
    payload: { origin, destination },
  };

  const res = UrlFetchApp.fetch(
    CLOUDFUNCTION_ENDPOINT,
    options
  );

  if (res.getResponseCode() === "404") {
    Logger.log("No results found", {
      origin,
      destination
    });
    return null;
  }

  const jsonString = res.getContentText();
  const destinationData = JSON.parse(jsonString);

  return destinationData.data;
}
