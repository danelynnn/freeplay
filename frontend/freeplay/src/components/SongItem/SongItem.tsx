import React from "react";
import "./SongItem.scss";

function SongItem(props: {
  data: any;
  selected: boolean;
  onClick: React.MouseEventHandler;
}) {
  return (
    <div
      onClick={props.onClick}
      className={"songItem " + (props.selected ? "selected" : "")}
    >
      <img src={props.data}></img>
      {props.data}
    </div>
  );
}

export default SongItem;
