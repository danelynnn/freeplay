import logo from './logo.svg';
import './App.scss';
import { useState } from 'react';

function App() {
  const [url, setUrl] = useState('https://youtu.be/ZPqZyIKtW0Y')

  function onUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUrl(e.target.value)
  }

  function loadFile() {
    console.log(url)
    let params = new URLSearchParams()
    params.append('song_url', url)
    fetch('http://127.0.0.1:5000/load_song?' + params.toString())
      .then(response => response.json())
      .then(json => {
        console.log(json)
      })
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

        <input type='text' placeholder='put url here' onChange={onUrlChange}></input>
        <button onClick={loadFile}>hi do the thing</button>

        {url}
      </header>
    </div>
  );
}

export default App;
