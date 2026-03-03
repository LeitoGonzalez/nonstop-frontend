import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function clearValidity(ref) {
        ref.current.setCustomValidity("");
    }

    function validateNative() {
        clearValidity(usernameRef);
        clearValidity(emailRef);
        clearValidity(passwordRef);

        if (usernameRef.current.value.trim().length < 3) {
            usernameRef.current.setCustomValidity(
                "El usuario debe tener al menos 3 caracteres"
            );
        }

        if (!emailRef.current.validity.valid) {
            emailRef.current.setCustomValidity("El email no es válido");
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


        if (!passwordRegex.test(passwordRef.current.value)) {
            passwordRef.current.setCustomValidity(
                "Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo"
            );
        }

        return (
            usernameRef.current.reportValidity() &&
            emailRef.current.reportValidity() &&
            passwordRef.current.reportValidity()
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        clearValidity(usernameRef);
        clearValidity(emailRef);
        clearValidity(passwordRef);

        if (!validateNative()) return;

        setLoading(true);

        try {
            const res = await fetch('${import.meta.env.VITE_API_URL}/register/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usernameRef.current.value.trim(),
                    email: emailRef.current.value.trim(),
                    password: passwordRef.current.value,
                }),
            });

            let data = {};
            try {
                data = await res.json();
            } catch {
                // respuesta sin JSON
            }

            if (!res.ok) {
                const error =
                    data.error ||
                    "No se pudo registrar. Verificá los datos ingresados.";

                if (error.toLowerCase().includes("usuario")) {
                    usernameRef.current.setCustomValidity(error);
                    usernameRef.current.reportValidity();
                } else if (error.toLowerCase().includes("email")) {
                    emailRef.current.setCustomValidity(error);
                    emailRef.current.reportValidity();
                } else {
                    passwordRef.current.setCustomValidity(error);
                    passwordRef.current.reportValidity();
                }

                return;
            }

            navigate("/login");
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Crear cuenta</h2>

                <form className="register-form" onSubmit={handleSubmit} noValidate>
                    <input
                        ref={usernameRef}
                        type="text"
                        placeholder="Usuario"
                        required
                        onInput={() => clearValidity(usernameRef)}
                    />

                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Email"
                        required
                        onInput={() => clearValidity(emailRef)}
                    />

                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Contraseña"
                        required
                        onInput={() => clearValidity(passwordRef)}
                    />

                    <button type="submit" disabled={loading}>
                        Registrarse
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;