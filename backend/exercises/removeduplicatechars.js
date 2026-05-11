module.exports = {
  id: "remove-duplicate-characters",
  title: "Usuń duplikaty znaków",
  difficulty: "medium",
  description: "Napisz funkcję która usuwa powtarzające się znaki z napisu.",
  longdescription: 
  `Napisz funkcję main() która usuwa powtarzające się znaki z napisu, zachowując kolejność ich pierwszego wystąpienia.

Dane wejściowe: string w postaci tekstu, np. "banana"

Dane wyjściowe: string bez duplikatów znaków, np. "ban"

Usuwamy wszystkie kolejne wystąpienia znaku, pozostawiając tylko pierwsze.

Przykład:
"banana" → "ban"
"abcabc" → "abc"

Zakładamy, że tekst składa się tylko z małych liter alfabetu łacińskiego (a-z).

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const length = Math.floor(Math.random() * 20) + 35;

    let text = "";
    for (let i = 0; i < length; i++) {
      text += letters[Math.floor(Math.random() * letters.length)];
    }

    let seen = new Set();
    let result = "";

    for (let char of text) {
      if (!seen.has(char)) {
        seen.add(char);
        result += char;
      }
    }

    return {
      args: text,
      expected: result
    };
  },
};