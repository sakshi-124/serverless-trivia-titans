const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async (event, context, callback) => {
    const reqPath = event.reqPath;
    let response = null;

    switch (reqPath) {
        case '/getgames':
            try {
                const gamesResponse = await handleGetGames();
                response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    gamesResponse,
                };
            } catch (error) {
                console.error('Error handling getGames request:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: false, message: 'Error retrieving game data.' }),
                };
            }
            break;

        case '/activate':
            try {
                await handleActivate(event.data);
                response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: true, message: 'activate request handled.' }),
                };
            } catch (error) {
                console.error('Error handling activate request:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: false, message: 'Error handling activate request.' } , {error}),
                };
            }
            break;
        case '/deactivate':

            try {
                await handleDeactivate(event.data);
                response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ success: true, message: 'deactivate request handled.' }),
                };
            } catch (error) {
                console.error('Error handling deactivate request:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ success: false, message: 'Error handling deactivate request.' }),
                };
            }
            break;
            case '/updateGame':

            try {
                await handleUpdateGame(event.gameId , event.gameData);
                response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ success: true, message: 'Game updated.' }),
                };
            } catch (error) {
                console.error('Error handling update request:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({ success: false, message: 'Error handling update request.' + error }),
                };
            }
            break;

        default:
            // Invalid request path
            response = {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ success: false, message: `Invalid path: ${reqPath}` }),
            };
            break;
    }

    callback(null, response);
};


// Handler function for getGames request
async function handleGetGames() {
    try {
        const games = await retrieveGamesWithJoinData();
        const response = {
            body: ({ games }),
        };
        return response
    } catch (error) {
        console.error('Error retrieving game data:', error);
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: ({ success: false, message: 'Error retrieving game data.' }),
        };
        return response
    }
}

// Handler function for activate request
async function handleActivate(data) {
    const { gameId } = data;
    try {
        await db.collection('Games').doc(gameId).update({ gameStatus: 1 });
    } catch (error) {
        console.error('Error updating game status to activate:', error);
        throw error;
    }
}

// Handler function for deactivate request
async function handleDeactivate(data) {
    const { gameId } = data;
    try {
        await db.collection('Games').doc(gameId).update({ gameStatus: 0 });
    } catch (error) {
        console.error('Error updating game status to deactivate:', error);
        throw error;
    }
}

async function retrieveGamesWithJoinData() {
    const snapshot = await db.collection('Games').get();
    const games = [];

    for (const doc of snapshot.docs) {
        const gameData = doc.data();
        const { category_id, level_id, frame_id, questions } = gameData;

        // Query the related documents based on the field values
        const [categoryData, levelData, frameData, questionData] = await Promise.all([
            retrieveDocumentData('Category', 'cate_id', category_id),
            retrieveDocumentData('DifficultyLevel', 'level_id', level_id),
            retrieveDocumentData('TimeFrame', 'frame_id', frame_id),
            retrieveQuestionsData(questions),
        ]);

        const gameWithJoinData = {
            id : doc.id,
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

// async function retrieveDocumentData(collectionName, documentId) {
//     const doc = await db.collection(collectionName)(documentId).get();
//     return doc.data();
// }

async function retrieveDocumentData(collectionName, fieldName, fieldValue) {
    const snapshot = await db.collection(collectionName).where(fieldName, '==', fieldValue).get();
    if (snapshot.empty) {
        return null; // Or handle the case when the document is not found
    }

    const doc = snapshot.docs[0];
    return doc.data();
}

async function retrieveQuestionsData(questionRefs) {
    const questionPromises = questionRefs.map(async (questionRef) => {
        const questionDoc = await questionRef.get();
        return questionDoc.data();
    });
    return Promise.all(questionPromises);
}

async function handleUpdateGame(gameId , gameData) {
    const gameCollection = db.collection('Games');

    await gameCollection.doc(gameId).update(gameData);

    return 'Game updated successfully!';

}