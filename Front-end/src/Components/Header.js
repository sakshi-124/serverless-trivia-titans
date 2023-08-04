import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "../App.css";
import { useEffect, useState } from "react";
import { logout } from "../Services/UserPool";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { updateLastActivity } from "../Services/UserService";

function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="header-bg">
      <p className="header-logo" onClick={() => navigate("/home")}>
        TRIVIA TITANS
      </p>
      <div className="header-menu">
        {isLoggedIn ? (
          <>
            {localStorage.getItem("isAdmin") === "true" ? (
              <>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </p>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/manageGames/false")}
                >
                  Manage Games
                </p>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/modifyQues")}
                >
                  Manage Questions
                </p>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/questions")}
                >
                  Questions
                </p>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/games")}
                >
                  Games
                </p>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/leaderboard")}
                >
                  Leaderboard
                </p>
              </>
            ) : (
              <>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/games")}
                >
                  GAMES
                </p>
                <p
                  className="header-menu-item"
                  onClick={() => navigate("/leaderboard")}
                >
                  Leaderboard
                </p>
              </>
            )}
          </>
        ) : null}
      </div>
      <div className="header-menu-right">
        {isLoggedIn ? (
          <>
            <div
              className="header-menu-item"
              onClick={() => navigate("/statistics")}
            >
              Performance
            </div>
            <NotificationsNoneIcon
              className="header-menu-icon"
              onClick={() => navigate("/notifications")}
            />
            <div>
              {JSON.parse(localStorage.getItem("user")) ? (
                <>
                  <span>
                    {" "}
                    Hey {JSON.parse(localStorage.getItem("user")).name}{" "}
                  </span>
                  <UserOutlined
                    className="header-menu-icon"
                    onClick={() => navigate("/profile")}
                  />
                </>
              ) : null}
            </div>

            <p
              className="header-menu-item"
              onClick={async () => {
                updateLastActivity(
                  JSON.parse(localStorage.getItem("user")).email
                );
                localStorage.clear();
                setIsLoggedIn(false);
                navigate("/");
                logout();
              }}
            >
              Logout
            </p>
          </>
        ) : (
          // <a className='header-logo' href='https://triviatitans.auth.us-east-1.amazoncognito.com/login?response_type=code&client_id=6hn9vmanqlt905sa1n0skc8ql6&redirect_uri=http%3A%2F%2Flocalhost%3A3000' onClick={() => navigate('/logout')}>Login</a>
          // <a className='header-logo' href='https://triviatitans.auth.us-east-1.amazoncognito.com/login?client_id=6hn9vmanqlt905sa1n0skc8ql6&response_type=token&scope=email+profile+aws.cognito.signin.user.admin+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000' onClick={() => navigate('/logout')}>Login</a>
          <>
            <a
              className="header-logo"
              href="https://triviatitans.auth.us-east-1.amazoncognito.com/login?client_id=6hn9vmanqlt905sa1n0skc8ql6&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https%3A%2F%2Ffrontend-o5zhrppqlq-uc.a.run.app"
              onClick={() => navigate("/logout")}
            >
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
