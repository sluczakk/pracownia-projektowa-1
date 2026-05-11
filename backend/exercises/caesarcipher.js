module.exports = {
  id: "caesar-cipher",
  title: "Szyfr Cezara",
  difficulty: "medium",
  description: "Napisz funkcję odwracającą kolejność słów w zdaniu.",
  longdescription: 
  `Napisz funkcję main() która szyfruje tekst za pomocą szyfru Cezara.

Dane wejściowe: string w postaci "<tekst> <przesunięcie>" np. "abc 3"

Dane wyjściowe: string zaszyfrowany poprzez przesunięcie każdej litery alfabetu o podaną liczbę pozycji.
- używamy tylko małych liter alfabetu łacińskiego (a-z)
- po przekroczeniu 'z' wracamy do 'a'

Przykład:
"abc 3" → "def"
"xyz 2" → "zab"

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const length = Math.floor(Math.random() * 8) + 10;
    const shift = Math.floor(Math.random() * 25) + 2;

    let text = "";
    for (let i = 0; i < length; i++) {
      text += letters[Math.floor(Math.random() * letters.length)];
    }

    let encrypted = "";
    for (let char of text) {
      const index = letters.indexOf(char);
      const newIndex = (index + shift) % 26;
      encrypted += letters[newIndex];
    }

    return {
      args: `${text} ${shift}`,
      expected: encrypted
    };
  },
};