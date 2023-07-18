// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Autocomplete, Grid,Container} from '@mui/material';
import Button from '@mui/material/Button';
// import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { functionURL } from '../../Constants'
import { getTimeFrameFunctionURL } from '../../Constants';
// import Swal from 'sweetalert2';
// import { useNavigate, useLocation } from 'react-router-dom';
 import { useEffect } from 'react';
import axios from "axios";
// import axiosApi from '../../Common/AxiosApi';
// import { useParams } from 'react-router-dom';
// import imageCompression from 'browser-image-compression';

function GameManagement() {
  const [category, setCategory] = useState([]);
    const [level, setLevel] = useState([]);
    const [time_frame, setTimeFrame] = useState([]);

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
            
            axios.get(getTimeFrameFunctionURL)
            .then(res => {
                console.log(res.data);
                const timeframeDet = [];
                timeframeDet.push(res.data);
                console.log(timeframeDet);
                timeframeDet.map((level) => {
                    setTimeFrame(level);
                    return (<></>)
                });
            });

    }, []);

console.log(category)

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
                        // value={
                        //     category.find((c) => c.id === formValues._id) || { label: "" }
                        // }
                        //onChange={handleRefNumberChange}
                        getOptionLabel={(option) => option.label}
                        //getOptionSelected={(option, value) => option._id === value._id}
                        style={{ height: "150" }}
                        renderInput={(params) => (
                            <TextField {...params} label="Category" variant="outlined"
                                //required
                                size="small"
                               // value={formValues._id}
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
                        // value={
                        //     refNumber.find((c) => c._id === formValues._id) || { label: "" }
                        // }
                        //onChange={handleRefNumberChange}
                        getOptionLabel={(option) => option.label}
                        //getOptionSelected={(option, value) => option._id === value._id}
                        style={{ height: "150" }}
                        renderInput={(params) => (
                            <TextField {...params} label="Difficulty Level" variant="outlined"
                                //required
                                size="small"
                               // value={formValues._id}
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
                        // value={
                        //     refNumber.find((c) => c._id === formValues._id) || { label: "" }
                        // }
                        //onChange={handleRefNumberChange}
                        getOptionLabel={(option) => option.label}
                        //getOptionSelected={(option, value) => option._id === value._id}
                        style={{ height: "150" }}
                        renderInput={(params) => (
                            <TextField {...params} label="Time Frame" variant="outlined"
                                //required
                                size="small"
                               // value={formValues._id}
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
                        //onClick={onClickAdd}
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