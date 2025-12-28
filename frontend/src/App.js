import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Dashboard from "./components/Dashboard/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Turn your PDFs into smart answers</h1>

      <p className="home-subtitle">
        Upload your documents. Ask questions. <br />
        Get instant AI-powered insights.
      </p>

      <div className="home-card">
        <Link to="/signup" className="primary-btn">
          Get Started
        </Link>

        <div className="home-links">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-link">Login</Link>
          </p>

          <p>
            Want to explore?{" "}
            <Link to="/dashboard" className="text-link">Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
