import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  // Dummy gameplay data
  const gameplayData = [
    { date: '2023-07-21', score: 100 },
    { date: '2023-07-22', score: 120 },
    { date: '2023-07-23', score: 90 },
    // Add more data points as needed
  ];

  // Dummy user engagement data
  const userEngagementData = [
    { date: '2023-07-21', activeUsers: 150 },
    { date: '2023-07-22', activeUsers: 180 },
    { date: '2023-07-23', activeUsers: 120 },
    // Add more data points as needed
  ];

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
