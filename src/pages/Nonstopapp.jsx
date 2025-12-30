import { useEffect, useRef, useState } from "react"
import "../App.css"
import { getWords } from "../words/getWords"
import Words from "../components/Words"
import Keyboard from "../components/Keyboard"
import { useNavigate } from "react-router-dom"

function Nonstopapp({ user, onLogout }) {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const [language, setLanguage] = useState("es")
    const [words, setWords] = useState([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)
    const [input, setInput] = useState("")
    const [pendingErrors, setPendingErrors] = useState({})
    const [wordErrors, setWordErrors] = useState({})
    const [startTime, setStartTime] = useState(null)
    const [typedChars, setTypedChars] = useState(0)
    const [errors, setErrors] = useState(0)
    const [readyToStart, setReadyToStart] = useState(true)
    const [finalMetrics, setFinalMetrics] = useState({
        wpm: 0,
        accuracy: 100,
        errors: 0,
        score: 0
    })

    const inputRef = useRef(null)

    const regexByLang = {
        es: /^[a-záéíóúüñ]$/i,
        en: /^[a-z]$/i,
        fr: /^[a-zàâçéèêëîïôûùüÿœ]$/i,
        de: /^[a-zäöüß]$/i,
        it: /^[a-zàèéìòóù]$/i
    }

    useEffect(() => {
        const newWords = getWords(language, 20)

        setWords(newWords)
        setCurrentWordIndex(0)
        setInput("")
        setPendingErrors({})
        setWordErrors({})
        setReadyToStart(true)

        setTimeout(() => inputRef.current?.focus(), 0)
    }, [language])

    function handleChange(e) {
        const value = e.target.value
        const currentWord = words[currentWordIndex]
        if (!currentWord) return
        const index = input.length
        const typedChar = value[value.length - 1]

        if (!regexByLang[language].test(typedChar)) {
            // ignorar teclas inválidas (números, especiales, etc.)
            e.target.value = ""
            return
        }

        const expectedChar = currentWord[index]

        // iniciar timer si es la primera letra de la tanda
        if (readyToStart && value.length === 1) {
            setStartTime(Date.now())
            setTypedChars(0)
            setErrors(0)
            setWordErrors({})
            setPendingErrors({})
            setReadyToStart(false)
        }

        // bloquear backspace
        if (e.nativeEvent.inputType === "deleteContentBackward") {
            e.preventDefault()
            return
        }

        if (index >= currentWord.length) return

        if (typedChar === expectedChar) {
            // letra correcta → avanzar
            setInput(prev => prev + typedChar)
            setTypedChars(c => c + 1)

            // marcar errores pendientes si existen
            if (pendingErrors[currentWordIndex]?.[index]) {
                setWordErrors(prev => ({
                    ...prev,
                    [currentWordIndex]: {
                        ...prev[currentWordIndex],
                        [index]: true
                    }
                }))
                setPendingErrors(prev => {
                    const copy = { ...prev }
                    delete copy[currentWordIndex][index]
                    return copy
                })
            }

            // pasar a siguiente palabra si terminó
            if (input.length + 1 === currentWord.length) {
                setTimeout(() => {
                    setInput("")
                    if (currentWordIndex + 1 === words.length) {
                        // calcular métricas finales
                        const elapsedMinutes = (Date.now() - startTime) / 60000
                        const wpmFinal = elapsedMinutes > 0 ? Math.round((typedChars + 1) / 5 / elapsedMinutes) : 0
                        const accuracyFinal = typedChars > 0 ? Math.max(0, Math.round(((typedChars + 1 - errors) / (typedChars + 1)) * 100)) : 100
                        const scoreFinal = Math.max(0, Math.round(wpmFinal * (accuracyFinal / 10)))

                        setFinalMetrics({
                            wpm: wpmFinal,
                            accuracy: accuracyFinal,
                            errors: errors,
                            score: scoreFinal
                        })

                        const result = {
                            wpm: wpmFinal,
                            accuracy: accuracyFinal,
                            errors: errors,
                            score: scoreFinal,
                            date: new Date().toISOString()
                        }

                        if (user) {
                            fetch("http://localhost:8000/results/", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${localStorage.getItem("access")}`
                                },
                                body: JSON.stringify(result)
                            })
                        } else {
                            const localStats = JSON.parse(localStorage.getItem("stats")) || []
                            localStats.unshift(result)
                            localStorage.setItem("stats", JSON.stringify(localStats))
                        }

                        // cargar nueva tanda
                        const newWords = getWords(language, 20)

                        setWords(newWords)
                        setCurrentWordIndex(0)
                        setReadyToStart(true)
                        setInput("")
                        setTypedChars(0)
                        setErrors(0)
                        setWordErrors({})
                        setPendingErrors({})
                        setStartTime(null)
                    } else {
                        setCurrentWordIndex(i => i + 1)
                    }
                }, 0)
            }
        } else {
            // letra incorrecta → registrar error pendiente
            setErrors(err => err + 1)
            setPendingErrors(prev => ({
                ...prev,
                [currentWordIndex]: {
                    ...prev[currentWordIndex],
                    [index]: true
                }
            }))
        }
    }

    const { wpm, accuracy, errors: finalErrors, score } = finalMetrics

    return (
        <div className="app">
            <div className="top-controls">
                <select value={language} onChange={e => setLanguage(e.target.value)}>
                    <option value="es">ES</option>
                    <option value="en">EN</option>
                    <option value="fr">FR</option>
                    <option value="de">DE</option>
                    <option value="it">IT</option>
                </select>
                <div className="user-area">
                    <div className="user-menu">
                        <button
                            className="user-icon"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {user && user.profilePic ? (<img src={user.profilePic} alt="Foto de perfil" className="profile-pic" />) : ("👤")}
                        </button>

                        {menuOpen && (
                            <div className="dropdown">
                                <div className="username">
                                    {user ? user.username : "Usuario"}
                                </div>

                                <button onClick={() => navigate("/stats")}>
                                    Ver estadísticas
                                </button>

                                {!user ? (
                                    <button onClick={() => navigate("/login")}>
                                        Login
                                    </button>
                                ) : (
                                    <button onClick={onLogout}>
                                        Logout
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <section className="info">
                <div>WPM: <strong>{wpm}</strong></div>
                <div>Exactitud: <strong>{accuracy}%</strong></div>
                <div>Errores: <strong>{finalErrors}</strong></div>
                <div>Puntuación: <strong>{score}</strong></div>
            </section>

            <section className="palabras">
                <input
                    ref={inputRef}
                    type="text"
                    value={""}
                    onChange={handleChange}
                    onKeyDown={e => { if (e.key === "Backspace") e.preventDefault() }}
                    autoFocus
                    style={{ opacity: 0, position: "absolute", pointerEvents: "none" }}
                />

                {words.length === 0 ? (
                    "Cargando palabras..."
                ) : (
                    <Words
                        words={words}
                        currentWordIndex={currentWordIndex}
                        input={input}
                        wordErrors={wordErrors}
                    />
                )}
            </section>

            <section className="grafica">
                <Keyboard />
            </section>
        </div>
    )
}

export default Nonstopapp