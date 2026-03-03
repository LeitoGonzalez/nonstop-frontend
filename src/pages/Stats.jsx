import { useEffect, useState } from "react"
import "../App.css"
import { useNavigate } from "react-router-dom"
import ScoreChart from "../components/ScoreChart";



function diffClass(value) {
    if (value > 0) return "good"
    if (value < 0) return "bad"
    return ""
}

function diffClassErrors(value) {
    if (value < 0) return "good"
    if (value > 0) return "bad"
    return ""
}

function Stats({ user }) {
    const navigate = useNavigate()
    const [stats, setStats] = useState([])

    useEffect(() => {
        if (user) {
            fetch(`${import.meta.env.VITE_API_URL}/results/history/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                },
            })

                .then(res => res.json())
                .then(data => setStats(data))
        } else {
            const local = JSON.parse(localStorage.getItem("stats")) || []
            setStats(local)
        }
    }, [user])

    function diff(current, previous) {
        if (!previous) return null
        return current - previous
    }

    return (

        <div className="stats-page">

            <button className="back-btn" onClick={() => navigate("/")}>
                ← Volver
            </button>

            <div className="stats-layout">

                <div className="stats-left">
                    <h2>Estadísticas</h2>

                    {stats.length === 0 ? (
                        <p>No hay datos todavía</p>
                    ) : (
                        <table className="stats-table">
                            <tbody>
                                {stats.map((s, index) => {
                                    const prev = stats[index + 1]
                                    const isLatest = index === 0 && prev

                                    const wpmDiff = isLatest ? diff(s.wpm, prev.wpm) : null
                                    const accDiff = isLatest ? diff(s.accuracy, prev.accuracy) : null
                                    const errDiff = isLatest ? diff(s.errors, prev.errors) : null
                                    const scoreDiff = isLatest ? diff(s.score, prev.score) : null

                                    return (
                                        <tr key={index}>
                                            <td>
                                                WPM: {s.wpm}
                                                {wpmDiff !== null && (
                                                    <span className={diffClass(wpmDiff)}>
                                                        {" "}({wpmDiff > 0 ? "+" : ""}{wpmDiff})
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                Exactitud: {s.accuracy}%
                                                {accDiff !== null && (
                                                    <span className={diffClass(accDiff)}>
                                                        {" "}({accDiff > 0 ? "+" : ""}{accDiff}%)
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                Errores: {s.errors}
                                                {errDiff !== null && (
                                                    <span className={diffClassErrors(errDiff)}>
                                                        {" "}({errDiff > 0 ? "+" : ""}{errDiff})
                                                    </span>
                                                )}
                                            </td>

                                            <td>
                                                Puntuación: {s.score}
                                                {scoreDiff !== null && (
                                                    <span className={diffClass(scoreDiff)}>
                                                        {" "}({scoreDiff > 0 ? "+" : ""}{scoreDiff})
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="stats-right">
                    <h2>Desempeño</h2>

                    {stats.length > 0 ? (
                        <ScoreChart stats={stats} />
                    ) : (
                        <p>No hay datos todavía</p>
                    )}
                </div>

            </div>
        </div>


    )
}

export default Stats
