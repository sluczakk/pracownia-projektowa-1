module.exports = {
  id: "reverse-sentence",
  title: "Odwrócone zdanie",
  difficulty: "easy",
  description: "Napisz funkcję odwracającą kolejność słów w zdaniu.",
  longdescription: 
  `Napisz funkcję main() która odwraca kolejność wyrazów w zdaniu.

Dane wejściowe: string w postaci zdania, np. "ala ma kota"

Dane wyjściowe: string z odwróconą kolejnością wyrazów, np. "kota ma ala"

Wyrazy są oddzielone pojedynczą spacją.

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
		const words = [
			"ala", "ma", "kota", "pies", "lubi", "biega", "dom", "las",
			"samochod", "droga", "miasto", "szkola", "ogrod", "ptak",
			"niebo", "morze", "gora", "rzeka", "czlowiek", "czas"
		];

		// losowa długość 12–18
		const length = Math.floor(Math.random() * 7) + 12;

		// tasowanie
		const shuffled = [...words].sort(() => Math.random() - 0.5);

		// unikalne słowa
		const sentence = shuffled.slice(0, length);

		const input = sentence.join(" ");
		const reversed = [...sentence].reverse().join(" ");

		return {
			args: input,
			expected: reversed
		};
	},
};