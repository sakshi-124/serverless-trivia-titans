import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, Typography, getPaginationItemUtilityClass } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
//import Msg from '../../Components/Msg';
import MsgWithSocket from '../../Components/MsgWithSocket';
import Msg from '../../Components/Msg';
import dayjs, { Dayjs } from 'dayjs';


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

const Game = (props) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(60); // 1 minute per question
    const [scores, setScores] = useState([]);
    const [gameData, setGameData] = useState(props.gameData)
    const [questions, setQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userResponses, setUserResponses] = useState([]); // To store user responses
    const [teamScores, setTeamScores] = useState({});
    const userData = JSON.parse(localStorage.getItem('user'));
    const [questionStateLoaded, setQuestionStateLoaded] = useState(false);
    const [showHint, setShowHint] = useState(false);
    // const [scheduleDateTime, setScheduleDateTime] = useState(Dayjs);
    const [timeUntilGameStarts, setTimeUntilGameStarts] = useState(0);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [timeUntilStart, setTimeUntilStart] = useState(0);
    //const [ansGivenBy, setAnsGivenBy] = useState("");
    const [ansGivenBy, setAnsGivenBy] = useState('');

    const [socketTime, setSocketTime] = useState(null);

    const initialState = {
        questionId: null,
        timeLeft: 60,
        answerGiven: null,
        answeredBy: null,
    };
    const [questionStates, setQuestionStates] = useState([]);
    const teamData = {
        email: "doriyataksh@gmail.com",
        game: "Trivia Game",
        members: [
            {
                email: "vaidyasakshi434@gmail.com",
                status: "owner",
            },
            {
                email: "sakshivaidya06@gmail.com",
                status: "member",
            },
            {
                email: "sakshi.vaidya@dal.ca",
                status: "member",
            },
        ],
        message: "Qwizdom",
    };

    let currentQuestion = questions[currentQuestionIndex] || { question: "", options: [], correctAnswer: "" };
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const webSocketUrl = 'wss://bmwi4srqef.execute-api.us-east-1.amazonaws.com/production'; // Replace with your WebSocket API URL

    const webSocketRef = useRef(null);
    const [webSocketReady, setWebSocketReady] = useState(false);
    const [gameDataLoaded, setGameDataLoaded] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [webSocketMessages, setWebSocketMessages] = useState([]);

    // useEffect(() => {
    //     // Load the state for the current question or initialize if it doesn't exist
    //     const currentQuestionState = questionStates[currentQuestionIndex] || initialState;

    //     // Update the current question state with the new question's information
    //     const updatedQuestionState = {
    //         ...currentQuestionState,
    //         questionId: currentQuestion.questionId,
    //         timeLeft: 60, // Reset time for each question to 60 seconds
    //         answerGiven: null,
    //         answeredBy: null,
    //     };

    //     // Update the state array with the new question state
    //     setQuestionStates((prevStates) => {
    //         const updatedStates = [...prevStates];
    //         updatedStates[currentQuestionIndex] = updatedQuestionState;
    //         return updatedStates;
    //     });

    //     setQuestionStateLoaded(true);

    //     console.log("useeffect currect indes")
    //     // Other useEffect code
    // }, [currentQuestionIndex, currentQuestion]);


    // // old code startts 
    // useEffect(() => {
    //     console.log(props.gameData)
    //     const game = props.gameData
    //     setGameData(game)
    //     console.log({ gameData })

    //     if (gameData && gameData.questions) {
    //         const transformedQuestions = gameData.questions.map((q) => ({
    //             question: q.question,
    //             options: [q.option_1, q.option_2, q.option_3, q.option_4],
    //             correctAnswer: q.correct_ans,
    //         }));
    //         setQuestions(transformedQuestions);
    //         console.log(transformedQuestions);
    //     }

    //     console.log("Current questions state:", JSON.stringify(questions));
    //     const timerInterval = setInterval(() => {
    //         setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
    //     }, 1000);

    //     // Clean up the interval on unmount
    //     //return () => clearInterval(timerInterval);
    // }, []);

    // useEffect(() => {
    //     webSocketRef.current = new WebSocket(webSocketUrl);
    //     webSocketRef.current.onopen = () => {
    //         console.log('WebSocket connected');
    //         setIsConnected(true);
    //     };

    //     webSocketRef.current.onmessage = (event) => {
    //         // Parse the message data from the event
    //         const receivedMessage = JSON.parse(event.data);
    //         console.log("Received Msg", receivedMessage)
    //         console.log(receivedMessage)
    //         console.log(currentQuestion)
    //         handleSubmitAnswer(receivedMessage.body)
    //     }

    //     webSocketRef.current.onclose = () => {
    //         console.log('WebSocket disconnected');
    //         setIsConnected(false);
    //     };
    //     console.log("use effect []");
    // }, [webSocketRef])

    //old code ends

    useEffect(() => {
        setQuestionStates(Array(questions.length).fill(initialState));
    }, [questions]);

    // useEffect(() => {
    //     // Parse the socket time from the received message
    //     const socketTime = dayjs('25-07-2023 11:25', 'DD-MM-YYYY HH:mm');

    //     // Calculate the time difference between the current time and the socket time
    //     const currentTime = dayjs();
    //     const timeDifferenceInSeconds = socketTime.diff(currentTime, 'second');
    //     console.log(timeDifferenceInSeconds)

    //     if (timeDifferenceInSeconds <= 0) {
    //       // If the game start time has passed, set the game as started
    //       setIsGameStarted(true);
    //     } else {
    //       // If the game start time is in the future, display the countdown timer
    //       setTimeUntilStart(timeDifferenceInSeconds);
    //       const timerInterval = setInterval(() => {
    //         setTimeUntilStart((prevTime) => Math.max(prevTime - 1, 0));
    //       }, 1000);

    //       // Clean up the interval on unmount
    //       return () => clearInterval(timerInterval);
    //     };
    //     // Rest of your code...
    //   }, []);

    useEffect(() => {
        // Parse the socket time from the received message
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
        // Rest of your code...
    }, [socketTime]);


    useEffect(() => {
        // ...
        const game = props.gameData
        setGameData(game)
        console.log({ gameData })

        // schedule time left
        // const formattedDate = props.gameData.shcedule_date

        // //.format('DD-MM-YYYY HH:mm');
        // console.log((dayjs(gameData.shcedule_date)))
        // console.log(formattedDate);
        // setScheduleDateTime(formattedDate)
        // console.log(scheduleDateTime)
        // console.log("time schedule thayo")

        if (gameData && gameData.questions) {
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

            if (receivedMessage.action === 'submitAns') {
                if (questions.length > 0) {
                    // Questions are loaded, process the WebSocket message immediately.
                    handleSubmitAnswer(receivedMessage.body);
                } else {
                    setWebSocketMessages((prevMessages) => [...prevMessages, receivedMessage.body]);
                }
            }
            else if (receivedMessage.action === 'setTime') {
                if (socketTime === null) {
                    const receivedTime = dayjs(receivedMessage.body, 'DD-MM-YYYY HH:mm');
                    console.log(receivedTime)
                    setSocketTime(receivedTime);
                }

            }
        };

        webSocketRef.current.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        console.log("use effect []");
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
            var user = userData.email;
            setAnsGivenBy(user);
            setSelectedOption(selectedOption); // Store the selected option
            webSocketRef.current.send(JSON.stringify({ action: 'submitAns', body: selectedOption }));
        }
    };

    const calculatePlayerScore = (playerName, isCorrect) => {
        var points = isCorrect ? 5 : 0;
        var playerIndex = scores.findIndex((player) => player.name === playerName);

        if (playerIndex !== -1) {
            // If the player already exists in the scores array, update their score
            var updatedScores = [...scores];
            console.log(updatedScores)
            updatedScores[playerIndex].score += points;
            setScores(updatedScores);
            console.log(JSON.stringify(scores));
        } else {
            var newPlayer = { name: playerName, score: points };
            setScores((prevScores) => [...prevScores, newPlayer]);
        }
        console.log(JSON.stringify(scores));
    };


    const handleSubmitAnswer = (selectedOption) => {
        console.log("call here thay 6e")
        setIsSubmitted(true); // Set to true when the user submits an answer
        // const currentQuestion = questions[currentQuestionIndex];
        const currentQuestion = gameData.questions[currentQuestionIndex];
        //console.log(JSON.stringify(questions))
        //console.log(selectedOption)
        const isCorrect = selectedOption === currentQuestion.correct_ans;
        // team score ..
        const newResponse = {
            userId: ansGivenBy, //userData.email
            question: currentQuestion.question,
            teamId: teamData.message,
            selectedOption: selectedOption,
            correctAnswer: currentQuestion.correct_ans,
            isCorrect: isCorrect,
        };
        setUserResponses((prevResponses) => [...prevResponses, newResponse]);
        calculatePlayerScore(ansGivenBy, isCorrect);
        console.log(JSON.stringify(scores))
        setAnsGivenBy('');

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
                timer: 1000, // Automatically close the popup after 1 seconds
                showConfirmButton: false,
                background: 'white', // Change the background color to white
                iconColor: 'green', // Change the icon color to green
                timerProgressBar: true, // Show progress bar on the timer

            }).then(() => {
                if (!isLastQuestion) {
                    handleNextQuestion(); // Move to the next question after the popup is closed
                }

            });
        } else {
            Swal.fire({
                title: 'Incorrect!',
                text: `The correct answer is: ${currentQuestion.correct_ans} , Explanation : ${currentQuestion.explanation} `,
                icon: 'error',
                timer: 5000, // Automatically close the popup after 3 seconds
                showConfirmButton: false,
                background: 'white', // Change the background color to white
                iconColor: 'red', // Change the icon color to red
                timerProgressBar: true, // Show progress bar on the timer

            }).then(() => {
                if (!isLastQuestion) {
                    handleNextQuestion(); // Move to the next question after the popup is closed
                }
            });
        }


    };

    // useEffect(() => {

    // webSocketRef.current = new WebSocket(webSocketUrl);
    // webSocketRef.current.onopen = () => {
    //     console.log('WebSocket connected');
    //     setIsConnected(true);
    // };

    // webSocketRef.current.onmessage = (event) => {
    //     // Parse the message data from the event
    //     const receivedMessage = JSON.parse(event.data);
    //     console.log("Received Msg", receivedMessage)
    //     console.log(receivedMessage)
    //     handleSubmitAnswer(receivedMessage.body)
    // }

    // webSocketRef.current.onclose = () => {
    //     console.log('WebSocket disconnected');
    //     setIsConnected(false);
    // };

    // }, [webSocketRef]);

    const handleShowHint = () => {
        setShowHint(!showHint);
    };

    return (
        <div style={{ textAlign: 'center', backgroundColor: 'black', minHeight: '100vh' }}>
            {!isGameStarted ? (
                <div style={{ backgroundColor: 'black', minHeight: '100vh' }}>
                    <h2 style={{ textAlign: 'center', color: 'white' }}>Game starts in:</h2>
                    <h3 style={{ textAlign: 'center', color: 'white' }}>{`${Math.floor(timeUntilStart / 60)} mins : ${timeUntilStart % 60} sec left`}</h3>
                </div>
            ) : (
                <div>
                    <div style={{ position: 'absolute', top: '10px', right: '5px', marginTop: '5%' }}>
                        <Card variant="outlined" style={{ background: 'black', borderColor: '#FF5722', borderWidth: '2px', borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant="h6" color="primary">
                                    Real-time Scores
                                </Typography>
                                {teamData.members.map((member) => (
                                    <div key={member.email} style={{ margin: '5px' }}>
                                        <Typography variant="body1" color="textPrimary">
                                            Player {member.email}: {scores.find((score) => score.name === member.email)?.score || 0}
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

                        {isLastQuestion ? (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextQuestion}
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
                    {/* <Msg /> */}
                </div>
            )}
        </div>

    );
};

const GameApp = () => {
    const location = useLocation();
    const gameData = location.state
    console.log(gameData)
    return (
        <ThemeProvider theme={theme}>
            <Game gameData={gameData} />
            <ToastContainer />
        </ThemeProvider>
    );
};

export default GameApp;
