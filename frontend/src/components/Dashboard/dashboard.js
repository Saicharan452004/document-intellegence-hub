import { useState, useEffect, useRef } from "react";
import { getToken, logout } from "../../auth";
import ChatPanel from "../Chat/chatpanel"
import { useNavigate } from "react-router-dom";
import API_BASE from "../../config"; 
import "./dashboard.css";

function Dashboard() {
  const token = localStorage.getItem("token");

  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  async function loadDocs() {
    const res = await fetch(`${API_BASE}/documents`, {
      headers: { Authorization: "Bearer " + getToken() }
    });

    const data = await res.json();
    setDocs(data);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function uploadDoc(e) {
    e.preventDefault();
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: "POST",
      headers: { Authorization: "Bearer " + getToken() },
      body: form
    });

    const data = await res.json();
    setMsg(data.message || "Uploaded");
    loadDocs();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deleteDoc(id) {
    await fetch(`${API_BASE}/documents/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + getToken() }
    });

    setDocs(prev => prev.filter(d => d._id !== id));
  }

  useEffect(() => {
    loadDocs();
  }, []);

  return (
    <div className="dash-container">
      <div className="logout-container">
        <div className="logout-heading-container">
          <h1 className="dash-title">Your AI Document Assistant</h1>
          <p className="dash-subtitle"> Upload PDFs, ask questions, and manage your files — all in one place. </p>
        </div>
      <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="dash-card">
        <h3>Upload Document</h3>

        <form onSubmit={uploadDoc} className="upload-box">
          <input
            ref={fileInputRef}
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />

          <button type="submit" className="upload-btn">
            Upload
          </button>
        </form>

        {msg && <p className="upload-msg">{msg}</p>}
      </div>
      <div className="dash-card">
        <h3>Ask Questions</h3>
        <ChatPanel token={token} />
      </div>
      <div className="dash-card">
        <h3>Your Documents</h3>

        {docs.length === 0 && (
          <p className="empty-note">No documents uploaded yet.</p>
        )}

        <ul className="doc-list">
          {docs.map(d => (
            <li key={d._id}>
              <span>{d.name}</span>

              <button
                className="delete-btn"
                onClick={() => deleteDoc(d._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default Dashboard;
