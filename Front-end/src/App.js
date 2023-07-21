import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
// import Authentication from './Pages/Authentication';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Verification from './Pages/Verification';
import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import ModifyQues from './Pages/Admin/ModifyQues';
import Header from './Components/Header';
import CreateGames from "./Pages/Admin/CreateGames";
import Games from "./Pages/Admin/Games";
import GameApp from "./Pages/In-Game/GameApp";

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
  }, [])

  return (
    <div>
    <Header /> 
      <Routes>
        {/* <Route path="/" element={<Authentication />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<Home />} />
        <Route path='/modifyQues' element = {<ModifyQues />} />
        <Route path="/manageGames/:isFromGames" element = {<CreateGames/>} />
        <Route path="/games" element = {<Games />} />
        <Route path="/playGame" element = {<GameApp />} />
        
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
