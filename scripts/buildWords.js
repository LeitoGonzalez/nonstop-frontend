import fs from "fs"
import path from "path"


const RAW_DIR = path.resolve("wordlists")
const OUT_DIR = path.resolve("src/words")

const LANGS = {
  es: {
    file: "es_50k.txt",
    regex: /^[a-záéíóúüñ]+$/i
  },
  en: {
    file: "en_50k.txt",
    regex: /^[a-z]+$/i
  },
  de: {
    file: "de_50k.txt",
    regex: /^[a-zäöüß]+$/i
  },
  fr: {
    file: "fr_50k.txt",
    regex: /^[a-zàâçéèêëîïôûùüÿñæœ]+$/i
  },
  it: {
    file: "it_50k.txt",
    regex: /^[a-zàèéìíîòóù]+$/i
  }
}

const WORD_COUNT = 1000
const MIN_LEN = 3
const MAX_LEN = 8



if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true })
}

for (const [lang, cfg] of Object.entries(LANGS)) {
  const rawPath = path.join(RAW_DIR, cfg.file)
  const outPath = path.join(OUT_DIR, `${lang}.json`)

  if (!fs.existsSync(rawPath)) {
    console.error(`No existe ${rawPath}`)
    continue
  }

  const lines = fs.readFileSync(rawPath, "utf8").split("\n")

  const words = []
  const seen = new Set()

  for (const line of lines) {
    if (words.length >= WORD_COUNT) break

    const word = line.split(" ")[0].toLowerCase().trim()

    if (
      word.length < MIN_LEN ||
      word.length > MAX_LEN ||
      !cfg.regex.test(word) ||
      seen.has(word)
    ) {
      continue
    }

    seen.add(word)
    words.push(word)
  }

  fs.writeFileSync(outPath, JSON.stringify(words, null, 2), "utf8")

  console.log(`${lang}: ${words.length} palabras`)
}

console.log("Listas generadas correctamente")
