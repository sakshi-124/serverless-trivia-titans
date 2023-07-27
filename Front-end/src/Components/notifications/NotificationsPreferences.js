import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useState } from "react";
import Header from "../Header";
import { API_GATEWAY_NOTIFICATIONS_URL } from "./NotificationConstants";
import { saveUserPreferences } from "./NotificationsHelpers";

/**
 * Custom Alert component using MuiAlert for displaying success messages.
 */
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

/**
 * Component for managing user notification preferences.
 */
const SubscribeNotificationsForm = () => {
  // State to hold the user's notification subscription preferences
  const [subscription, setSubscription] = useState({
    achievements: false,
    leaderboardChanges: false,
    gameInvites: false,
    newTriviaGames: false,
  });

  // State to track whether the form is submitted
  const [isSubmitted, setSubmitted] = useState(false);

  // State to manage the Snackbar for displaying success message
  const [open, setOpen] = React.useState(false);

  /**
   * Event handler for checkbox changes.
   * Updates the subscription state when a checkbox is toggled.
   */
  const handleChange = (event) => {
    setSubscription({
      ...subscription,
      [event.target.name]: event.target.checked,
    });
  };

  /**
   * Event handler for closing the Snackbar.
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  /**
   * Event handler for form submission.
   * Saves user preferences using the saveUserPreferences helper function.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userDetails = await JSON.parse(localStorage.getItem("user"));
    console.log("user", userDetails?.email);
    try {
      // Save user preferences using the saveUserPreferences function
      const response = await saveUserPreferences(
        `${API_GATEWAY_NOTIFICATIONS_URL}/saveUserPreferences`,
        userDetails.email,
        subscription
      );
      console.log("User subscription:", subscription);
      console.log("Preferences saved:", response);
      setSubmitted(true);
      setOpen(true);
    } catch (error) {
      console.error(
        "Error saving preferences:",
        error.response?.data || error.message
      );
    }
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
