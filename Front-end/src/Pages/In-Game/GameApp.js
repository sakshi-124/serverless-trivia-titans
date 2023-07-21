import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const Game = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timer, setTimer] = useState(60); // 1 minute per question
    const [scores, setScores] = useState([]);

    const questions = [
        {
            question: 'What is the capital of France?',
            options: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctAnswer: 'Paris',
        },
        {
            question: 'Which planet is known as the Red Planet?',
            options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
            correctAnswer: 'Mars',
        },
        // Add more questions as needed
    ];

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
        setTimer(60); // Reset the timer for the next question
    };

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setTimer(60); // Reset the timer for the previous question
    };

    const handleOptionClick = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            console.log('Correct!');
        } else {
            console.log('Incorrect!');
        }
    };

    // Update the timer every second
    useEffect(() => {
        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
        }, 1000);

        // Clean up the interval on unmount
        return () => clearInterval(timerInterval);
    }, []);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

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
                        {currentQuestion.question}
                    </Typography>
                    {currentQuestion.options.map((option) => (
                        <div key={option} style={{ margin: '10px' }}>
                            <Button
                                variant="outlined"
                                style={{ minWidth: '100px', color: 'white' }}
                                onClick={() => handleOptionClick(option)}
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
                        disabled={timer === 0}
                        sx={{ backgroundColor: '#FF5722' }}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
};

const GameApp = () => {
    return (
        <ThemeProvider theme={theme}>
            <Game />
        </ThemeProvider>
    );
};

export default GameApp;
