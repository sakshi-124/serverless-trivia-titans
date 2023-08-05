// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

//initializing firestore app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.handler = async (event, context, callback) => {
    const reqPath = event.reqPath;
    let response = null;

    // request pats to handle particular request
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
                    body: ({ success: false, message: 'Error handling activate request.' }, { error }),
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
                await handleUpdateGame(event.gameId, event.gameData);
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

        case 'submitTeamData':
            try {
                teamName = event.name;
                gameID = event.gameID,
                    score = event.score;
                userID = event.userID

                const teams = await db.collection('TeamScores').doc(teamName).get();
                const teamExists = teams.exists;

                if (teamExists) {
                    // Update existing team scores in Firestore
                    await updateTeamScores(teamName, gameID, score);
                } else {
                    // Insert a new team with scores into Firestore
                    await insertNewTeam(teamName, gameID, score);
                }

                // team statistic 
                await updateTeamStatistics(teamName, score, score >= 25 ?  true : false, gameID);

                await updatePlayedGamesForTeam(teamName,gameID);

                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "Team data updated successfully!" })
                };
            } catch (error) {
                console.error('Error handling updateTemas request:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: false, message: 'Error updating data.', errors }),
                };
            }
            break;

        case 'submitUserData':
            try {
                teamName = event.teamName;
                gameID = event.gameID;

                for (let i in event.users) {
                    let points = event.users[i];
                    await updateUserStatistics(i,points,true,gameID,teamName)
                }
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "user data updated successfully!" })
                };
            } catch (error) {
                console.error('Error handling updateTemas request:', error);
                response = {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: ({ success: false, message: 'Error updating data.', error }),
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

// join data
async function retrieveGamesWithJoinData() {
    const snapshot = await db.collection('Games').get();
    const games = [];

    for (const doc of snapshot.docs) {
        const gameData = doc.data();
        const { category_id, level_id, frame_id, questions } = gameData;

        const [categoryData, levelData, frameData, questionData] = await Promise.all([
            retrieveDocumentData('Category', 'cate_id', category_id),
            retrieveDocumentData('DifficultyLevel', 'level_id', level_id),
            retrieveDocumentData('TimeFrame', 'frame_id', frame_id),
            retrieveQuestionsData(questions),
        ]);

        const gameWithJoinData = {
            id: doc.id,
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

// function to handle update game
async function handleUpdateGame(gameId, gameData) {
    const gameCollection = db.collection('Games');

    await gameCollection.doc(gameId).update(gameData);

    return 'Game updated successfully!';

}

// for team score 
async function updateTeamScores(teamName, gameID, score) {
    const teamRef = db.collection('TeamScores').doc(teamName);
    await teamRef.update({
        [`scores.${gameID}`]: score
    });
}

//for new teamscore
async function insertNewTeam(teamName, gameID, score) {
    const teamRef = db.collection('TeamScores').doc(teamName);
    await teamRef.set({
        name: teamName,
        scores: {
            [gameID]: score
        }
    });
}

// for updating team statistic 
async function updateTeamStatistics(teamName, points, won, gameID) {
    try {
        const timestamp = admin.firestore.Timestamp.now(); // Get the current timestamp in Firestore Timestamp format
        const matchHistory = {
            Date: timestamp,
            Points: points,
            Won: won,
            Game: gameID
        };

        const teamRef = db.collection('TeamStatistics').doc(teamName);
        const teamDoc = await teamRef.get();

        if (teamDoc.exists) {
            // If the team exists, update the team statistics
            const data = teamDoc.data();
            const totalPoints = data.totalPoints + points;
            const totalMatches = data.totalMatches + 1;
            const totalWins = data.totalWins + (won ? 1 : 0);
            const totalLosses = totalMatches - totalWins;

            await teamRef.update({
                matchHistory: admin.firestore.FieldValue.arrayUnion(matchHistory),
                totalPoints,
                totalMatches,
                totalWins,
                totalLosses,
                teamName
            });
        } else {
            // If the team does not exist, insert a new document
            const totalPoints = points;
            const totalMatches = 1;
            const totalWins = won ? 1 : 0;
            const totalLosses = won ? 0 : 1;

            await teamRef.set({
                matchHistory: [matchHistory],
                totalPoints,
                totalMatches,
                totalWins,
                totalLosses,
                teamName
            });
        }

        console.log('Team statistics successfully updated/inserted.');
    } catch (error) {
        console.error('Error updating/inserting team statistics:', error);
    }
}

// for updating user statistic 
async function updateUserStatistics(userID, points, won, gameID, teamName) {
    try {
        const timestamp = admin.firestore.Timestamp.now(); // Get the current timestamp in Firestore Timestamp format
        const matchHistory = {
            Date: timestamp,
            Points: points,
            Won: won,
            Game: gameID,
            team: teamName,
        };

        const userRef = db.collection('UserStatistics').doc(userID);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            // If the user exists, update the user statistics
            const data = userDoc.data();
            const totalPoints = data.totalPoints + points;
            const totalMatches = data.totalMatches + 1;
            const totalWins = data.totalWins + (won ? 1 : 0);
            const totalLosses = totalMatches - totalWins;

            await userRef.update({
                matchHistory: admin.firestore.FieldValue.arrayUnion(matchHistory),
                totalPoints,
                totalMatches,
                totalWins,
                totalLosses
            });
        } else {
            // If the user does not exist, insert a new document
            const totalPoints = points;
            const totalMatches = 1;
            const totalWins = won ? 1 : 0;
            const totalLosses = won ? 0 : 1;

            await userRef.set({
                matchHistory: [matchHistory],
                totalPoints,
                totalMatches,
                totalWins,
                totalLosses
            });
        }

        console.log('User statistics successfully updated/inserted.');
    } catch (error) {
        console.error('Error updating/inserting user statistics:', error);
    }
}

// for updating games
async  function updatePlayedGamesForTeam(teamName, gameID) {
    try {
      const teamsRef = db.collection("teams");
      const querySnapshot = await teamsRef.where("message", "==", teamName).get();
  
      if (querySnapshot.empty) {
        console.log(`No team found with the name ${teamName}`);
        return;
      }
  
      const teamDoc = querySnapshot.docs[0];
      const teamRef = teamsRef.doc(teamDoc.id);
  
      // Get the existing playedGames array from the team document
      const teamData = teamDoc.data();
      const existingPlayedGames = teamData.playedGames || [];
  
      // Check if the game is already in the array
      const gameIndex = existingPlayedGames.findIndex((game) => game.gameID === gameID);
      if (gameIndex !== -1) {
        // Game already exists in the array, update its status to played
        existingPlayedGames[gameIndex].played = true;
      } else {
        // Game does not exist in the array, add it as a new entry
        existingPlayedGames.push({ gameID, played: true });
      }
  
      // Update the team document with the new playedGames array
      await teamRef.update({ playedGames: existingPlayedGames });
      console.log(`Played games array updated for team ${teamName}`);
    } catch (error) {
      console.error("Error updating played games array:", error);
    }
  }
  