import "./App.scss";

import {
  useContext,
  useState,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AuthContext from "AuthContext";
import Avatar from "components/Avatar/Avatar";
import { getCookie, objToQueryString } from "utils";

function App() {
  const [url, setUrl] = useState("ZPqZyIKtW0Y");
  const navigate = useNavigate();
  const [authContext, setAuthContext] = useState("");

  const onUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  function loadFile() {
    fetch(
      `http://127.0.0.1:5000/load_song?${objToQueryString({ video_id: url })}`
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      });
  }

  useEffect(() => {
    const cookie = getCookie("auth");
    setAuthContext(cookie);
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={{ authContext, setAuthContext }}>
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

          <input
            style={{ margin: "10px" }}
            type="text"
            placeholder="put url here"
            onChange={onUrlChange}
          />
          <button style={{ margin: "10px" }} onClick={loadFile}>
            hi do the thing
          </button>
          {authContext ? (
            <Avatar auth={authContext} />
          ) : (
            <div className="header-button" onClick={() => navigate("/login")}>
              Login
            </div>
          )}
        </header>
        <div className="App-main">
          <Outlet />
        </div>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
