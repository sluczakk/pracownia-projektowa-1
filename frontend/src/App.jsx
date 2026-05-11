import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Playground from "./pages/Playground";
import ExerciseList from "./pages/ExerciseList";
import ExerciseDetails from "./pages/ExerciseDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import API_BASE_URL from "./config";

function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // sprawdzamy czy uzytkownik zalogowany
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN:", token);

    if (!token) {
      setAuthChecked(true);
      return;
    }

    fetch(`${API_BASE_URL}/auth/verifytoken`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        //console.log("AUTH /me status:", res.status);

        if (!res.ok) {
          throw new Error("Nieprawidlowy token");
        }

        const data = await res.json();
        //console.log("AUTH /me data:", data);
        return data;
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => {
        //console.error("AUTH ERROR:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, []);

  // wylogowywanie
   function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  }
  
  return (
    <BrowserRouter>
      <div className="app">

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="nav-left">
            <h1 className="logo">Tester umiejętności programowania</h1>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Piaskownica</NavLink>
            <NavLink to="/exercises" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Zadania</NavLink>
          </div>

          <div className="nav-right">
            {user ? (
              <div className="user-section">
                <span className="user-email">Zalogowany jako {user?.email}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Wyloguj
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="login-btn">Login</NavLink>
            )}
          </div>

        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Playground />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercises/:id" element={<ExerciseDetails />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;