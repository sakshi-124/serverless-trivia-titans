const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async (event, context, callback) => {
    const request = (event.body);
    const reqPath = request.reqPath;

    switch (reqPath) {
        case '/getgames':
            // Handle getGames request
            handleGetGames(callback);
            break;
        case '/activate':
            // Handle activate request
            handleActivate(request.data, callback);
            break;
        case '/deactivate':
            // Handle deactivate request
            handleDeactivate(request.data, callback);
            break;
        default:
            // Invalid request path
            const response = {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ success: false, message: `Invalid path: ${reqPath}` }),
            };
            callback(null, response);
    }
};

// Handler function for getGames request
async function handleGetGames(callback) {
    try {
        const games = await retrieveGamesWithJoinData();
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ success: true, message: 'getGames request handled.', games }),
        };
        callback(null, response);
    } catch (error) {
        console.error('Error retrieving game data:', error);
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ success: false, message: 'Error retrieving game data.' }),
        };
        callback(null, response);
    }
}

// Handler function for activate request
async function handleActivate(data, callback) {
    try {
        // Add the code logic to handle the activate request
        // ...
        
        // Return the response
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ success: true, message: 'activate request handled.' }),
        };
        callback(null, response);
    } catch (error) {
        console.error('Error handling activate request:', error);
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ success: false, message: 'Error handling activate request.' }),
        };
        callback(null, response);
    }
}

// Handler function for deactivate request
async function handleDeactivate(data, callback) {
    try {
        // Add the code logic to handle the deactivate request
        // ...
        
        // Return the response
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ success: true, message: 'deactivate request handled.' }),
        };
        callback(null, response);
    } catch (error) {
        console.error('Error handling deactivate request:', error);
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ success: false, message: 'Error handling deactivate request.' }),
        };
        callback(null, response);
    }
}

async function retrieveGamesWithJoinData() {
    const snapshot = await db.collection('Games').get();
    const games = [];

    for (const doc of snapshot.docs) {
        const gameData = doc.data();
        const { category_id, level_id, frame_id, questions } = gameData;

        const [categoryData, levelData, frameData, questionData] = await Promise.all([
            retrieveDocumentData('Category', category_id),
            retrieveDocumentData('Level', level_id),
            retrieveDocumentData('TimeFrame', frame_id),
            retrieveQuestionsData(questions),
        ]);

        const gameWithJoinData = {
            ...gameData,
            category: categoryData,
            level: levelData,
            frame: frameData,
            questions: questionData,
        };

        games.push(gameWithJoinData);
    }

    return games;
}

async function retrieveDocumentData(collectionName, documentId) {
    const doc = await db.collection(collectionName).doc(documentId).get();
    return doc.data();
}

async function retrieveQuestionsData(questionRefs) {
    const questionPromises = questionRefs.map(async (questionRef) => {
        const questionDoc = await questionRef.get();
        return questionDoc.data();
    });
    return Promise.all(questionPromises);
}
