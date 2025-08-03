import "./Body.scss";

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Master from "Master/Master";
import PlaythroughContext from "PlaythroughContext";

function Body() {
  const [ptContext, setPtContext] = useState<string | null>(null);

  return (
    <div className="App-body">
      <PlaythroughContext.Provider value={{ ptContext, setPtContext }}>
        <Master />
        <Outlet />
      </PlaythroughContext.Provider>
    </div>
  );
}

export default Body;
