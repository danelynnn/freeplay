import "./Register.scss";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { objToQueryString } from "utils";

function Register() {
  const [formData, setFormData] = useState({
    user: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const updateInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function submit() {
    fetch(
      `http://127.0.0.1:5000/auth?${objToQueryString({
        username: formData.user,
        email: formData.email,
        password: formData.password,
      })}`,
      { method: "POST" }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json["success"]) navigate("/login");
      });
  }

  return (
    <div className="container">
      <div style={{ flex: 1 }} />
      <div className="pane">
        <h1>Register</h1>
        <p style={{ marginTop: 0 }}>
          Been here? <Link to="/login">Login</Link>
        </p>
        <input
          name="user"
          type="text"
          placeholder="username"
          onChange={updateInput}
        />
        <input
          name="email"
          type="text"
          placeholder="example@email.com"
          onChange={updateInput}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={updateInput}
        />
        <button onClick={submit}>Sign up</button>
      </div>
      <div style={{ flex: 2 }} />
    </div>
  );
}

export default Register;
