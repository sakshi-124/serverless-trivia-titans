import { useEffect } from "react";
import Header from "../Components/Header";
import "../Styles/Home.css";
import { createSession } from "../Services/UserPool";
import add_button from "../Assets/add-button.png";
import { Row, Col } from "antd";
import Card from "../Components/Card";
import { PlusOutlined } from "@ant-design/icons";
import "../Styles/card.css";
import ChatbotWidget from "../Components/ChatBot/ChatBot";

function Home() {
  const game_list = [
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
    {
      game_name: "Name",
      players: "20",
      difficulty: "Medium",
      time: "20 min",
    },
  ];

  const cols = [];

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
      window.location.href = "http://localhost:3000/verify";
    }
  }, []);

  game_list.forEach((game) => {
    cols.push(
      <Col span={4} key={game.idToken}>
        <Card data={game} />
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
      window.location.href = "http://localhost:3000/verify";
    }
  }, [game_list]);

  return (
    <>
      <Header />
      Home
      <div className="games">{rows}</div>
      <ChatbotWidget />
    </>
  );
}

export default Home;
