import es from "./es.json"
import en from "./en.json"
import de from "./de.json"
import fr from "./fr.json"
import it from "./it.json"

const WORDS_BY_LANG = {
  es,
  en,
  de,
  fr,
  it
}

export function getWords(lang = "es", count = 25) {
  const list = WORDS_BY_LANG[lang] || WORDS_BY_LANG.en

  // shuffle simple
  const shuffled = [...list].sort(() => Math.random() - 0.5)

  return shuffled.slice(0, count)
}