import React from "react";
import "./PlaylistItem.scss";

function PlaylistItem(props: { data: any; onClick: React.MouseEventHandler }) {
  return (
    <div className="playlistItem" onClick={props.onClick}>
      <img src={props.data.thumbnail}></img>
      <p>{props.data.name}</p>
    </div>
  );
}

export default PlaylistItem;
