import React, { useState } from "react";
import Player from "components/Player/Player";
import { useParams } from "react-router-dom";
import { fetchp, objToQueryString } from "utils";
import "./Sidebar.scss";
import SongItem from "components/SongItem/SongItem";

// praise https://stackoverflow.com/a/70446743/6794873
function withParams(Component: any) {
  return (props: any) => <Component {...props} params={useParams()} />;
}

class Sidebar extends React.Component {
  state = {
    currentPlaylist: "",
    songList: [""],
    nowPlaying: -1,
    currentSongInfo: { url: "", title: "", author: "" },
  };
  props = { params: { playlistId: "" } };

  constructor(params: any) {
    super(params);
    this.ended = this.ended.bind(this);
  }

  loadSong(url: string) {
    const params = { video_id: url };
    console.log(`fetched ${url}`);
    fetch(`http://127.0.0.1:5000/load_song?${objToQueryString(params)}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(`found ${json.response.url}`);
        this.setState({
          currentSongInfo: {
            ...this.state.currentSongInfo,
            url: json.response.url,
          },
        });
        return json;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  loadPlaylist(playlistId: string): void {
    console.log(`loaded ${playlistId}`);

    fetchp(
      `https://www.googleapis.com/youtube/v3/playlistItems?${objToQueryString({
        part: "contentDetails",
        playlistId: playlistId,
        maxResults: 50,
        key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
      })}`
    ).then((data) => {
      console.log(data);
      const songList = data.map((v) => v.contentDetails.videoId);
      this.shuffle(songList, "");
      this.setState({ songList: songList });
      this.state.nowPlaying = 0;
    });
  }

  componentDidMount(): void {
    const { playlistId } = this.props.params;

    this.loadPlaylist(playlistId);
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    if (this.props.params.playlistId != prevProps.params.playlistId) {
      this.loadPlaylist(this.props.params.playlistId);
    } else if (
      this.state.songList != prevState.songList ||
      this.state.nowPlaying != prevState.nowPlaying
    ) {
      this.loadSong(this.state.songList[this.state.nowPlaying]);

      fetch(
        `https://www.googleapis.com/youtube/v3/videos?${objToQueryString({
          part: "snippet",
          id: this.state.songList[this.state.nowPlaying],
          key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
        })}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            currentSongInfo: {
              ...this.state.currentSongInfo,
              title: data.items[0].snippet.title,
              author: data.items[0].snippet.channelTitle,
            },
          });
        });
    }
  }

  shuffle(list: any[], mode: string) {
    switch (mode) {
      default: // THE KNUTH SHUFFL: https://stackoverflow.com/a/2450976/6794873
        let i = list.length;
        while (i > 0) {
          let randomIndex = Math.floor(Math.random() * i);
          i--;

          [list[i], list[randomIndex]] = [list[randomIndex], list[i]];
        }
    }
  }

  ended() {
    this.setState({ nowPlaying: this.state.nowPlaying + 1 });
  }

  render() {
    return (
      <div style={{ flex: 2 }} className="detail">
        <div style={{ flex: 3 }}>
          {this.state.currentSongInfo?.url && (
            <div>
              <Player
                src={this.state.currentSongInfo?.url}
                ended={this.ended}
              ></Player>
              <p>{this.state.currentSongInfo.title}</p>
              <p>{this.state.currentSongInfo.author}</p>
            </div>
          )}
        </div>
        <div style={{ flex: 1, overflowY: "scroll" }}>
          <div>
            {this.state.songList.map((s, i) => (
              <SongItem
                data={s}
                onClick={() => {
                  this.setState({ nowPlaying: i });
                }}
                selected={i == this.state.nowPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Sidebar);
