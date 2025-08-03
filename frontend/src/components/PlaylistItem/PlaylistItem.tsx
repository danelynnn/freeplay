import "./PlaylistItem.scss";

import React from "react";

function PlaylistItem(props: { data: any; onClick: React.MouseEventHandler }) {
  return (
    <div className="playlistItem" onClick={props.onClick}>
      <img src={props.data.thumbnail} alt="meaningless text" />
      <div style={{ padding: 20 }}>
        <p>{props.data.name}</p>
      </div>
    </div>
  );
}

export default PlaylistItem;
