function Words({ words, currentWordIndex, input, wordErrors }) {
  return (
    <div className="words">
      {words.map((word, wIndex) => (
        <span key={wIndex} className="word">
          {word.split("").map((char, cIndex) => {
            let className = "char"

            if (wIndex < currentWordIndex) {
              className += " completed"
            } else if (wIndex === currentWordIndex) {
              if (wordErrors[wIndex]?.[cIndex]) {
                className += " incorrect"
              } else if (cIndex < input.length) {
                className += " correct"
              } else {
                className += " pending"
              }

              //letra activa
              if (cIndex === input.length) {
                className += " active"
              }
            }

            return (
              <span key={cIndex} className={className}>
                {char}
              </span>
            )
          })}

          {/* espacio separado */}
          <span className="space"> </span>
        </span>
      ))}
    </div>
  )
}

export default Words