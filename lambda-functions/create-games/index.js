const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function chooseRandomElements(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
    //return shuffled.slice(0, Math.min(count, questions.length));
}

exports.handler = async (event, context, callback) => {

    console.log(event.body)
    const { level_id, category_id, frame_id } = (event.body);

    const getTimeFrameSnapshot = await db.collection('TimeFrame').where('frame_id' , '==' , frame_id).get();

    getTimeFrameSnapshot.forEach((doc) => {
        timeframe = doc.data();
    });

    const time_frame = [];
    getTimeFrameSnapshot.forEach((doc) => {
        const timeframeData = doc.data();
        time_frame.push(timeframeData);
    });

    const timeFrame = time_frame[0]['time_frame'];


    const splitedTimeFrame = timeFrame.split(' ');
    const numberOfQuestions = parseInt(splitedTimeFrame[0]);

    const getQuestionsSnapshot = await db.collection('Questions')
        .where('category', '==', category_id)
        .where('difficulty', '==', level_id)
        .get();

    const questions = [];
    getQuestionsSnapshot.forEach((doc) => {
        const questionData = doc.data();
        questions.push(questionData);
    });

    const randomQuestions = chooseRandomElements(questions, numberOfQuestions);

    const questionRefs = randomQuestions.map((question) => db.collection('Questions').doc(question.question));

    const gameData = {
        level_id : level_id,
        category_id : category_id,
        frame_id : time_frame[0]['frame_id'],
        questions: questionRefs,
        gameStatus : 1
      };
    
    const games = await db.collection('Games').add(gameData);

    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({ success: true, questions: questionRefs }),
    };

    callback(null, response);
};
