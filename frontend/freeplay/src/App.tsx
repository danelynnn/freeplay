import "./App.scss";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { objToQueryString } from "utils";
import Master from "Master/Master";

function App() {
  const [url, setUrl] = useState("ZPqZyIKtW0Y");

  function onUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value);
  }

  function loadFile() {
    const params = { video_id: url };
    fetch(`http://127.0.0.1:5000/load_song?${objToQueryString(params)}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      });
  }

  return (
    <div className="App">
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

        <input type="text" placeholder="put url here" onChange={onUrlChange} />
        <button onClick={loadFile}>hi do the thing</button>

        {url}
      </header>
      <div className="App-main">
        <Master />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
