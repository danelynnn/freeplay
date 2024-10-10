import React, { useState } from "react";
import "./Body.scss";
import { objToQueryString } from "utils";
import PlaylistItem from "components/PlaylistItem/PlaylistItem";
import Player from "components/Player/Player";
import { Outlet, useNavigate } from "react-router-dom";

// praise https://stackoverflow.com/a/70446743/6794873
function withNavigate(Component: any) {
  return (props: any) => <Component {...props} navigate={useNavigate()} />;
}

class Body extends React.Component {
  state = { playlists: [], nowPlaying: "" };
  props = { navigate: (dest: any) => {} };

  componentDidMount(): void {
    const channelId = "UChZJRASiSGfBba91VvkdbEA";
    const query = {
      part: "contentDetails,snippet",
      channelId: channelId,
      maxResults: 50,
      key: "AIzaSyAMCp_2vGgaVHlvM4f_544qwDOxIctjmKg",
    };
    fetch(
      `https://www.googleapis.com/youtube/v3/playlists?${objToQueryString(
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
    this.props.navigate(e);
  }

  ended() {}

  render() {
    return (
      <div className="App-main">
        <div style={{ flex: 1 }} className="master">
          <h1>your youtube lists</h1>
          <div className="striped"></div>
          {this.state.playlists.map((p: any) => (
            <PlaylistItem
              key={p.id}
              data={p}
              onClick={() => this.handleSelect(p.id)}
            ></PlaylistItem>
          ))}
        </div>
        <Outlet />
      </div>
    );
  }
}

export default withNavigate(Body);
