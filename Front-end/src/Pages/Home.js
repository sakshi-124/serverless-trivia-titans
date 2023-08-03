import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";
import { Row, Col } from "antd";
import "../Styles/card.css";
import TeamCard from "./TeamCard";
import Card from "../Components/Card";
import ChatbotWidget from "../Components/ChatBot/ChatBot";
import "../Styles/Home.css";
import "../Styles/card.css";
import { apigatewayURL } from "../Constants";
import Loader from "../Components/Loader";

function Home() {
  const navigate = useNavigate()
  const [game_list,setGameList]=useState([])

  const [loading,isLoading]=useState(true)
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const cols = [];

  useEffect(() => {
    try{
      fetch(apigatewayURL+"/getgames",{
        method:"POST",
        body:JSON.stringify({
          reqPath:"/getgames"
        }),
        headers:{
          "content-type":"application/json"
        }
      }).then(res=>res.json())
      .then((data)=>{
        isLoading(false);
        const body=data["body-json"]
        const games=body.gamesResponse.body.games;
        setGameList(games)
      })
    }
    catch(error)
    {
      console.log(error);
    }

    const queryParameters = new URLSearchParams(
      window.location.hash.substring(1)
    );
    const idTokenParam = queryParameters.get("id_token");
    const accessTokenParam = queryParameters.get("access_token");
    const verified = localStorage.getItem("verified");
    if (idTokenParam && accessTokenParam) {
      localStorage.setItem("token", accessTokenParam);
      localStorage.setItem("idToken", idTokenParam);
    }
    const token = localStorage.getItem("token");
    const idToken = localStorage.getItem("idToken");
    if (token && idToken && verified !== "true") {
      navigate("/verify");
    }
  }, []);

  game_list.forEach((game) => {
    cols.push(
      <Col span={4} key={game.idToken} >
        <Card data={game} setIsModelOpen={setIsModelOpen} setActiveGame={setActiveGame} />
      </Col>
    );
  });

  const rows = [];
  console.log("columns:", cols.length);
  for (let i = 0; i < cols.length; i += 4) {
    rows.push(
      <Row gutter={[24, 24]} className="row">
        {cols.slice(i, i + 5)}
      </Row>
    );
    console.log(rows.length);
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(
      window.location.hash.substring(1)
    );
    const idTokenParam = queryParameters.get("id_token");
    const accessTokenParam = queryParameters.get("access_token");
    const verified = localStorage.getItem("verified");
    if (idTokenParam && accessTokenParam) {
      localStorage.setItem("token", accessTokenParam);
      localStorage.setItem("idToken", idTokenParam);
    }
    const token = localStorage.getItem("token");
    const idToken = localStorage.getItem("idToken");
    if (token && idToken && verified !== "true") {
      navigate("/verify");
    }
  }, [game_list]);
  return (
    <>
      <div className="games">{rows}</div>
      <ChatbotWidget />
      {isModelOpen ? <TeamCard setIsModelOpen={setIsModelOpen} activeGame={activeGame} /> : null}
      <Loader isLoading={loading}/>
    </>
  );
}

export default Home;
