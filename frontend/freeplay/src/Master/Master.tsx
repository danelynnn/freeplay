import "./Master.scss";
import { useCallback, useEffect, useState } from "react";
import PlaylistItem from "components/PlaylistItem/PlaylistItem";
import { objToQueryString } from "utils";
import { useNavigate } from "react-router-dom";

function Master() {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const channelId = "UChZJRASiSGfBba91VvkdbEA";
    const query = {
      part: "contentDetails,snippet",
      channelId: channelId,
      maxResults: 50,
      key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
    };
    // fetch(
    //   `https://www.googleapis.com/youtube/v3/playlists?${objToQueryString({
    //     part: "contentDetails,snippet",
    //     channelId: channelId,
    //     maxResults: 50,
    //     key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
    //   })}`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const playlists = data.items;
    //     setPlaylists(
    //       playlists.map((p: { id: any; snippet: any }) => {
    //         return {
    //           id: p.id,
    //           thumbnail: p.snippet.thumbnails.default.url,
    //           name: p.snippet.title,
    //         };
    //       })
    //     );
    //   });
    fetch(
      `http://127.0.0.1:5001/playlists?${objToQueryString({
        channelId: channelId,
      })}`
    )
      .then((response) => response.json())
      .then((data) => {
        const playlists = data;
        setPlaylists(
          playlists.map((p: any) => {
            return {
              id: p,
              thumbnail: null,
              name: null,
            };
          })
        );
      });
  }, []);

  const handleSelect = useCallback((e: any) => {
    navigate(e);
  }, []);

  return (
    <div style={{ flex: 1 }} className="master">
      <h1>your youtube lists</h1>
      <div className="striped">
        {playlists.map((p: any) => (
          <PlaylistItem
            key={p.id}
            data={p}
            onClick={() => handleSelect(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Master;
