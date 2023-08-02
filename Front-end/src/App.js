import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
// import Authentication from './Pages/Authentication';
import { useEffect } from "react";

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Verification from "./Pages/Verification";

import ChatbotWidget from "./Components/ChatBot/ChatBot";
import SubscribeNotificationsForm from "./Components/notifications/NotificationsPreferences";
import Leaderboard from "./Pages/Leaderboard";

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
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Authentication />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Home />} />
        <Route path="/chat" element={<ChatbotWidget />} />
        <Route path="/notifications" element={<SubscribeNotificationsForm />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
