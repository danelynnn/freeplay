import "./Avatar.scss";

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import { objToQueryString } from "utils";

function Avatar(props: { auth: string }) {
  const [userData, setUserData] = useState({
    user: "",
    email: "",
    pfp: "",
    connections: { yt_url: "" },
  });
  const [showPane, setShowPane] = useState(false);

  useEffect(() => {
    if (props.auth)
      fetch(
        `http://localhost:5000/user?${objToQueryString({
          jwt_auth: props.auth,
        })}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("user data pulled", data.response);
          setUserData(data.response);
        });
  }, [props.auth]);

  function profileClick() {
    setShowPane(!showPane);
  }

  return (
    <div>
      <div className="appBarItem" onClick={profileClick}>
        <div
          className="avatar"
          style={{ backgroundImage: `url(${userData.pfp})` }}
        />
      </div>
      <div className="panel" hidden={!showPane}>
        <h2>{userData.user}</h2>
        <p>{userData.email}</p>
        <p>
          <Link to="/profile">Profile</Link>
        </p>
      </div>
    </div>
  );

  return <p>hi</p>;
}

export default Avatar;
