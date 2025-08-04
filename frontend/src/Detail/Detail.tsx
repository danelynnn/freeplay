import "./Detail.scss";

import { use, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Player from "components/Player/Player";
import ContextMenu from "components/PlaylistItem/ContextMenu/ContextMenu";
import SongItem from "components/SongItem/SongItem";
import { fetchp, objToQueryString, shuffle } from "utils";
import PlaythroughContext from "PlaythroughContext";
import AuthContext from "AuthContext";

async function loadSong(url: string) {
  const request = await fetch(
    `http://127.0.0.1:5000/load_song?${objToQueryString({ video_id: url })}`
  )
    .then((response) => response.json())
    .catch((e) => {
      console.log(e);
    });

  return request.response;
}

function Detail() {
  const { authContext, setAuthContext } = useContext(AuthContext);
  const { ptContext, setPtContext } = useContext(PlaythroughContext);

  const { playlistId } = useParams<{ playlistId: any }>();
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [seed, setSeed] = useState(-1);
  const [songList, setSongList] = useState({ songs: [""], nowPlaying: -1 });
  const [currentSongInfo, setCurrentSongInfo] = useState({
    url: "",
    title: "",
    author: "",
  });
  const [ptData, setPtData] = useState<any>(null);

  // on playlistId change
  useEffect(() => {
    if (playlistId) {
      console.log(`playlistId changed: ${playlistId}`);
      setSongList({ songs: [""], nowPlaying: -1 });
      fetchp(
        `https://www.googleapis.com/youtube/v3/playlistItems?${objToQueryString(
          {
            part: "contentDetails",
            playlistId: playlistId,
            maxResults: 50,
            key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
          }
        )}`
      ).then((data) => {
        const songs = data.map((v) => v.contentDetails.videoId);
        console.log("playlist loaded");
        setPlaylist(songs);
      });

      // fetch(
      //   `http://127.0.0.1:5001/playlistItems?${objToQueryString({
      //     playlistId: playlistId,
      //   })}`
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     const songs = data.videos;
      //     shuffle(songs, "");

      //     setSongList({ songs: songs, nowPlaying: 0 });
      //   });
    }
  }, [playlistId]);

  // when playlist is loaded, load pt data for that playlist
  useEffect(() => {
    if (playlist.length) {
      console.log(`loading pt data for ${ptContext}`);
      if (ptContext) {
        fetch(
          `http://127.0.0.1:5000/playthroughs/${ptContext}?${objToQueryString({
            jwt_auth: authContext,
          })}`
        )
          .then((response) => response.json())
          .then((data) => {
            setPtData(data.response);

            console.log("playthrough found, running", data.response);
          });
      } else {
        setPtData({});
      }
    }
  }, [playlist]);

  // when ptData is loaded for this playlist, load my songs
  useEffect(() => {
    if (ptData) {
      console.log("loading song list");

      const songs = playlist;
      if (Object.keys(ptData).length) {
        shuffle(songs, "", ptData.seed);
        setSongList({ songs: songs, nowPlaying: ptData.progress });
      } else {
        const seed = Date.now();
        console.log(`random shuffle, using seed ${seed}`);
        shuffle(songs, "", seed);
        setSeed(seed);
        setSongList({ songs: songs, nowPlaying: 0 });
      }
    }
  }, [ptData]);

  // on song change
  useEffect(() => {
    const newSong = songList.songs[songList.nowPlaying];

    if (newSong) {
      console.log("song changed:", newSong);
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?${objToQueryString({
          part: "snippet",
          id: newSong,
          key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
        })}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.items.length) {
            const songInfo = {
              title: data.items[0].snippet.title,
              author: data.items[0].snippet.channelTitle,
              url: "",
            };

            loadSong(newSong).then((url) => {
              songInfo.url = url;
              setCurrentSongInfo(songInfo);
            });
          }
        });

      // fetch(
      //   `http://127.0.0.1:5001/videos?${objToQueryString({
      //     id: newSong,
      //   })}`
      // )
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (data) {
      //       const songInfo = {
      //         title: data.title,
      //         author: data.channelTitle,
      //         url: "",
      //       };

      //       loadSong(newSong).then((url) => {
      //         songInfo.url = url;
      //         setCurrentSongInfo(songInfo);
      //       });
      //     }
      //   });

      // upload playlist progress
      if (ptContext) {
        const newPtData = { ...ptData, progress: songList.nowPlaying };
        console.log("sending", newPtData);
        fetch(
          `http://127.0.0.1:5000/playthroughs/${ptContext}?${objToQueryString({
            jwt_auth: authContext,
          })}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPtData),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            // console.log(data);
          });
      }
    }
  }, [songList]);

  function savePlaythrough() {
    let ptData = {
      playlistId: playlistId,
      seed: seed,
      progress: songList.nowPlaying,
    };
    fetch(
      `http://127.0.0.1:5000/playthroughs?${objToQueryString({
        jwt_auth: authContext,
      })}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ptData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setPtContext(data.response);
      });
  }

  return (
    <div style={{ flex: 2 }} className="detail">
      <div style={{ flex: 3, padding: 10 }}>
        {currentSongInfo?.url && (
          <div>
            <Player
              src={currentSongInfo?.url}
              ended={() => {
                setSongList({
                  ...songList,
                  nowPlaying: (songList.nowPlaying + 1) % songList.songs.length,
                });
              }}
            />
            <p>{currentSongInfo.title}</p>
            <p>{currentSongInfo.author}</p>
          </div>
        )}

        {!ptContext && (
          <button onClick={savePlaythrough}>Keep this playthrough</button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "scroll" }} className="playlistQueue">
        {songList.songs.map((s, i) => (
          <SongItem
            key={s}
            data={s}
            onClick={() => {
              setSongList({
                ...songList,
                nowPlaying: i,
              });
            }}
            selected={i === songList.nowPlaying}
          />
        ))}
      </div>
    </div>
  );
}

export default Detail;
