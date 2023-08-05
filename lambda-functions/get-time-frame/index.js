// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const cors = require('cors')({ origin: true });

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

//lambda handler to get time stemp
exports.handler = (event, context, callback) => {
    // Retrieve data from Firestore
    const collectionName = 'TimeFrame';
    const timeFrames = db
        .collection(collectionName)
        .orderBy('frame_id')
        .get()
        .then((snapshot) => {
            const data = snapshot.docs.map((doc) => {
                const frameData = doc.data();
                return {
                    label: frameData.time_frame,
                    frame_id: frameData.frame_id
                };
            });

            // Construct the JSON response
            const jsonResponse = {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify(data)
            };

            // Return the JSON response
            callback(null, jsonResponse);
        })
        .catch((error) => {
            // Handle any errors that occur
            console.error('Error retrieving data:', error);
            // Construct an error JSON response
            const errorResponse = {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: 'Error retrieving data'
            };
            // Return the error JSON response
            callback(null, errorResponse);
        });
};
