import React from 'react'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import Swal from 'sweetalert2';
import { green, orange, purple } from '@mui/material/colors';
import axios from 'axios';
import { apigatewayURL } from '../Constants';
import { useNavigate } from "react-router-dom";

function GamesCard(props) {

  let navigate = useNavigate();

  const isAdmin = localStorage.getItem("isAdmin");
  console.log(isAdmin)
  //props.isAdmin;

  let path = "/manageGames/true"
  let pathPlayGames = "/playGames"

  const handleButtonClick = (gameId, action) => {
    const reqPath = action; // Replace with the actual endpoint path for updating game status

    const data = {
      reqPath: reqPath,
      data: { gameId: gameId }
    };

    axios.post(apigatewayURL + reqPath, data)
      .then((res) => {
        // Handle the response if needed
        console.log(res.data);
        Swal.fire('Success', `Game ${action}d successfully`, 'success');
      })
      .catch((error) => {
        // Handle errors if needed
        console.error('Error:', error);
        Swal.fire('Error', 'Failed to update game status', 'error');
      });
  };

  const getCardBorderColor = (gameStatus) => {
    return gameStatus === 1 ? 'green' : 'red';
  };

  const handleCardClick = (games) => {

    if (isAdmin === "true")
    {
      navigate(path, { replace: true, state: games })
    }
    else
    {
      navigate(pathPlayGames , {replace : true, state : games})
    }
  };

  return (
    <div>
      <Container>
        <Grid
          container
          spacing={3}
          justify="center"
          style={{ marginTop: "1%" }}
        >
          {props.games.map((games, index) => {
            const cardBorderStyle = { borderColor: getCardBorderColor(games.gameStatus) };
            return (
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345, margin: 5, backgroundColor: index % 2 === 0 ? orange[500] : purple[500] ,border: games.gameStatus === 1 ? '3px solid green': '3px solid red'}}
                  onClick={() => handleCardClick(games)}
                >
                  {/* <CardMedia component="img"
                        image={`data:image/png;base64,${imgData}`}
                        sx={{ height: 300 }} //temp
                        title={games.product_name}
                      /> */}
                  <CardContent align='left'>
                    <Typography name="category">
                      {games.category["category"]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" name="level" >
                      Difficulty : {games.level["level"]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" name="price">
                      Time : {games.frame["time_frame"]}
                    </Typography>
                  </CardContent>
                       {/* ... (Your existing card content) */}
                       <CardActions>
                    {/* Conditionally enable buttons and handle redirection */}
                    {isAdmin === "true"? (
                      <>
                        <Button
                          sx={{ color: 'black' }}
                          size="small"
                          onClick={() => handleButtonClick(games.id, '/activate')}
                        >
                          Activate
                        </Button>
                        <Button
                          sx={{ color: 'white' }}
                          size="small"
                          onClick={() => handleButtonClick(games.id, '/deactivate')}
                        >
                          Deactivate
                        </Button>
                      </>
                    ) : (
                      <Button
                        sx={{ color: 'white' }}
                        size="small"
                        onClick={() => handleCardClick(games)}
                      >
                        Play Game
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default GamesCard