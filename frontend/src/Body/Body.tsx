import "./Body.scss";

import Master from "Master/Master";
import { Outlet } from "react-router-dom";

function Body() {
  return (
    <div className="App-body">
      <Master />
      <Outlet />
    </div>
  );
}

export default Body;
