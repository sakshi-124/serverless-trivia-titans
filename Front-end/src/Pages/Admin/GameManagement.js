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
                    // value={formValues?.product_name || ''}
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
                //variant="outlined"
                />
            </Grid>

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
                <TextField
                fullWidth
                    //value={formValues.qty || ''}
                   // type="number"
                   name="option_1"
                    label="Option 1"
                    id="option_1"
                />
            </Grid>
            <Grid item style={
                {
                    marginTop: "5%"
                }}>
                <TextField
                fullWidth
                    //value={formValues.qty || ''}
                   // type="number"
                   name="option_2"
                    label="Option 2"
                    id="option_2"
                />
            </Grid>
            <Grid item style={
                {
                    marginTop: "5%"
                }}>
                <TextField
                fullWidth
                    //value={formValues.qty || ''}
                   // type="number"
                   name="option_3"
                    label="Option 3"
                    id="option_3"
                />
            </Grid>
            <Grid item style={
                {
                    marginTop: "5%"
                }}>
                <TextField
                fullWidth
                    //value={formValues.qty || ''}
                   // type="number"
                   name="option_4"
                    label="Option 4"
                    id="option_4"
                />
            </Grid>
            <Grid item style={
                    {
                        marginTop: "5%"
                    }
                }>
            <TextField
            fullWidth
                    id = "correct_ans"
                    //value={formValues.price}
                    name="correct_ans"
                    label="Correct Answer"
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
                        Add
                    </Button>
                    <Button style={{
                        margin: "5%", backgroundColor: '#000000',
                        color: '#bab79d', borderColor: '#b28faa', height: 50, width: 130,
                        borderRadius: 7
                    }} variant="contained"
                        //onClick={onClickModify}
                    >
                        Modify
                    </Button>
                </Grid>
        </Box>
    </Grid>
    </Container>
  )
}

export default GameManagement