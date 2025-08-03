import "./Master.scss";

import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PlaylistItem from "components/PlaylistItem/PlaylistItem";
import AuthContext from "AuthContext";
import { objToQueryString } from "utils";
import PlaythroughContext from "PlaythroughContext";

function Master() {
  const { authContext, setAuthContext } = useContext(AuthContext);
  const { ptContext, setPtContext } = useContext(PlaythroughContext);
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [userData, setUserData] = useState({
    user: null,
    connections: { yt_url: null },
  });

  useEffect(() => {
    if (authContext)
      fetch(
        `http://localhost:5000/user?${objToQueryString({
          jwt_auth: authContext,
        })}`
      )
        .then((response) => response.json())
        .then((data) => {
          setUserData(data.response);
        });
  }, [authContext]);

  useEffect(() => {
    if (userData.connections?.yt_url) {
      console.log(`loading playlists for ${userData.connections?.yt_url}`);

      fetch(
        `https://www.googleapis.com/youtube/v3/playlists?${objToQueryString({
          part: "contentDetails,snippet",
          channelId: userData.connections?.yt_url,
          maxResults: 50,
          key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
        })}`
      )
        .then((response) => response.json())
        .then((data) => {
          const playlists = data.items;
          setPlaylists(
            playlists.map((p: { id: any; snippet: any }) => {
              return {
                id: p.id,
                thumbnail: p.snippet.thumbnails.default.url,
                name: p.snippet.title,
              };
            })
          );
        });
    }
    // fetch(
    //   `http://127.0.0.1:5001/playlists?${objToQueryString({
    //     channelId: channelId,
    //   })}`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const playlists = data;
    //     setPlaylists(
    //       playlists.map((p: any) => {
    //         return {
    //           id: p,
    //           thumbnail: null,
    //           name: null,
    //         };
    //       })
    //     );
    //   });
  }, [userData.connections?.yt_url]);

  function handleSelect(playlistId: string) {
    fetch(
      `http://127.0.0.1:5000/playthroughs?${objToQueryString({
        jwt_auth: authContext,
        playlistId: playlistId,
      })}`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.response.length) {
          console.log("routing to playlist with pt", json.response[0]);
          setPtContext(json.response[0]._id);
          navigate(playlistId);
        } else {
          console.log("routing to playlist");
          setPtContext(null);
          navigate(playlistId);
        }
      });
  }

  return (
    <div style={{ flex: 1 }} className="master">
      <h1>welcome, {userData.user}!</h1>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <div>
          <h2>your youtube lists</h2>
          <div style={{ paddingTop: 20 }} className="striped">
            {playlists.map((p: any) => (
              <PlaylistItem
                key={p.id}
                data={p}
                onClick={() => handleSelect(p.id)}
              />
            ))}
          </div>
        </div>
        <div>
          <h2>your personal lists</h2>
          <div style={{ paddingTop: 20 }} className="striped">
            {playlists.map((p: any) => (
              <PlaylistItem
                key={p.id}
                data={p}
                onClick={() => handleSelect(p.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Master;
