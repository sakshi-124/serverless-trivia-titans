import { useNavigate } from "react-router-dom";
import { functionURL } from "../Constants";
import { useEffect, useState } from "react";

function Card({ data, setIsModelOpen, setActiveGame }) {
  console.log(data);
  const [notplayed, setNotPlayed] = useState(false);
  const [team, setTeam] = useState("");
  const [game, setGame] = useState(data);
  const navigate = useNavigate();


  useEffect(()=>{
    if (notplayed) {
      fetch(functionURL + "getTeam", {
        method: "POST",
        body: JSON.stringify({
          team_name: team,
          game: game.id,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          //navigate to playGames and send team and game data through state
          navigate("/playGames", {
            state: JSON.stringify({
              team: data,
              activeGame: game,
            }),
          });
        });
    }
  },[notplayed])

  return (
    <div
      className="card"
      onClick={() => {
        setActiveGame(data);
        const email = JSON.parse(localStorage.getItem("user")).email
        console.log(email);
        //check if user is in a team before opening the model
        fetch(functionURL + "checkUserGameStatus", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ email:email, game: data.id }),
        })
          .then((res) => {
            console.log("inside response");
            return res.json();
          })
          .then((data) => {
            console.log(data);
            if (!data.played) {
              console.log(data);
              //game is not played and is in a team
              if (data.team) {
                console.log(data.team);
                //start game without creating a team
                //fetch and send team data to GameApp
                setTeam(data.team);
                setNotPlayed(true);
              } else {
                console.log("game not played and not in team");
                setIsModelOpen(true);
                console.log("set active game if: ",game)
              }
            } else {
              //game already played
              console.log("set active game else: ",game)
              setIsModelOpen(true);
            }
          });
      }}
    >
      <div className="card-content">
        <div className="card-top">
          <span className="card-title">01.</span>
          <p>{data.category.category}</p>
        </div>
        <div className="card-bottom">
          <p>{data.level.level}</p>
          <p>{data.frame.time_frame}</p>
        </div>
      </div>
      <div className="card-image">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 -960 960 960"
          width="48"
        >
          <path d="M189-160q-60 0-102.5-43T42-307q0-9 1-18t3-18l84-336q14-54 57-87.5t98-33.5h390q55 0 98 33.5t57 87.5l84 336q2 9 3.5 18.5T919-306q0 61-43.5 103.5T771-160q-42 0-78-22t-54-60l-28-58q-5-10-15-15t-21-5H385q-11 0-21 5t-15 15l-28 58q-18 38-54 60t-78 22Zm2.663-60q24.337 0 45.004-12.973Q257.333-245.946 268-268l28-57q13-26 36.5-40.5T385-380h190q29 0 52.5 15t37.5 40l28 57q10.667 22.054 31.333 35.027Q745-220 769.255-220 805-220 831-244.5t27-60.5q0-4-3-24l-84-335q-8-33-34.4-54.5T675-740H285q-34.704 0-61.352 21Q197-698 189-664l-84 335q-1 4-3 23 0 36.485 26.258 61.242Q154.517-220 191.663-220Zm348.512-310q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm80-80q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm0 160q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm80-80q12.825 0 21.325-8.675 8.5-8.676 8.5-21.5 0-12.825-8.675-21.325-8.676-8.5-21.5-8.5-12.825 0-21.325 8.675-8.5 8.676-8.5 21.5 0 12.825 8.675 21.325 8.676 8.5 21.5 8.5Zm-360.059 65Q351-465 358-472.083q7-7.084 7-17.917v-45h45q10.833 0 17.917-7.116 7.083-7.117 7.083-18Q435-571 427.917-578q-7.084-7-17.917-7h-45v-45q0-10.833-7.116-17.917-7.117-7.083-18-7.083Q329-655 322-647.917q-7 7.084-7 17.917v45h-45q-10.833 0-17.917 7.116-7.083 7.117-7.083 18Q245-549 252.083-542q7.084 7 17.917 7h45v45q0 10.833 7.116 17.917 7.117 7.083 18 7.083ZM480-480Z" />
        </svg>
      </div>
    </div>
  );
}

export default Card;
