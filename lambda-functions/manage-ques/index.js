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
        case '/getQues':
            try {
                const queRes = await handleQuestions(event.category_id , event.level_id);
                response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body : queRes,
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
async function handleQuestions(category_id, level_id) {
    try {
        const getQuestionsSnapshot = await db.collection('Questions')
        .where('category', '==', category_id)
        .where('difficulty', '==', level_id)
        .get();

        const questions = [];
        getQuestionsSnapshot.forEach((doc, index) => {
            const questionData = doc.data();
            // Add the 'id' field to the questionData object
            questionData.id = index + 1;
            questions.push(questionData);
        });
        const response = questions

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