import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import React, { useEffect, useState } from "react";
import Header from "../Header";
import { API_GATEWAY_NOTIFICATIONS_URL } from "./NotificationConstants";
import {
  retrieveNotifications,
  saveUserPreferences,
} from "./NotificationsHelpers";
import { NotificationCard } from "./NotificationsCard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  const [notificationData, setNotifications] = useState([]);

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
        `${API_GATEWAY_NOTIFICATIONS_URL}/userPreferences`,
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

  const getNotifications = async () => {
    try {
      // Save user preferences using the saveUserPreferences function
      const userDetails = await JSON.parse(localStorage.getItem("user"));
      const data = await retrieveNotifications(
        `${API_GATEWAY_NOTIFICATIONS_URL}/retrieveNotifications`,
        userDetails?.email
      );
      setNotifications(data);
      console.log(notificationData);
      console.log("User subscription:", data);
    } catch (error) {
      console.error(
        "Error saving preferences:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <h2 style={{ textAlign: "center" }}>Your Notifications </h2>
        </AccordionSummary>
        <AccordionDetails>
          {notificationData.length > 0 &&
            notificationData.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          {notificationData.length == 0 ? (
            <div>
              <p>You have no notifications</p>
            </div>
          ) : null}
        </AccordionDetails>
      </Accordion>
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
