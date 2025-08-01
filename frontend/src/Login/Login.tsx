import "./Login.scss";

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { objToQueryString, addCookie } from "utils";
import AuthContext from "AuthContext";

function Login() {
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { authContext, setAuthContext } = useContext(AuthContext);

  const updateInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function submit() {
    fetch(
      `http://127.0.0.1:5000/auth?${objToQueryString({
        username: formData.user,
        password: formData.password,
      })}`
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        addCookie({ key: "auth", value: json.response, exp: json.expiry });
        setAuthContext(json.response);

        if (json.success) {
          navigate("/home");
        }
      });
  }
  return (
    <div className="container">
      <div style={{ flex: 1 }} />
      <div className="pane">
        <h1>Login</h1>
        <p style={{ marginTop: 0 }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
        <input
          name="user"
          type="text"
          placeholder="Username"
          onChange={updateInput}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={updateInput}
        />
        <button onClick={submit}>Login</button>
      </div>
      <div style={{ flex: 2 }} />
    </div>
  );
}

export default Login;
