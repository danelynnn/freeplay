import "./Profile.scss";

import { useContext, useEffect, useState } from "react";

import AuthContext from "AuthContext";
import { objToQueryString } from "utils";

function Profile() {
  const { authContext, setAuthContext } = useContext(AuthContext);

  const [userData, setUserData] = useState({ channelId: "" });

  useEffect(() => {
    if (authContext) {
      fetch(
        `http://localhost:5000/user?${objToQueryString({
          jwt_auth: authContext,
        })}`
      )
        .then((response) => response.json())
        .then((data) => {
          setUserData({ channelId: data.response.channelId });
        });
    }
  }, [authContext]);

  function setInputUserData(e: React.ChangeEvent<HTMLInputElement>) {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  function updateProfile() {
    fetch(
      `http://localhost:5000/user?${objToQueryString({
        jwt_auth: authContext,
      })}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connections: { yt_url: userData.channelId } }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <div className="profile">
      <div>
        {/* <p>logged in as {authContext}</p> */}
        <span style={{ marginRight: 7 }}>
          Your YouTube channel ID to search
        </span>
        <input
          name="channelId"
          type="text"
          placeholder="UChZJRASiSGfBba91VvkdbEA"
          onChange={setInputUserData}
          value={userData.channelId}
        />
      </div>
      <button onClick={updateProfile}>Update profile</button>
    </div>
  );
}

export default Profile;
