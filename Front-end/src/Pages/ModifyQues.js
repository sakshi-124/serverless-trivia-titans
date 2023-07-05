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
// import { useState } from 'react';
// import Swal from 'sweetalert2';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import axiosApi from '../../Common/AxiosApi';
// import { useParams } from 'react-router-dom';
// import imageCompression from 'browser-image-compression';

function ModifyQues() {
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
                mt: 1, marginTop: 8,
                maxWidth: "100%"
            }}
        >
                <h1> Add/Modify Questions</h1>
            {/*  */}
            <Grid item style={
                {
                    marginTop: "5%"
                }
            }>
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
                        //options={refNumber}
                        // value={
                        //     refNumber.find((c) => c._id === formValues._id) || { label: "" }
                        // }
                        //onChange={handleRefNumberChange}
                        //getOptionLabel={(option) => option.label}
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
                        id="level"
                        //options={refNumber}
                        // value={
                        //     refNumber.find((c) => c._id === formValues._id) || { label: "" }
                        // }
                        //onChange={handleRefNumberChange}
                        //getOptionLabel={(option) => option.label}
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
                    <Button style={{
                        margin: "5%", backgroundColor: '#000000',
                        color: '#bab79d', borderColor: '#b28faa', height: 50, width: 150,
                        borderRadius: 7
                    }} variant="contained"
                        //onClick={onClickAdd}
                    >
                        Add
                    </Button>
                    <Button style={{
                        margin: "5%", backgroundColor: '#000000',
                        color: '#bab79d', borderColor: '#b28faa', height: 50, width: 150,
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

export default ModifyQues