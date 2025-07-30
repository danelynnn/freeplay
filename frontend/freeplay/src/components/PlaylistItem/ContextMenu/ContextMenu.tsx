import "./ContextMenu.scss";

import { ReactComponent as Shovel } from "img/shovel.svg";

function ContextMenu(props: { data: any; onClick: any }) {
  return (
    <div className="contextMenu">
      {/* want this to be like, quick shuffle types */}
      <div className="header">
        <Shovel width={30} color="white" />
      </div>
      {/* and want this to be different options */}
      <div className="menu">
        <div className="menuItem">
          <span style={{ marginRight: 5 }}>
            <Shovel width={20} color="white" />
          </span>
          <span>Return to...</span>
        </div>
        <div className="menuItem">
          <span style={{ marginRight: 5 }}>
            <Shovel width={20} color="white" />
          </span>
          <span>See stats</span>
        </div>
      </div>
    </div>
  );
}

export default ContextMenu;
