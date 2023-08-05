// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    color: '#fff',
  },
  tableContainer: {
    margin: theme.spacing(2),
  },
}));

const Scoreboard = () => {
  const classes = useStyles();
  const location = useLocation();
  //console.log(location.state);

  const { team, teamScore, memberScore, won } = location.state;

  const members = Object.keys(memberScore).map((email) => ({
    name: email,
    score: memberScore[email],
  }));

  return (
    <div className={classes.container}  style = {{minHeight: '100vh'}}>
      {won ? (
        <Typography variant="h4" color="primary" align="center">
          Congratulations! Your team won!
        </Typography>
      ) : (
        <Typography variant="h4" color="secondary" align="center">
          Oops, better luck next time!
        </Typography>
      )}

      {/* Team Scores Table */}
      <div className={classes.tableContainer}>
        <Typography variant="h5" align="center" gutterBottom>
          Team Scores
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Team Scores">
            <TableHead>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>Team Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{team}</TableCell>
                <TableCell>{teamScore}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Members Scores Table */}
      <div className={classes.tableContainer}>
        <Typography variant="h5" align="center" gutterBottom>
          Member Performance
        </Typography>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Members Scores">
            <TableHead>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>Member Name</TableCell>
                <TableCell>Member Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={`${team}-${member.name}`}>
                  {index === 0 ? (
                    <TableCell rowSpan={members.length}>{team}</TableCell>
                  ) : null}
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Scoreboard;
