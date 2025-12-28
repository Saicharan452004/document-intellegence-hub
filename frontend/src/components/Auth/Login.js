import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      saveToken(data.token);
      setMsg("Login successful");
      navigate("/dashboard");
    } else {
      setMsg(data.message || "Login failed");
    }
  }

  return (
    <div className="login-page">

      <h2 className="login-heading">Welcome back</h2>
      <p className="login-subtext">
        Sign in to continue where you left off.
      </p>

      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-msg">{msg}</p>
      </div>
    </div>
  );
}

export default Login;
