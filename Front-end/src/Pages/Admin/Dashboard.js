// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  useEffect(() => {
    let user = localStorage.getItem('user')
    //console.log(user)
    if (user === null) {
      navigate('/Home')
    }
});

  return (
    <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <iframe
      title="Looker Report"
      width="100%"
      height="100%"
      src="https://lookerstudio.google.com/embed/reporting/eff2cefe-9374-4e4c-a49f-a40e05c5e49b/page/VniYD"
      frameBorder="0"
      style={{ border: 0 }}
      allowFullScreen
    ></iframe>
  </div>

  );
};

export default Dashboard;
