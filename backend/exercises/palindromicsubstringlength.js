module.exports = {
  id: "palindromic-substring-length",
  title: "Długość najdłuższego palindromu",
  difficulty: "hard",
  description: "Znajdź długość najdłuższego fragmentu tekstu, który jest palindromem.",
  longdescription: 
  `Napisz funkcję main() która znajduje najdłuższy podciąg spójny będący palindromem oraz jego długość.

Dane wejściowe: string w postaci tekstu, np. "babad"

Dane wyjściowe: string w postaci "<długość> <palindrom>", np. "3 aba"

Jeżeli istnieje kilka palindromów o tej samej maksymalnej długości, należy zwrócić ostatni z nich (ten, który zaczyna się najpóźniej w tekście).

Palindrom to tekst, który czytany wspak jest identyczny.

Przykłady:
"babad" -> "3 aba"
("bab" i "aba" mają długość 3, ale "aba" występuje później)

"cbbd" -> "2 bb"

"racecar" -> "7 racecar"

Zakładamy, że tekst składa się tylko z małych liter alfabetu łacińskiego (a-z).

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

	generateInputOutput: () => {
		const letters = "abcdefghijklmnopqrstuvwxyz";
		const length = Math.floor(Math.random() * 24) + 35; //

		// generujemy losowy tekst jako tablicę
		let arr = [];
		for (let i = 0; i < length; i++) {
			arr.push(letters[Math.floor(Math.random() * letters.length)]);
		}

		// minimalny palindrom o dlugosci 3
		const mid = Math.floor(Math.random() * (length - 2));
		const c = letters[Math.floor(Math.random() * letters.length)];
		arr[mid] = c;
		arr[mid + 1] = letters[Math.floor(Math.random() * letters.length)];
		arr[mid + 2] = c;

		const text = arr.join("");

		function longestPalindromeLast(s) {
			let bestStart = 0;
			let bestLen = 1;

			function expand(left, right) {
				while (left >= 0 && right < s.length && s[left] === s[right]) {
					const currLen = right - left + 1;

					if (currLen > bestLen || (currLen === bestLen && left > bestStart)) {
						bestLen = currLen;
						bestStart = left;
					}

					left--;
					right++;
				}
			}

			for (let i = 0; i < s.length; i++) {
				expand(i, i);
				expand(i, i + 1);
			}

			const palindrome = s.slice(bestStart, bestStart + bestLen);
			return { length: bestLen, palindrome };
		}

		const res = longestPalindromeLast(text);

		return {
			args: text,
			expected: `${res.length} ${res.palindrome}`
		};
	},
};