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
        docRef: location.state !== null ? location.state.docRef : ""

    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: location.state
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
                status: 1 /*1 as it is not deleted*/
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
                            navigate("/modifyQues", { replace: true });
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
                status: 1
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
                            // {...register("product_name", {
                            //     onChange: (e) => { handleInputChange(e) },
                            //     //required: "Product Name is required.",
                            //     pattern: {
                            //         message: "Product Name is required"
                            //     },
                            //     validate: () => {
                            //         const productName = formValues.product_name.trim()
                            //         console.log(productName);
                            //         if ( productName!== "") {
                            //             return true;
                            //         } else {
                            //             return "ProductName is required";
                            //         }
                            //     }
                            // })}
                            // error={Boolean(errors.product_name)}
                            // helperText={errors.product_name?.message}
                            // required
                            // InputLabelProps={{ shrink: true }}
                            // inputProps ={{style : {textAlign : 'left'}}}
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
                            required
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