// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React, { useState, useEffect } from 'react';
import { Autocomplete, Grid, Container } from '@mui/material';
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { apigatewayURL, functionURL } from '../../Constants'
import Swal from 'sweetalert2';
import Title from 'antd/es/skeleton/Title';

const QuestionsDet = () => {

    const [category, setCategory] = useState([]);
    const [level, setLevel] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

    let navigate = useNavigate();

    useEffect(() => {
        let user = localStorage.getItem('user')
       // console.log(user)
        if (user === null) {
          navigate('/Home')
        }
    });

    useEffect(() => {

        axios.get(functionURL + "getCategory")
            .then(res => {
                console.log(res.data);
                const cateDet = [];
                cateDet.push(res.data);
                console.log(cateDet);
                cateDet.map((category) => {
                    setCategory(category);
                    return (<></>)
                });
            });

        axios.get(functionURL + "getLevel")
            .then(res => {
                console.log(res.data);
                const levelDet = [];
                levelDet.push(res.data);
                console.log(levelDet);
                levelDet.map((level) => {
                    setLevel(level);
                    return (<></>)
                });
            });

    }, []);

    const handleCategoryChange = (event, value) => {
        console.log(value)
        if (value) {
            setSelectedCategory(value.category_id);
        }
        //console.log(formValues)
    }

    const handleLevelChange = (event, value) => {
        console.log(value)
        if (value) {
            setSelectedLevel(value.level_id);
        }
        //console.log(formValues)
    }

    const handleFetchQuestions = () => {
        // In a real-world scenario, you would fetch questions from the backend using selectedCategory and selectedLevel
        // Here, we'll just use dummy data for demonstration purposes
        const dummyQuestions = [
            { id: 1, text: 'What is 2 + 2?', category: 'Mathematics', level: 'Easy' },
            { id: 2, text: 'What is the capital of France?', category: 'History', level: 'Medium' },
            { id: 3, text: 'What is H2O?', category: 'Science', level: 'Hard' },
        ];
        let path = "/managequestion"

        const reqData = {
            reqPath: "getQues",
            category_id: selectedCategory,
            level_id: selectedLevel
        }

        axios.post(apigatewayURL + path, reqData).then((res) => {
            console.log(res.data.body)
            // const quesDet = [];
            //     quesDet.push(res.data.body);
            //     console.log(quesDet);
            //     quesDet.map((ques) => {
            //         setQuestions(ques);
            //         return (<></>)
            //     });
            //     console.log({questions})
            //setQuestions(res.data.body)

            const questionsFromAPI = [];
            questionsFromAPI.push(res.data.body)
            console.log(questionsFromAPI)
            setQuestions(res.data.body)
            const dummyQuestions = []
            // setQuestions(questionsFromAPI.map((question) => (

            //     {
            //     id: 1,
            //     text: question.question,
            //     category: `Category ${question.category}`,
            //     level: `Level ${question.difficulty}`,
            //   })))
            //   console.log(dummyQuestions)
            //setQuestions(dummyQuestions)

        }).catch((err) => {
            console.log(err)
            Swal.fire("Error")
        })
    };
    const handleQuestionClick = (question) => {
        console.log(question)
        navigate('/modifyQues', { replace: true, state: question });
    };

    const handleQuestionCheckboxToggle = (question) => {
       const newStatus = question.status === 0 ? 1 : 0;
        console.log(question.docRef._path.segments[1])
        console.log(newStatus)
        const reqData = {
            reqPath : "deleteQue" ,
            docRef :question.docRef._path.segments[1],
            status : newStatus
        }

        axios.post(apigatewayURL + "managequestion" , reqData).then ((res) =>
        {
        if(res.data.statusCode === 200)
        {
            const msg = newStatus === 0 ? "Question Deleted..!!" : "Question is activated"
            Swal.fire({
                title: msg,
                icon: 'success',
                text: "Redirecting in a second...",
                timer: 1500,
                showConfirmButton: false
            }).then(function () {
                navigate("/questions", { replace: true });
                handleFetchQuestions()
            })
        }
        else
        {
            console.log(res.data)
            Swal.fire({
                title: "Error..!!",
                icon: 'error',
                text: "Redirecting in a second...",
                timer: 1500,
                showConfirmButton: false
            }).then(function () {
                navigate("/questions", { replace: true });
            })
        }
        })
      };
      
    return (
        <Container maxWidth="sm">
            <Grid container spacing={2} sx={{
                mt: 1, marginTop: 2,
                maxWidth: "60%"
            }} justify="center">
                <Grid item xs={12} >
                    <Autocomplete
                        id="category"
                        options={category}
                        value={
                            category.find((c) => c.category_id === selectedCategory) || { label: "" }
                        }
                        onChange={handleCategoryChange}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option, value) => option.category_id === value.category_id}
                        style={{ height: "150" }}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" variant="outlined"
                                //required
                                size="small"
                                value={selectedCategory}
                            />
                        )}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="difficulty"
                        options={level}
                        value={
                            level.find((c) => c.level_id === selectedLevel) || { label: "" }
                        }
                        onChange={handleLevelChange}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option, value) => option.level_id === value.level_id}
                        style={{ height: "150" }}
                        renderInput={(params) => (
                            <TextField {...params} label="Difficulty Level" variant="outlined"
                                //required
                                size="small"
                                value={selectedLevel}
                            />
                        )}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleFetchQuestions}>
                        Fetch Questions
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '5%' }}>
                {questions.length > 0 && (
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Questions</TableCell>
                                    <TableCell align="center">Is Deleted</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell component="th" scope="row" onClick={() => handleQuestionClick(question)}>
                                            {question.question}
                                        </TableCell>
                                        <TableCell align="center">
                                            <input
                                                type="checkbox"
                                                checked={question.status === 0}
                                                onChange={(e) => handleQuestionCheckboxToggle(question)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                )}
            </Grid>
        </Container>
    );
};

export default QuestionsDet;
