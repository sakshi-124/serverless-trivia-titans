//saving preferences: POST https://us-central1-reliable-vector-386517.cloudfunctions.net/saveUserPreferences (email: string, preferences: JSON)
//retrieving preferences: POST https://us-central1-reliable-vector-386517.cloudfunctions.net/RetrieveUserPreferences (email: string)
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import React, { useState } from "react";
import Header from "../Header";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SubscribeNotificationsForm = () => {
  const [subscription, setSubscription] = useState({
    achievements: false,
    leaderboardChanges: false,
    gameInvites: false,
    newTriviaGames: false,
  });

  const [isSubmitted, setSubmitted] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleChange = (event) => {
    setSubscription({
      ...subscription,
      [event.target.name]: event.target.checked,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userDetails = await JSON.parse(localStorage.getItem("user"));
    console.log("user", userDetails?.email);
    const response = await axios.post(
      "https://us-central1-reliable-vector-386517.cloudfunctions.net/saveUserPreferences",
      { email: userDetails.email, preferences: subscription }
    );
    console.log(response);
    console.log("User subscription:", subscription);
    setSubmitted(true);
    setOpen(true);
  };

  return (
    <>
      <Header />
      <h2 style={{ textAlign: "center", marginTop: "3rem" }}>
        Select Notifications Preferences
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "4rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscription.achievements}
                  onChange={handleChange}
                  name="achievements"
                  color="primary"
                />
              }
              label="Achievements Unlocked"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscription.leaderboardChanges}
                  onChange={handleChange}
                  name="leaderboardChanges"
                  color="primary"
                />
              }
              label="Leaderboard Rank Changes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscription.gameInvites}
                  onChange={handleChange}
                  name="gameInvites"
                  color="primary"
                />
              }
              label="Game Invites"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscription.newTriviaGames}
                  onChange={handleChange}
                  name="newTriviaGames"
                  color="primary"
                />
              }
              label="New Trivia Games"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
            >
              Save Preferences
            </Button>
          </FormGroup>
        </form>
      </div>
      {isSubmitted && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "4rem",
          }}
        >
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Preferences updated successfully!
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
};

export default SubscribeNotificationsForm;
