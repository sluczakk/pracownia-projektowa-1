module.exports = {
  id: "character-frequency",
  title: "Częstotliwość znaków",
  difficulty: "medium",
  description: "Napisz funkcję która zlicza wystąpienia każdego znaku w napisie.",
  longdescription: 
  `Napisz funkcję main() która zlicza częstotliwość występowania każdego znaku w napisie.

Dane wejściowe: string w postaci tekstu, np. "aabccc"

Dane wyjściowe: string zawierający pary "<znak>:<liczba>" posortowane malejąco według liczby wystąpień.
W przypadku remisu znaki należy sortować alfabetycznie rosnąco.
Pary są oddzielone spacjami.

Przykład:
"aabccc" → "c:3 a:2 b:1"

Zakładamy, że tekst składa się tylko z małych liter alfabetu łacińskiego (a-z).

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const length = Math.floor(Math.random() * 20) + 26;

    let text = "";
    for (let i = 0; i < length; i++) {
      text += letters[Math.floor(Math.random() * letters.length)];
    }

    const freq = {};
    for (let char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }

    const sorted = Object.entries(freq)
      .sort((a, b) => {
        // najpierw malejąco po liczbie
        if (b[1] !== a[1]) return b[1] - a[1];
        // potem alfabetycznie
        return a[0].localeCompare(b[0]);
      });

    const result = sorted
      .map(([char, count]) => `${char}:${count}`)
      .join(" ");

    return {
      args: text,
      expected: result
    };
  },
};