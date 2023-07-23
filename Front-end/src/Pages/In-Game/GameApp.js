import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Msg from '../../Components/Msg';

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

    const currentQuestion = questions[currentQuestionIndex] || { question: "", options: [], correctAnswer: "" };
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // const questions = [
    //     {
    //         question: 'What is the capital of France?',
    //         options: ['London', 'Berlin', 'Paris', 'Madrid'],
    //         correctAnswer: 'Paris',
    //     },
    //     {
    //         question: 'Which planet is known as the Red Planet?',
    //         options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    //         correctAnswer: 'Mars',
    //     },
    //     // Add more questions as needed
    // ];

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setTimer(60); // Reset the timer for the next question
        setIsSubmitted(false)
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setTimer(60); // Reset the timer for the previous question
    };

  
    const handleOptionClick = (selectedOption) => {
        console.log(selectedOption)
        if (!isSubmitted) {
            setSelectedOption(selectedOption); // Store the selected option
            handleSubmitAnswer(selectedOption); // Call handleSubmitAnswer on option selection
            console.log("call")
        }
    };

    const handleSubmitAnswer = (selectedOption) => {
        console.log("call here thay 6e")
        setIsSubmitted(true); // Set to true when the user submits an answer
        const currentQuestion = questions[currentQuestionIndex];
        console.log(currentQuestion)
        console.log(selectedOption)
        if (selectedOption === currentQuestion.correctAnswer) 
        {
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
                if(!isLastQuestion)
                {
                    handleNextQuestion(); // Move to the next question after the popup is closed
                }
        
            });
        } else {
            Swal.fire({
                title: 'Incorrect!',
                text: `The correct answer is: ${currentQuestion.correctAnswer}`,
                icon: 'error',
                timer: 2000, // Automatically close the popup after 3 seconds
                showConfirmButton: false,
                background: 'white', // Change the background color to white
                iconColor: 'red', // Change the icon color to red
                timerProgressBar: true, // Show progress bar on the timer
               
            }).then(() => {
                if(!isLastQuestion)
                {
                    handleNextQuestion(); // Move to the next question after the popup is closed
                }
            });
        }
    };


    // Update the timer every second
    useEffect(() => {
        console.log(props.gameData)
        const game = props.gameData
        setGameData(game)
        console.log({ gameData })

        if (gameData && gameData.questions) {
            const transformedQuestions = gameData.questions.map((q) => ({
                question: q.question,
                options: [q.option_1, q.option_2, q.option_3, q.option_4],
                correctAnswer: q.correct_ans,
            }));
            setQuestions(transformedQuestions);
            console.log(transformedQuestions);
        }

        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
        }, 1000);

        // Clean up the interval on unmount
        return () => clearInterval(timerInterval);
    }, []);




    return (
        <div style={{ textAlign: 'center', backgroundColor: 'black', minHeight: '100vh' }}>
            <div style={{ position: 'absolute', top: '10px', right: '5px', marginTop: '5%' }}>
                <Card variant="outlined" style={{ background: 'black', borderColor: '#FF5722', borderWidth: '2px', borderRadius: '10px' }}>
                    <CardContent>
                        <Typography variant="h6" color="primary">
                            Real-time Scores
                        </Typography>
                        {scores.map((score) => (
                            <div key={score.id} style={{ margin: '5px' }}>
                                <Typography variant="body1" color="textPrimary">
                                    Player {score.playerName}: {score.score}
                                </Typography>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <Typography variant="h4" color="secondary">
                Trivia Game
            </Typography>
            {/* Real-time score tab */}
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
                                disabled={isSubmitted || timer ===0} 
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
            <Msg />
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
