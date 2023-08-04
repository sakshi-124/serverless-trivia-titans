import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
// import Authentication from './Pages/Authentication';
import { useEffect } from "react";

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Verification from "./Pages/Verification";
import ModifyQues from "./Pages/Admin/ModifyQues";
import Header from "./Components/Header";
import CreateGames from "./Pages/Admin/CreateGames";
import Games from "./Pages/Admin/Games";
import GameApp from "./Pages/In-Game/GameApp";
import QuestionsDet from "./Pages/Admin/QuestionsDet";
import Dashboard from "./Pages/Admin/Dashboard";

import ChatbotWidget from "./Components/ChatBot/ChatBot";
import SubscribeNotificationsForm from "./Components/notifications/NotificationsPreferences";
import { StatisticsDashboard } from "./Pages/Statistics/StatisticsDashboard";
import Leaderboard from "./Pages/Leaderboard";
import Scoreboard from "./Pages/In-Game/Scoreboard";
import { API_GATEWAY_NOTIFICATIONS_URL } from "./Components/notifications/NotificationConstants";
import {
  retrieveNotificationPreferences,
  sendNotifications,
} from "./Components/notifications/NotificationsHelpers";

function App() {
  useEffect(() => {
    // Amplify.configure({
    //   Auth: {
    //     region: 'us-east-1',
    //     userPoolId: 'us-east-1_1Xcd4lxHQ',
    //     userPoolWebClientId: '6hn9vmanqlt905sa1n0skc8ql6',
    //     oauth: {
    //       domain: 'triviatitans.auth.us-east-1.amazoncognito.com',
    //       scope: ['email', 'profile', 'openid'],
    //       redirectSignIn: 'http://localhost:3000',
    //       responseType: 'code'
    //     }
    //   }
    // });
  }, []);
  useEffect(() => {
    // Amplify.configure({
    //   Auth: {
    //     region: 'us-east-1',
    //     userPoolId: 'us-east-1_1Xcd4lxHQ',
    //     userPoolWebClientId: '6hn9vmanqlt905sa1n0skc8ql6',
    //     oauth: {
    //       domain: 'triviatitans.auth.us-east-1.amazoncognito.com',
    //       scope: ['email', 'profile', 'openid'],
    //       redirectSignIn: 'http://localhost:3000',
    //       responseType: 'code'
    //     }
    //   }
    // });
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Authentication />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Home />} />
        <Route path="/modifyQues" element={<ModifyQues />} />
        <Route path="/manageGames/:isFromGames" element={<CreateGames />} />
        <Route path="/games" element={<Games />} />
        <Route path="/playGames" element={<GameApp />} />
        <Route path="/questions" element={<QuestionsDet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notifications" element={<SubscribeNotificationsForm />} />
        <Route path="/statistics" element={<StatisticsDashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
