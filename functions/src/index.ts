import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import _get from 'lodash/get';

import { Client } from '@googlemaps/google-maps-services-js';

admin.initializeApp();
const client = new Client({});
const GMAPS_KEY = functions.config().google_api.maps_key;

export const checkKey = functions.https.onRequest(async (req, res) => {
  const mode = 'driving';
  const { origin, destination } = req.body;
  try {
    if (req.method !== 'POST' || !origin || !destination) {
      functions.logger.log('Invalid request');
      res.sendStatus(404);
      return;
    }

    const key = ["duration", origin, destination, mode].join(",");
    const code = key.toLowerCase().replace(/\s/g, "");
    const documentKey = crypto.createHash("md5").update(code).digest("hex");

    const ref = admin.firestore().collection('geodocs').doc(documentKey);
    const geoDoc = await ref.get();

    if (geoDoc.exists) {
      const docData = geoDoc.data();

      functions.logger.log("Success");
      res.status(200).json({
        data: docData?.duration,
      });
      return;
    }

    const params = {
      key: GMAPS_KEY,
      origin,
      destination,
    };
    
    const { data } = await client.directions({ params });
    const duration = _get(data, 'routes[0].legs[0].duration.text');
    
    if (!duration) {
      functions.logger.log("Unable to calculate duration");
      res.sendStatus(404);
      return;
    }

    // If we are able to obtain duration, publish it to firestore
    await admin.firestore().collection("geodocs").doc(documentKey).set({
      origin,
      destination,
      duration,
    });

    res.status(200).json({
      data: duration
    })
    return;
  } catch (err) {
    functions.logger.error(err);
    res.sendStatus(500);
    return;
  }
});