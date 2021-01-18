## Summary
Provides an endpoint to calculate distance between two points, cache the results, and provide the results as a function for Google Sheets.

## Usage

### Google Cloud
1. Clone this repo and install dependencies `npm i`
2. Create a new Firebase project @ http://console.firebase.google.com/
3. Install the Firebase CLI https://firebase.google.com/docs/cli
4. Enable the directions API in the Google Cloud Console https://console.cloud.google.com/marketplace/product/google/directions-backend.googleapis.com
5. After enabling the Directions API, [copy your API key](https://console.cloud.google.com/google/maps-apis/credentials)
<img src="https://user-images.githubusercontent.com/525011/104941009-85c68d00-5980-11eb-96ca-57df445807e1.png" />

6. From the command line, set this as a remote config value for your Firebase functions: `firebase functions:config:set google_api.maps_key="AIzaSyD-8h0WO59AibGLvldPSzcfgif65M8EsJk"`
7. Deploy functions from the `functions` directory via `npm run deploy`. Make note of the deployed function endpoint: https://console.firebase.google.com/project/[YOUR_PROJECT_ID]/functions/list

### Google Sheets
1. Install the addon found in `src/appscript.js` by opening the Script Editor from your Google Sheet
<img src="https://user-images.githubusercontent.com/525011/104942070-f15d2a00-5981-11eb-8f9e-fc20aa9d6782.png" />

2. Set the `CLOUDFUNCTION_ENDPOINT` variable to the endpoint you've deployed via Firebase functions.
3. Save this file. You can now call the function with `==GOOGLEMAPS_DURATION(origin, destination)`

## Additional considerations
You should enable billing notifications as a just-in-case measure. This script should cache data reliably but you never know!
