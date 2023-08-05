// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography, getPaginationItemUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Msg from '../../Components/Msg';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { apigatewayURL } from '../../Constants';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FF5722', // Orange
        },
        secondary: {
            main: '#9C27B0', // Purple
        },
        background: {
            default: '#000000', // Black
        },
        text: {
            primary: '#FFFFFF', // White
        },
    },
});
var scoreboard ;

const Game = (props) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(60); // 1 minute per question
    // const [scores, setScores] = useState([]);
    const [gameData, setGameData] = useState(props.gameData)
    const [questions, setQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userResponses, setUserResponses] = useState([]); // To store user responses
    const [teamScores, setTeamScores] = useState({});
    const userData = JSON.parse(localStorage.getItem('user'));
    const defaultUser = { email: '' };
    const [questionStateLoaded, setQuestionStateLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);
    // const [scheduleDateTime, setScheduleDateTime] = useState(Dayjs);
    const [timeUntilGameStarts, setTimeUntilGameStarts] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [timeUntilStart, setTimeUntilStart] = useState(0);
    const [receivedMessage, setReceivedMessage] = useState({});
    let navigate = useNavigate();
    const [socketTime, setSocketTime] = useState(null);
    //const [scoreboard, setScoreBoard] = useState({});

    const initialState = {
        questionId: null,
        timeLeft: 60,
        answerGiven: null,
        answeredBy: null,
    };
    const [questionStates, setQuestionStates] = useState([]);
    const [teamData,setTeamData]=useState(props.team);

    const initialScores = teamData.members.reduce((acc, member) => {
        acc[member.email] = 0;
        //console.log(acc)
        return acc;
    }, {});

    const [scores, setScores] = useState(initialScores);

    let currentQuestion = questions[currentQuestionIndex] || { question: "", options: [], correctAnswer: "" };
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const webSocketUrl = 'wss://bmwi4srqef.execute-api.us-east-1.amazonaws.com/production'; // Replace with your WebSocket API URL

    const webSocketRef = useRef(null);
    const [webSocketReady, setWebSocketReady] = useState(false);
    const [gameDataLoaded, setGameDataLoaded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [webSocketMessages, setWebSocketMessages] = useState([]);

    useEffect(() => {
        setQuestionStates(Array(questions.length).fill(initialState));
    }, [questions]);

    useEffect(() => {
        //const socketTime = dayjs('25-07-2023 11:40', 'DD-MM-YYYY HH:mm');

        // Calculate the time difference between the current time and the socket time
        const currentTime = dayjs();
        if (socketTime) {
            const timeDifferenceInSeconds = socketTime.diff(currentTime, 'second');

            if (timeDifferenceInSeconds <= 0) {
                // If the game start time has passed, set the game as started
                setIsGameStarted(true);
            } else {
                // If the game start time is in the future, display the countdown timer
                setTimeUntilStart(timeDifferenceInSeconds);
                const timerInterval = setInterval(() => {
                    setTimeUntilStart((prevTime) => {
                        const updatedTime = Math.max(prevTime - 1, 0);
                        if (updatedTime === 0) {
                            // If the countdown timer reaches zero, refresh the page to start the game
                            //window.location.reload();
                            setIsGameStarted(true);
                        }
                        return updatedTime;
                    });
                }, 1000);

                // Clean up the interval on unmount
                return () => clearInterval(timerInterval);
            }
        }
    }, [socketTime]);


    useEffect(() => {
        const game = props.gameData
        setGameData(game)

        if (gameData && gameData.questions) {
            console.log(gameData)
            const transformedQuestions = gameData.questions.map((q) => ({
                question: q.question,
                options: [q.option_1, q.option_2, q.option_3, q.option_4],
                correctAnswer: q.correct_ans,
                hint: q.hint
            }));
            setQuestions(transformedQuestions);
            console.log(transformedQuestions);

            // Process any queued WebSocket messages
            if (webSocketMessages.length > 0) {
                webSocketMessages.forEach((message) => handleSubmitAnswer(message));
                setWebSocketMessages([]); // Clear the queue
            }
        }
    }, [gameData, webSocketMessages]);

    useEffect(() => {
        if (timer > 0) {
            const timerInterval = setInterval(() => {
                setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
            }, 1000);

            // Clean up the interval on unmount
            return () => clearInterval(timerInterval);
        }
    }, [timer]);

    useEffect(() => {

        webSocketRef.current = new WebSocket(webSocketUrl);
        webSocketRef.current.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            if (webSocketRef.current.readyState === WebSocket.OPEN) {
                const a = gameData.shcedule_date;
                const gameId = gameData.id
                webSocketRef.current?.send(JSON.stringify({ action: 'setTime', body: dayjs(gameData.shcedule_date).add(1, 'minute').format('DD-MM-YYYY HH:mm') }));
            }
        };
        webSocketRef.current.onmessage = (event) => {
            // Parse the message data from the event
            const receivedMessage = JSON.parse(event.data);
            console.log("Received Msg", receivedMessage);
            setReceivedMessage(receivedMessage);

            if (receivedMessage.action === 'submitAns') {
                if (questions.length > 0) {
                    // Questions are loaded, process the WebSocket message immediately.
                    handleSubmitAnswer(receivedMessage.body, receivedMessage.player);
                } else {
                    setWebSocketMessages((prevMessages) => [...prevMessages, receivedMessage.body]);
                }
            }
            else if (receivedMessage.action === 'setTime') {
                if (socketTime === null) {
                    const receivedTime = dayjs(receivedMessage.body, 'DD-MM-YYYY HH:mm');
                   // console.log(receivedTime)
                    setSocketTime(receivedTime);
                }

            }
            else if (receivedMessage.action === 'submitNavigation') {
                console.log(receivedMessage.body)
                console.log(teamScores)
                console.log(scores)
              
        
                //setScoreBoard(finalGameScore)
                console.log(scoreboard)
                navigate("/" + receivedMessage.body, { replace: true, state: scoreboard })
            }
        };

        webSocketRef.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

       // console.log("use effect []");
    }, [webSocketRef]);


    useEffect(() => {
        // const playerScores = calculatePlayerScore();
        // // Update individual scores
        // setScores((prevScores) =>
        //     prevScores.map((score) => ({
        //         ...score,
        //         score: playerScores[score.userId] || score.score,
        //     }))
        // );
        // console.log("useeffectuserResponses ")
        // console.log(JSON.stringify(scores))
    }, [userResponses]);


    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setTimer(60); // Reset the timer for the next question
        setIsSubmitted(false)
        setShowHint(false)

        setQuestionStates((prevStates) => {
            const updatedStates = [...prevStates];
            const currentQuestionState = updatedStates[currentQuestionIndex];
            updatedStates[currentQuestionIndex] = {
                ...currentQuestionState,
                timeLeft: 60, // Reset time for each question to 60 seconds
                answerGiven: null,
                answeredBy: null,
            };
            return updatedStates;
        });
    };

    const handlePreviousQuestion = () => {

        if (isSubmitted || currentQuestionIndex === 0 || timer === 0) {
            return; // Do nothing if the answer is submitted or it's the first question or time is over
        }

        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setTimer(60); // Reset the timer for the previous question

        const previousQuestionState = questionStates[currentQuestionIndex - 1];

        if (previousQuestionState.answerGiven !== null || previousQuestionState.timeLeft === 0) {
            // If an answer is given or time is over for the previous question, allow going back
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleOptionClick = (selectedOption) => {
        if (!isSubmitted) {
            // ansGivenBy = userData.email;
            // var user = userData.email;
            // setAnsGivenBy(user);
            // console.log(ansGivenBy)
            setSelectedOption(selectedOption); // Store the selected option
            webSocketRef.current.send(JSON.stringify({ action: 'submitAns', body: selectedOption, player: userData.email }));
            //webSocketRef.current.send(JSON.stringify({ action: 'submitAns', body: userData.email }));
        }
    };

    const calculatePlayerScore = (playerName, isCorrect) => {
        const points = isCorrect ? 5 : 0;

       //console.log(playerName);
        setScores((prevScores) => {
            const updatedScores = { ...prevScores };

            if (updatedScores[playerName] !== undefined) {
                // If the player already exists in the scores object, update their score
                updatedScores[playerName] += points;
            } else {
                // If the player does not exist in the scores object, add them with the initial score
                updatedScores[playerName] = points;
            }

            return updatedScores;
        });
    };


    const handleSubmitAnswer = (selectedOption, ansGivenBy) => {

        setIsSubmitted(true); // Set to true when the user submits an answer
        // const currentQuestion = questions[currentQuestionIndex];
        const currentQuestion = gameData.questions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correct_ans;
        // team score ..
        const newResponse = {
            userId: receivedMessage.player, //userData.email
            question: currentQuestion.question,
            teamId: teamData.message,
            selectedOption: selectedOption,
            correctAnswer: currentQuestion.correct_ans,
            isCorrect: isCorrect,
        };
        setUserResponses((prevResponses) => [...prevResponses, newResponse]);
       // console.log(receivedMessage.player)
        calculatePlayerScore(receivedMessage.player, isCorrect);
        console.log(JSON.stringify(scores))

        // Update team scores
        setTeamScores((prevTeamScores) => {
            const newTeamScores = { ...prevTeamScores };
            const teamScore = prevTeamScores[teamData.message] || 0;
            newTeamScores[teamData.message] = teamScore + (isCorrect ? 10 : -5);
            return newTeamScores;
        });

        if (selectedOption === currentQuestion.correct_ans) {
            Swal.fire({
                title: 'Correct!',
                text: 'You answered correctly!',
                icon: 'success',
                timer: 1000, 
                showConfirmButton: false,
                background: 'white', 
                iconColor: 'green', 
                timerProgressBar: true,

            }).then(() => {
                if (!isLastQuestion) {
                    handleNextQuestion(); 
                }

            });
        } else {
            Swal.fire({
                title: 'Incorrect!',
                text: `The correct answer is: ${currentQuestion.correct_ans} , Explanation : ${currentQuestion.explanation} `,
                icon: 'error',
                timer: 5000, 
                showConfirmButton: false,
                background: 'white', 
                iconColor: 'red', 
                timerProgressBar: true, 

            }).then(() => {
                if (!isLastQuestion) {
                    handleNextQuestion(); 
                }
            });
        }

    };

    const handleShowHint = () => {
        setShowHint(!showHint);
    };

    const handleSubmitGame = () => {
        const gameID = gameData.id

        const TeamScores = {
            reqPath: "submitTeamData",
            name: teamData.message,
            gameID: gameID,
            score: teamScores[teamData.message]
        }

        axios.post(apigatewayURL + "/managegames", TeamScores).then((res) => {
            console.log(res.data.body)
        }).catch((err) => {
            console.log(err.message)
        })

        const Users = {
            reqPath: "submitUserData",
            users: scores,
            gameID: gameID,
            teamName: teamData.message
        }

        console.log(Users);

        const won = teamScores[teamData.message] >= 25 ? true : false
        scoreboard = {
            team: teamData.message,
            teamScore: teamScores[teamData.message],
            won: won,
            memberScore: scores,
            gameID: gameData.id
        }
        console.log(scoreboard)

        axios.post(apigatewayURL + "/managegames",Users).then((res) => {
            //console.log(res.data)
            Swal.fire({
                title: 'Game Data Submitted!',
                text: 'Woohoo..!!',
                icon: 'success',
                timer: 1000, 
                showConfirmButton: false,
                background: 'white', 
                iconColor: 'green', 
                timerProgressBar: true, 
            }).then(() => {
                webSocketRef.current.send(JSON.stringify({ action: 'submitNavigation', body: "scoreboard" }));
            });

        }).catch((err) => {
            console.log(err.message)
        })

    }

    return (
        <div style={{ textAlign: 'center', backgroundColor: 'black', minHeight: '100vh' }}>
            {!isGameStarted ? (
                <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
                    <h2 style={{ textAlign: 'center', color: 'white' }}>Game starts in:</h2>
                    <h3 style={{ textAlign: 'center', color: 'white' }}>{`${Math.floor(timeUntilStart / 60)} mins : ${timeUntilStart % 60} sec left`}</h3>
                    <Msg />
                </div>
            ) : (
                <div>
                    <div style={{ position: 'absolute', top: '10px', right: '5px', marginTop: '5%' }}>
                        <Card variant="outlined" style={{ background: 'black', borderColor: '#FF5722', borderWidth: '2px', borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary">
                                    Real-time Scores
                                </Typography>
                                {/* {teamData.members.map((member) => (
                                    <div key={member.email} style={{ margin: '5px' }}>
                                        <Typography variant="body1" color="textPrimary">
                                            Player {member.email}: {scores.find((score) => score.name === member.email)?.score || 0}
                                        </Typography>
                                    </div>
                                ))} */}
                                {teamData.members.map((member) => (
                                    <div key={member.email} style={{ margin: '5px' }}>
                                        <Typography variant="body1" color="textPrimary">
                                            Player {member.email}: {scores[member.email]}
                                        </Typography>
                                    </div>
                                ))}
                                {/* Display team score */}
                                {teamScores[teamData.message] !== undefined && (
                                    <div style={{ margin: '5px' }}>
                                        <Typography variant="body1" color="textPrimary">
                                            Team {teamData.message}: {teamScores[teamData.message]}
                                        </Typography>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <Typography variant="h4" color="secondary">
                        Trivia Game
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 50px' }}></div>
                    <Card
                        variant="outlined"
                        style={{ margin: '20px auto', width: '600px', maxWidth: '90vw', background: 'black' }}
                    >
                        <CardContent>
                            <Typography variant="h5" color="primary">
                                {`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                            </Typography>
                            {currentQuestion.options.map((option) => (
                                <div key={option} style={{ margin: '10px', width: '100%' }}>
                                    <Button
                                        variant="outlined"
                                        style={{ minWidth: '100px', color: 'white' }}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={isSubmitted || timer === 0}
                                    >
                                        {option}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 50px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            sx={{ backgroundColor: '#FF5722' }}
                        >
                            Previous
                        </Button>
                        <Typography variant="h6" color="secondary">
                            {`Time left: ${timer} seconds`}
                        </Typography>
                        {isLastQuestion ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmitGame}
                                disabled={timer === 0}
                                sx={{ backgroundColor: '#FF5722' }}
                            >
                                Submit
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextQuestion}
                                sx={{ backgroundColor: '#FF5722' }}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 50px' }}> </div>
                    {showHint ? (
                        // Display the hint text if showHint is true
                        <Typography variant="body1" color="textPrimary">
                            {currentQuestion.hint}
                        </Typography>
                    ) : (
                        // Show the "Hint" button if showHint is false
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShowHint}
                            sx={{ backgroundColor: '#FF5722' }}
                        >
                            Hint
                        </Button>
                    )}

                    <Msg />
                </div>
            )}
        </div>

    );
};

const GameApp = () => {
    const location = useLocation();
    const gameData = JSON.parse(location.state)
    return (
        <ThemeProvider theme={theme}>
            <Game gameData={gameData.activeGame}  team={gameData.team} />
            <ToastContainer />
        </ThemeProvider>
    );
};

export default GameApp;
