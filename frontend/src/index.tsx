import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import ecoprism_logo from './assets/ecoprism_logo.png';
import "./index.css";
import HomePageImage from './assets/HomePage.png'; // Import the new image

import Layout from "./pages/layout/Layout";
import NoPage from "./pages/NoPage";
import Chat from "./pages/chat/Chat";
import { AppStateProvider } from "./state/AppProvider";
import LinkedInLoginButton from "./LinkedInLoginButton";

initializeIcons();

// Landing page component
const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in on app load
  useEffect(() => {
    const isUserLoggedIn = localStorage.getItem("loggedIn");
    if (isUserLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (data: any) => {
    console.log("Login success:", data);
    localStorage.setItem("loggedIn", "true");
    setLoggedIn(true);
  };

  const handleLoginFailure = (error: any) => {
    console.error("Login failed:", error);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
  };

  const LandingPage = () => (
    <div className="container" style={{ position: "relative", overflow: "hidden" }}>
      {/* Full-screen image */}
      <img
        className="HomePageImage"
        src={HomePageImage}
        alt="HomePage"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1, // Place behind other content
        }}
      />
  
      {/* Content container */}
      <div className="content-container" style={{ position: "relative", zIndex: 1 }}>
        <div className="bottom-content" style={{ position: "fixed", bottom: 0, right: 0 }}>
          {/* Wrapping LinkedInLoginButton in a div with styles */}
          <div style={{ width: "70%", height: "fixed", cursor: "pointer" }}>
            <LinkedInLoginButton onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          {loggedIn ? (
            <Route path="/" element={<Layout />} />
          ) : (
            <>
              <Route index element={<LandingPage />} />
              <Route
                path="/login"
                element={<LinkedInLoginButton onLoginSuccess={handleLoginSuccess} onLoginFailure={handleLoginFailure} />}
              />
            </>
          )}
          <Route path="/logout" element={<Navigate to="/" />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

export default App;
