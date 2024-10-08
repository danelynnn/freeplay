import React, { useState } from "react";
import "./Body.scss";
import { objToQueryString } from "utils";
import PlaylistItem from "components/PlaylistItem/PlaylistItem";
import Player from "components/Player/Player";

class Body extends React.Component {
  state = { playlists: [] };

  componentDidMount(): void {
    const channelId = "UChZJRASiSGfBba91VvkdbEA";
    const query = {
      part: "contentDetails,snippet",
      channelId: channelId,
      maxResults: 50,
      key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
    };
    fetch(
      `https://www.googleapis.com/youtube/v3/playlists${objToQueryString(
        query
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        const playlists = data.items;
        this.setState({
          playlists: playlists.map((p: { id: any; snippet: any }) => {
            return {
              id: p.id,
              thumbnail: p.snippet.thumbnails.default.url,
              name: p.snippet.title,
            };
          }),
        });
      });
  }

  handleSelect(e: any) {
    console.log(e);
  }

  render() {
    return (
      <div className="App-main">
        <div style={{ flex: 1 }} className="master">
          <h1>your youtube lists</h1>
          <div className="striped"></div>
          {this.state.playlists.map((p: any) => (
            <PlaylistItem
              data={p}
              onClick={() => this.handleSelect(p.id)}
            ></PlaylistItem>
          ))}
        </div>
        <div style={{ flex: 2 }}>
          <Player></Player>
        </div>
      </div>
    );
  }
}

export default Body;
