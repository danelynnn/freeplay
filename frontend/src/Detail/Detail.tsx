import "./Detail.scss";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Player from "components/Player/Player";
import ContextMenu from "components/PlaylistItem/ContextMenu/ContextMenu";
import SongItem from "components/SongItem/SongItem";
import { fetchp, objToQueryString, shuffle } from "utils";

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
  const { playlistId } = useParams<{ playlistId: any }>();
  const [songList, setSongList] = useState({ songs: [""], nowPlaying: -1 });
  const [currentSongInfo, setCurrentSongInfo] = useState({
    url: "",
    title: "",
    author: "",
  });

  const loadPlaylist = useCallback((playlistId: string) => {
    console.log(`playlistId changed: ${playlistId}`);

    if (playlistId) {
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
        console.log(data);
        const songs = data.map((v) => v.contentDetails.videoId);
        shuffle(songs, "");

        setSongList({ songs: songs, nowPlaying: 0 });
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
  }, []);

  // on playlistId change
  useEffect(() => {
    loadPlaylist(playlistId);
  }, [playlistId]);

  // on song change
  useEffect(() => {
    const newSong = songList.songs[songList.nowPlaying];
    console.log("songs changed:", songList);

    if (newSong) {
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
    }
  }, [songList]);

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
        <ContextMenu data={null} onClick={null} />
      </div>
      <div style={{ flex: 1, overflowY: "scroll" }}>
        <div>
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
    </div>
  );
}

export default Detail;
