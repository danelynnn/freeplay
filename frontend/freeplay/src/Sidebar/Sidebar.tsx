import React from "react";
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

  goNext() {
    this.setState({
      nowPlaying: (this.state.nowPlaying + 1) % this.state.songList.length,
    });
  }

  async loadSong(url: string) {
    console.log(`fetched ${url}`);
    const request = await fetch(
      `http://127.0.0.1:5000/load_song?${objToQueryString({ video_id: url })}`
    )
      .then((response) => response.json())
      .catch((e) => {
        console.log(e);
      });

    return request.response.url;
  }

  loadPlaylist(playlistId: string): void {
    if (playlistId != this.state.currentPlaylist) {
      this.state.currentPlaylist = playlistId;

      fetchp(
        `https://www.googleapis.com/youtube/v3/playlistItems?${objToQueryString(
          {
            part: "contentDetails",
            playlistId: playlistId,
            maxResults: 50,
            key: "AIzaSyBpC7AWMX0Hm2HKvo4Gw7psmoGKPu72gxg",
          }
        )}`
      ).then((data) => {
        console.log(data);
        const songList = data.map((v) => v.contentDetails.videoId);
        this.shuffle(songList, "");

        this.state.nowPlaying = 0;
        this.setState({ songList: songList });
      });
    }
  }

  componentDidMount(): void {
    const { playlistId } = this.props.params;

    console.log("loading playlist from mount");
    this.loadPlaylist(playlistId);
  }

  componentDidUpdate(prevProps: any, prevState: any): void {
    if (this.props.params.playlistId !== prevProps.params.playlistId) {
      console.log("loading playlist from update");
      this.loadPlaylist(this.props.params.playlistId);
    } else if (
      this.state.songList !== prevState.songList ||
      this.state.nowPlaying !== prevState.nowPlaying
    ) {
      const newSong = this.state.songList[this.state.nowPlaying];
      console.log("changing song to", newSong);
      fetch(
        `https://www.googleapis.com/youtube/v3/videos?${objToQueryString({
          part: "snippet",
          id: newSong,
          key: "AIzaSyBpC7AWMX0Hm2HKvo4Gw7psmoGKPu72gxg",
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

            this.loadSong(newSong).then((url) => {
              songInfo.url = url;
              this.setState({ currentSongInfo: songInfo });
            });
          } else {
            this.goNext();
          }
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
    this.goNext();
  }

  render() {
    return (
      <div style={{ flex: 2 }} className="detail">
        <div style={{ flex: 3, padding: 10 }}>
          <div>
            <Player src={this.state.currentSongInfo?.url} ended={this.ended} />
            <p>{this.state.currentSongInfo.title}</p>
            <p>{this.state.currentSongInfo.author}</p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "scroll" }}>
          <div>
            {this.state.songList.map((s, i) => (
              <SongItem
                data={s}
                onClick={() => {
                  this.setState({ nowPlaying: i });
                }}
                selected={i === this.state.nowPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Sidebar);
