import { useEffect, useState } from "react";
import "../Styles/TeamCard.css";
import Loader from "../Components/Loader";
import { Input, Typography } from "antd";
import { functionURL, sendInviteUrl } from "../Constants";
import { useNavigate } from "react-router-dom";

function TeamCard({ setIsModelOpen, activeGame }) {
  const navigate=useNavigate();
  const [team,setTeam]=useState({});
  const [inTeam, setInTeam] = useState(false);
  const email = JSON.parse(localStorage.getItem("user")).email;
  const [step, setStep] = useState(0);
  const [players, setPlayers] = useState([]);
  const [loading,setLoading]=useState(false);
  const [player, setPlayer] = useState("");
  const [teamName,setTeamName]=useState("");

  useEffect(() => {
    console.log("ActiveGame: " + JSON.stringify(activeGame));
  }, []);

  const sendInvite = () => {
    const currentPlayers = players;
    currentPlayers.push(player);
    setPlayer('');
    fetch(sendInviteUrl,{
      method:"POST",
      body:JSON.stringify({
        topic_name:teamName,
        email:player
      }),
      headers:{
        "Content-Type":"application/json"
      },
      mode:"no-cors"
    }).catch((error) => {
      console.error("Error sending invite:", error);
    });
    setPlayers(currentPlayers);
  };

  const startGame=()=>{
    //fetch latest team data
    fetch(functionURL+"getTeam",{
      method:"POST",
      body:JSON.stringify({
        team_name:teamName,
        game:activeGame.id
      }),
      headers:{
        "content-type":"application/json"
      }
    })
    .then((res)=>res.json())
    .then((data)=>{
      setTeam(data);
      console.log(team);
      //navigate to playGames and send team and game data through state
      navigate("/playGames", {state: JSON.stringify({
        team:data,
        activeGame
      })})
    })
  }

  const renderPlayers = () => {
    if (players.length === 0)
      return (
        <p style={{ marginLeft: "10px", marginBottom: "10px" }}>No Players Yet.</p>
      );
    return players.map((player) => {
      return (
        <p style={{ marginLeft: "10px", marginBottom: "10px" }}>{player}</p>
      );
    });
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "0px",
          width: "100%",
          zIndex: "9999",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          className="team-card-bg"
          onClick={() => setIsModelOpen(false)}
        ></div>
        <div
          className="team-card-body"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {step === 0 ? (
            <div className="create-team-body">
              <p className="create-team-title">Create Your Team !!!</p>
              <div onClick={() =>{
                  //make api call to create a team name
                  console.log(activeGame);
                  setLoading(true)
                  fetch(functionURL+"createTeam",{
                    method:"POST",
                    headers:{
                      "content-type":"application/json"
                    },
                    body: JSON.stringify({
                      email:email,
                      game:activeGame.id
                    })
                  }).then((res)=>res.json())
                  .then((data)=>{
                    //
                    console.log(data);
                    setTeamName(data.team);
                    //setStep(1);
                  })
              }} className="create-team-btn">
                Generate Team Name
              </div>
              <Typography variant="h1" component="h2">{teamName}</Typography>
              <div className="create-team-btn" onClick={
                ()=>{
                  console.log(activeGame)
                  fetch(functionURL+"createTeamTopic",{
                    method:"POST",
                    headers:{
                      "content-type":"application/json"
                    },
                    body: JSON.stringify({
                      email:email,
                      game:activeGame.id,
                      team:teamName
                    })
                  }).then((res)=>res.json())
                  .then((data)=>{
                    //
                    setStep(1);
                  })
                }
              }>Next</div>
            </div>
          ) : step === 1 ? (
            <div className="create-team-body">
              <p className="create-team-title">Invite Players to {teamName} !!!</p>
              <div style={{ display: "flex", justifyContent: "space-between", width: '100%' }}>
                <div style={{ width: "40%", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Input
                    value={player}
                    onChange={(e) => setPlayer(e.target.value)}
                  />
                  <div className="send-invite-btn" onClick={sendInvite}>
                    Send Invite
                  </div>
                  <div className="send-invite-btn" onClick={startGame}>Start Game</div>
                </div>
                <div style={{ width: "40%" }}>{renderPlayers()}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {<Loader isLoading={loading}/>}
    </>
  );
}

export default TeamCard;
