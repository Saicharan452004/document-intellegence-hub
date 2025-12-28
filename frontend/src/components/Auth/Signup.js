import { useState } from "react";
import API_BASE from "../../config"; 
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setMsg(data.message || "Account created successfully");
  }

  return (
    <div className="signup-page">
      
      <h2 className="signup-heading">Create your account</h2>
      <p className="signup-subtext">
        Join the platform that turns your PDFs into answers.
      </p>

      <div className="signup-container">
        <form onSubmit={handleSubmit}>
          <input
            className="signup-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            className="signup-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="signup-btn" type="submit">
            Create Account
          </button>
        </form>

        {msg && <p className="signup-msg">{msg}</p>}
      </div>
    </div>
  );
}

export default Signup;
