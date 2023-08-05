// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

import React from 'react'
import { apigatewayURL } from '../../Constants';
import { useEffect, useState } from 'react'
import axios from "axios";
import GamesCard from '../../Components/GamesCard';
import Typography from '@mui/material/Typography'; 
import { useNavigate, useLocation } from 'react-router-dom';


function Games() {

  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let user = localStorage.getItem('user')
   // console.log(user)
    if (user === null) {
      navigate('/Home')
    }
});
    useEffect(() => {
       const reqPath = "/getgames"
       const data = {
        reqPath : reqPath
       }
        axios.post( apigatewayURL+ reqPath , data )
            .then(res => {
                console.log(res.data);
                console.log(res.data["body-json"])
                const reqData = res.data["body-json"]
                console.log(reqData.gamesResponse.body)
                const gamesData = reqData.gamesResponse.body.games
                const gamesDet = [];
                gamesDet.push(gamesData);
                console.log(gamesDet);
                gamesDet.map((game) => {
                    setGames(game);
                    return (<></>)
                });
            });
    }, []);

    console.log(games)

  return (
    <div style={{ backgroundColor: 'black',minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h3" style={{ fontFamily: 'Pacifico', color: 'white', textAlign : 'center' }}>
        Games
      </Typography>
      <GamesCard games= {games}> </GamesCard>
    </div>
  )
}

export default Games