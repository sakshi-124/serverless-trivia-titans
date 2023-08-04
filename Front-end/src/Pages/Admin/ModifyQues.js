// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Autocomplete, Grid, Container } from '@mui/material';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { apigatewayURL, functionURL } from '../../Constants'
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from "axios";

function ModifyQues() {

    const [category, setCategory] = useState([]);
    const [level, setLevel] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    //console.log(location.state)

    const defaultValues = {
        question: location.state !== null ? location.state.question : "",
        category_id: location.state !== null ? location.state.category : "",
        level_id: location.state !== null ? location.state.difficulty : "",
        option_1: location.state !== null ? location.state.option_1 : "",
        option_2: location.state !== null ? location.state.option_2 : "",
        option_3: location.state !== null ? location.state.option_3 : "",
        option_4: location.state !== null ? location.state.option_4 : "",
        correct_ans: location.state !== null ? location.state.correct_ans : "",
        docRef: location.state !== null ? location.state.docRef : "",
        hint : location.state !== null ? location.state.hint : "",
        explanation : location.state !== null ? location.state.explanation : "",
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: location.state
    });

    useEffect(() => {
        let user = localStorage.getItem('user')
        //console.log(user)
        if (user === null) {
          navigate('/Home')
        }
    });

    useEffect(() => {
        setFormValues(defaultValues);
        console.log(defaultValues)
    }, [location.state], [])

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

    const handleInputChange = async (e) => {
        console.log(e.target.label);
        const target = e.target;
        const name = target.name;
        const value = target.value;

        console.log("name = " + name);
        console.log("value" + value);

        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleCategoryChange = (event, value) => {
        console.log(value)
        if (value) {
            setFormValues({
                ...formValues,
                category_id: value.category_id,
            });
        }
        //console.log(formValues)
    }

    const handleLevelChange = (event, value) => {
        console.log(value)
        if (value) {
            setFormValues({
                ...formValues,
                level_id: value.level_id,
            });
        }
        //console.log(formValues)
    }


    const onClickAdd = async () => {
        handleSubmit(async () => {
            const addQue = "addQuestion"

            // if (formValues._id === "") {
            console.log({ formValues })
            const reqData = {
                question: formValues.question,
                category: formValues.category_id,
                difficulty: formValues.level_id,
                option_1: formValues.option_1,
                option_2: formValues.option_2,
                option_3: formValues.option_3,
                option_4: formValues.option_4,
                correct_ans: formValues.correct_ans,
                status: 1 /*1 as it is not deleted*/,
                hint : formValues.hint,
                explanation : formValues.explanation
            }
            console.log(reqData)
            await axios.post(functionURL + addQue, reqData
            )
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    if (res.status === 200) {
                        Swal.fire({
                            title: "Question Added..!!",
                            icon: 'success',
                            text: "Redirecting in a second...",
                            timer: 1500,
                            showConfirmButton: false
                        }).then(function () {
                            // navigate("/modifyQues", { replace: true });
                            navigate("/questions");
                        })
                    }
                })
                .catch((err) => console.log(err));
            // }
            // else {
            //     Swal.fire({
            //         title: "Product is already exists.., Use Modify button to update",
            //         icon: 'warning',
            //         text: "Redirecting in a second...",
            //         timer: 2000,
            //         showConfirmButton: false
            //     }).then(function () {
            //         //setFormValues(defaultValues);
            //     })
            // }

        })((errors) => {
            // handle form validation errors here
        });
    };

    const onClickModify = async () => {
        handleSubmit(async () => {
            const reqData = {
                reqPath: "updateQue",
                question: formValues.question,
                category: formValues.category_id,
                difficulty: formValues.level_id,
                option_1: formValues.option_1,
                option_2: formValues.option_2,
                option_3: formValues.option_3,
                option_4: formValues.option_4,
                correct_ans: formValues.correct_ans,
                docRef: formValues.docRef._path.segments[1],
                status: 1,
                hint : formValues.hint,
                explanation : formValues.explanation
            }
            console.log(reqData)
            await axios.post(apigatewayURL + "managequestion", reqData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    if (res.status === 200) {
                        Swal.fire({
                            title: "Question Updated..!!",
                            icon: 'success',
                            text: "Redirecting in a second...",
                            timer: 1500,
                            showConfirmButton: false
                        }).then(function () {
                            navigate("/questions");
                            // window.location.replace()
                        })
                    }
                })
                .catch((err) => console.log(err));

        })((errors) => {
            // handle form validation errors here
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Grid
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 'normal'
                }}>
                <CssBaseline />
                <Box component="form" noValidate autoComplete="off"
                    // sx={{}}
                    sx={{
                        mt: 1, marginTop: 2,
                        maxWidth: "100%"
                    }}
                >
                    <h1> Add/Modify Questions</h1>
                    {/*  */}
                    <Grid item
                    >
                        <TextField
                            autoFocus
                            fullWidth
                            //inputRef={refNumber}
                            label="Question"
                            name="question"
                            id="question"
                            value={formValues?.question || ''}
                            onChange={handleInputChange}
                            required
                            {...register("question", {
                                onChange: (e) => { handleInputChange(e) },
                              required: 'Question is required.',
                            })}
                            error={!!errors.question}
                            helperText={errors.question?.message}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textAlign: 'left' } }}
                            variant="outlined"

                        />
                    </Grid>

                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <Autocomplete
                            id="category"
                            options={category}
                            value={
                                category.find((c) => c.category_id === formValues.category_id) || { label: "" }
                            }
                            onChange={handleCategoryChange}
                            getOptionLabel={(option) => option.label}
                            getOptionSelected={(option, value) => option.category_id === value.category_id}
                            style={{ height: "150" }}
                            renderInput={(params) => (
                                <TextField {...params} label="Category" variant="outlined"
                                    //required
                                    size="small"
                                    value={formValues.category_id}
                                    {...register("category_id", {
                                        onChange: (e) => { handleCategoryChange(e) },
                                        //required: "Category is required.",
                                        pattern: {
                                            message: "Category is required"
                                        },
                                        validate: () => {
                                            const cate_id = formValues.category_id
                                            if (cate_id !=="") {
                                                return true;
                                            } else {
                                                return "Category is required";
                                            }
                                        }
                                    })
                                    }
                                    error={Boolean(errors.category_id)}
                                    helperText={errors.category_id?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <Autocomplete
                            id="difficulty"
                            options={level}
                            value={
                                level.find((c) => c.level_id === formValues.level_id) || { label: "" }
                            }
                            onChange={handleLevelChange}
                            getOptionLabel={(option) => option.label}
                            getOptionSelected={(option, value) => option.level_id === value.level_id}
                            style={{ height: "150" }}
                            renderInput={(params) => (
                                <TextField {...params} label="Difficulty Level" variant="outlined"
                                    //required
                                    size="small"
                                    value={formValues.level_id}
                                    {...register("level_id", {
                                        onChange: (e) => { handleLevelChange(e) },
                                        //required: "Category is required.",
                                        pattern: {
                                            message: "Level is required"
                                        },
                                        validate: () => {
                                            const level_id = formValues.level_id
                                            if (level_id !=="") {
                                                return true;
                                            } else {
                                                return "Level is required";
                                            }
                                        }
                                    })
                                    }
                                    error={Boolean(errors.level_id)}
                                    helperText={errors.level_id?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                            InputLabelProps={{ shrink: true }}
                            required
                        />
                    </Grid>

                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <TextField
                            fullWidth
                            value={formValues.option_1 || ''}
                            // type="number"
                            name="option_1"
                            label="Option 1"
                            id="option_1"
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                             inputProps={{ style: { textAlign: 'left' } }}
                             variant="outlined"
                            required
                            {...register("option_1", {
                                onChange: (e) => { handleInputChange(e) },
                              required: 'Option 1 is required.',
                            })}
                            error={!!errors.option_1}
                            helperText={errors.option_1?.message}
                            
                        />
                    </Grid>
                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <TextField
                            fullWidth
                            value={formValues.option_2 || ''}
                            // type="number"
                            name="option_2"
                            label="Option 2"
                            id="option_2"
                            onChange={handleInputChange}
                            required
                            {...register("option_2", {
                                onChange: (e) => { handleInputChange(e) },
                              required: 'Option 2 is required.',
                            })}
                            error={!!errors.option_2}
                            helperText={errors.option_2?.message}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textAlign: 'left' } }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <TextField
                            fullWidth
                            value={formValues.option_3 || ''}
                            // type="number"
                            name="option_3"
                            label="Option 3"
                            id="option_3"
                            onChange={handleInputChange}
                            required
                              {...register("option_3", {
                                onChange: (e) => { handleInputChange(e) },
                                required: 'Option 3 is required.',
                              })}
                              error={!!errors.option_3}
                              helperText={errors.option_3?.message}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ style: { textAlign: 'left' } }}
                              variant="outlined"
                        />
                    </Grid>
                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <TextField
                            fullWidth
                            value={formValues.option_4 || ''}
                            // type="number"
                            name="option_4"
                            label="Option 4"
                            id="option_4"
                            onChange={handleInputChange}
                            required
                            {...register("option_4", {
                                onChange: (e) => { handleInputChange(e) },
                                required: 'Option 4 is required.',
                              })}
                              error={!!errors.option_4}
                              helperText={errors.option_4?.message}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ style: { textAlign: 'left' } }}
                              variant="outlined"
                        />
                    </Grid>
                    <Grid item style={
                        {
                            marginTop: "5%"
                        }
                    }>
                        <TextField
                            fullWidth
                            id="correct_ans"
                            value={formValues.correct_ans}
                            name="correct_ans"
                            label="Correct Answer"
                            onChange={handleInputChange}
                            required
                            {...register("correct_ans", {
                                onChange: (e) => { handleInputChange(e) },
                                required: 'Ans is required.',
                              })}
                              error={!!errors.correct_ans}
                              helperText={errors.correct_ans?.message}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ style: { textAlign: 'left' } }}
                              variant="outlined"
                        />
                    </Grid>
                    <Grid item style={
                        {
                            marginTop: "5%"
                        }}>
                        <TextField
                            fullWidth
                            value={formValues.hint || ''}
                            // type="number"
                            name="hint"
                            label="Hint"
                            id="hint"
                            onChange={handleInputChange}
                            required
                            {...register("hint", {
                                onChange: (e) => { handleInputChange(e) },
                              required: 'Hint is required.',
                            })}
                            error={!!errors.hint}
                            helperText={errors.hint?.message}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textAlign: 'left' } }}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item style={
                    {
                        marginTop: "1%"
                    }}>
                    <TextField
                        multiline
                        rows={3}
                        margin="normal"
                        fullWidth
                        label="Ans Explanation"
                        name="explanation"
                        value={formValues.explanation}
                        {...register("explanation", {
                            onChange: (e) => { handleInputChange(e) },
                            //required: "Description is required.",
                            pattern: {
                                message: "Explanation is required"
                            },
                            validate: () => {
                                const trimmedExplanation = formValues?.explanation?.trim();
                                const len = trimmedExplanation?.length;
                                if (len > 0) {
                                    return true;
                                } else {
                                    return "Explanation is required";
                                }
                            }
                        })
                        }
                        error={Boolean(errors.explanation)}
                        helperText={errors.explanation?.message}
                        required
                        InputLabelProps={{ shrink: true }}
                        inputProps ={{style : {textAlign : 'left'}}}
                    />
                </Grid>
                    <Grid item>
                        <Button className='header-logo'
                            style={{
                                margin: "5%", backgroundColor: '#0000',
                                color: '#000000', borderColor: '#b28faa', height: 50, width: 130,
                                borderRadius: 7
                            }}
                            variant="contained"
                            onClick={onClickAdd}
                            disabled={formValues.docRef !== ""}

                        >
                            Add
                        </Button>
                        <Button style={{
                            margin: "5%", backgroundColor: '#000000',
                            color: '#bab79d', borderColor: '#b28faa', height: 50, width: 130,
                            borderRadius: 7
                        }} variant="contained"
                            disabled={formValues.docRef === ""}
                            onClick={onClickModify}
                        >
                            Modify
                        </Button>
                    </Grid>
                </Box>
            </Grid>
        </Container>
    )
}

export default ModifyQues