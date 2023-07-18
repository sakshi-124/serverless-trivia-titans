// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Autocomplete, Grid,Container} from '@mui/material';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { functionURL } from '../../Constants'
import { getTimeFrameFunctionURL } from '../../Constants';
import { createGamesFunctionURL } from '../../Constants';
import { apigatewayURL } from '../../Constants';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
 import { useEffect } from 'react';
import axios from "axios";
// import axiosApi from '../../Common/AxiosApi';
// import { useParams } from 'react-router-dom';
// import imageCompression from 'browser-image-compression';

function GameManagement() {
  const [category, setCategory] = useState([]);
    const [level, setLevel] = useState([]);
    const [time_frame, setTimeFrame] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: location.state
    });
    
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

    const handleTimeFrameChange = (event, value) => {
        console.log(value)
        if (value) {
            setFormValues({
                ...formValues,
                frame_id: value.frame_id,
            });
        }
        //console.log(formValues)
    }

    useEffect(() => {
       
        axios.get(functionURL + "getCategory")
            .then(res => {
               // console.log(res.data);
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
               // console.log(res.data);
                const levelDet = [];
                levelDet.push(res.data);
                console.log(levelDet);
                levelDet.map((level) => {
                    setLevel(level);
                    return (<></>)
                });
            });
            
            axios.get(apigatewayURL + "gettimeframe") // change it to api gateway
            .then(res => {
                console.log(res.data);

                const timeframeDet = [];
                timeframeDet.push(JSON.parse(res.data.body));
                console.log(timeframeDet);
                timeframeDet.map((level) => {
                    setTimeFrame([...level]);
                    return (<></>)
                });
            });

    }, []);

console.log(category)
console.log(time_frame)

const onClickAdd = async () => {
    handleSubmit(async () => {
        const createGames = "createGames"
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Set the appropriate origin here or use a wildcard '*'
          };

        // if (formValues._id === "") {
        console.log({ formValues })
        const reqData = {
            level_id: formValues.question,
            category_id: formValues.category_id,
            frame_id: formValues.level_id
        }
        console.log(reqData)
        await axios.post(apigatewayURL + createGames, reqData , {headers}
        )
            .then((res) => {
                console.log(res);
                console.log(res.data);
                if (res.status === 200) {
                    Swal.fire({
                        title: "Game Added..!!",
                        icon: 'success',
                        text: "Redirecting in a second...",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(function () {
                        navigate("/modifyQues",{ replace: true });
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
                <h1> Create Game</h1>
            {/*  */}
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
                                value={formValues._id}
                            />
                        )}
                        InputLabelProps={{ shrink: true }}      
                    />
                </Grid>

                <Grid item style={
                {
                    marginTop: "5%"
                }}>
                    <Autocomplete
                        id="time_frmae"
                        options={time_frame}
                        value={
                            time_frame.find((c) => c.frame_id === formValues.frame_id) || { label: "" }
                        }
                        onChange={handleTimeFrameChange}
                        getOptionLabel={(option) => option.label}
                        getOptionSelected={(option, value) => option.frame_id === value.frame_id}
                        style={{ height: "150" }}
                        renderInput={(params) => (
                            <TextField {...params} label="Time Frame" variant="outlined"
                                //required
                                size="small"
                               value={formValues.frame_id}
                            />
                        )}
                        InputLabelProps={{ shrink: true }}      
                    />
                </Grid>

            <Grid item>
                    <Button  className='header-logo'
                    style={{
                        margin: "5%", backgroundColor: '#0000',
                        color: '#000000', borderColor: '#b28faa', height: 50, width: 130,
                        borderRadius: 7
                    }} 
                    variant="contained"
                    onClick={onClickAdd}
                    >
                        Create
                    </Button>
                    {/* <Button style={{
                        margin: "5%", backgroundColor: '#000000',
                        color: '#bab79d', borderColor: '#b28faa', height: 50, width: 130,
                        borderRadius: 7
                    }} variant="contained"
                        //onClick={onClickModify}
                    >
                        Modify
                    </Button> */}
                </Grid>
        </Box>
    </Grid>
    </Container>
  )
}

export default GameManagement