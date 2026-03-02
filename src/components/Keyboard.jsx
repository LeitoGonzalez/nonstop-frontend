import { useEffect, useState } from "react"
import "./Keyboard.css"

const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
]

const Keyboard = () => {
  console.log("API URL:", import.meta.env.VITE_API_URL)
  const [pressedKey, setPressedKey] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKey(e.key.toLowerCase())
    }

    const handleKeyUp = () => {
      setPressedKey(null)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return (
    <div className="keyboard">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => (
            <div
              key={key}
              className={`key ${pressedKey === key ? "active" : ""}`}
            >
              {key.toUpperCase()}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard
