// Import the axios library for making HTTP requests
import axios from "axios";

/**
 * Function to send notifications to the specified URL.
 * @param {string} url - The URL to send the POST request for sending notifications.
 * @param {string} user - The user to whom the notification will be sent.
 * @param {string|Object} details - The details of the notification (string or JSON).
 */
export const sendNotifications = async (url, user, details) => {
  try {
    const response = await axios.post(url, {
      user,
      details,
    });

    console.log("Notification response:", response.data);
  } catch (error) {
    console.error(
      "Error sending notifications:",
      error.response?.data || error.message
    );
  }
};

/**
 * Function to retrieve notification preferences from the specified URL.
 * @param {string} url - The URL to send the POST request for retrieving preferences.
 * @param {string} email - The email of the user to retrieve preferences for.
 */
export const retrieveNotificationPreferences = async (url, email) => {
  try {
    const response = await axios.post(url, {
      email,
    });

    console.log("Notification preferences:", response.data.preferences);
  } catch (error) {
    console.error(
      "Error retrieving preferences:",
      error.response?.data || error.message
    );
  }
};

export const retrieveNotifications = async (url, email) => {
  try {
    const response = await axios.post(url, {
      email,
    });

    console.log("Notification data:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error retrieving preferences:",
      error.response?.data || error.message
    );
  }
};

/**
 * Function to save user preferences to the specified URL.
 * @param {string} url - The URL to send the POST request for saving user preferences.
 * @param {string} email - The email of the user to save preferences for.
 * @param {Object} preferences - The user's preferences to be saved (in JSON format).
 */
export const saveUserPreferences = async (url, email, preferences) => {
  try {
    const response = await axios.post(url, {
      email,
      preferences,
    });

    console.log("Preferences saved:", response.data);
  } catch (error) {
    console.error(
      "Error saving preferences:",
      error.response?.data || error.message
    );
  }
};

export const isAchievementsNotificationSet = async (url, email) => {
  const preferences = await retrieveNotificationPreferences(url, email);
  return preferences?.achievements === true;
};

export const isLeaderBoardChangesNotificationsSet = async (url, email) => {
  const preferences = await retrieveNotificationPreferences(url, email);
  return preferences?.leaderboardChanges === true;
};

export const isGameInvitesNotificationsSet = async (url, email) => {
  const preferences = await retrieveNotificationPreferences(url, email);
  return preferences?.gameInvites === true;
};

export const isNewTriviaGamesSet = async (url, email) => {
  const preferences = await retrieveNotificationPreferences(url, email);
  return preferences?.newTriviaGames === true;
};
