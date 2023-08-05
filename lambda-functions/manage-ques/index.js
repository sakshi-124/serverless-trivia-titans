// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async (event, context, callback) => {
    const reqPath = event.reqPath;
    let response = null;

    //path for handling requests
    switch (reqPath) {
        case 'getQues':
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
                console.error('Error handling questions:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: false, message: 'Error retrieving questions data.' }),
                };
            }
            break;
        
            case 'updateQue':
            try {
                 console.log(event)
                const queRes = await handleUpdateQuestion(event.question , event.option_1,event.option_2,event.option_3,event.option_4,event.correct_ans,event.category,event.difficulty,event.docRef,event.hint,event.explanation);
                response = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body : ({ success: true, message: 'Question Modified.' })
                };
            } catch (error) {
                console.error('Error handling questions:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: false, message: 'Error updating question.' }),
                };
            }
            break;

            case 'deleteQue':
                try {
                     console.log(event)
                    const queRes = await handleDeleteQue(event.docRef, event.status);
                    response = {
                        statusCode: 200,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        body : ({ success: true, message: 'Question Deleted.' })
                    };
                } catch (error) {
                    console.error('Error handling questions:', error);
                    response = {
                        statusCode: 500,
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        body: ({ success: false, message: 'Error updating question.' }),
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
            questionData.docRef = doc.ref;
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

//handles update questions
async function handleUpdateQuestion(question , option_1,option_2,option_3,option_4,correct_ans,category,difficulty,docRef,hint,explanation) {
    try {
        const questionCollection = db.collection('Questions');
        await questionCollection.doc(docRef).update({
            question: question,
            category: category,
            difficulty: difficulty,
            option_1: option_1,
            option_2: option_2,
            option_3: option_3,
            option_4: option_4,
            correct_ans: correct_ans,
            status : 1 ,
            hint : hint,
            explanation : explanation
            // Add other fields that you want to update
          });
    
          const response = ('Document updated successfully!');

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

  
//handles delete question
async function handleDeleteQue(docRef,status) {
    try {
        const questionCollection = db.collection('Questions');
        await questionCollection.doc(docRef).update({
            status : status
          });
    
          const response = ('Document deleted successfully!');

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