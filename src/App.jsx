import { useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Stats from "./pages/Stats"
import Nonstopapp from "./pages/Nonstopapp"
import Register from "./pages/Register"

function App() {
  const [user, setUser] = useState(() => {
    const access = localStorage.getItem("access")
    const username = localStorage.getItem("username")
    const profilePic = localStorage.getItem("profilePic")

    if (access && username) {
      return { username, profilePic }
    }
    return null
  })


  function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("username")
    localStorage.removeItem("profilePic")
    setUser(null)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Nonstopapp user={user} onLogout={logout} />}
      />

      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
      />

      <Route
        path="/stats"
        element={<Stats user={user} />}
      />
    </Routes>
  )
}

export default App
