import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleGoogleSuccess(credentialResponse) {
    const token = credentialResponse.credential;

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/google-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) throw new Error("Error validando token");

      const data = await res.json();

      // Decodificar el JWT para obtener nombre y foto
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const displayName = decoded.name;
      const profilePic = decoded.picture;

      // Guardar en localStorage
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", displayName);
      localStorage.setItem("profilePic", profilePic);

      // Actualizar estado
      setUser({ username: displayName, profilePic });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Login con Google falló");
    }
  }



  function handleGoogleError() {
    console.log("Login con Google falló");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("username", username);

      setUser({ username });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Volver
      </button>

      <div className="login-container">
        <h2>Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Entrar</button>


          <div className="login-actions">
            <div className="google-btn">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>

            <button type="button" onClick={() => navigate("/register")} className="register-btn" > Registrarse </button>
          </div>

          {error && <div className="login-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;