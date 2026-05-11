module.exports = {
  id: "minimum-number-of-coins",
  title: "Minimalna liczba monet",
  difficulty: "hard",
  description: "Znajdź minimalną liczbę monet potrzebną do uzyskania danej kwoty.",
  longdescription: 
  `Napisz funkcję main() która dla wielu przypadków znajduje minimalną liczbę monet potrzebną do uzyskania podanej kwoty.

Dane wejściowe: string zawierający kilka przypadków w postaci:
"<monety> | <kwota>", oddzielonych przecinkami

Przykład:
"1 2 5 | 11, 2 | 3, 1 3 4 | 6"

Dane wyjściowe: string zawierający wyniki dla każdego przypadku (minimalna liczba monet lub -1), oddzielone spacjami.

Przykład:
"1 2 5 | 11, 2 | 3, 1 3 4 | 6" -> "3 -1 2"

Zasady:
- można używać każdej monety dowolną liczbę razy
- jeśli nie da się uzyskać kwoty, zwróć "-1"

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

	generateInputOutput: () => {
		const casesCount = Math.floor(Math.random() * 3) + 5;

		let inputs = [];
		let outputs = [];

		function minCoins(coins, amount) {
			const dp = new Array(amount + 1).fill(Infinity);
			dp[0] = 0;

			for (let i = 1; i <= amount; i++) {
				for (const coin of coins) {
					if (coin <= i && dp[i - coin] !== Infinity) {
						dp[i] = Math.min(dp[i], dp[i - coin] + 1);
					}
				}
			}

			return dp[amount] === Infinity ? -1 : dp[amount];
		}

		// 🔥 1. gwarantowany przypadek bez rozwiązania
		const badCoin = Math.floor(Math.random() * 5) + 2; // np. 2–6
		const badCoins = [badCoin];
		const badAmount = badCoin * (Math.floor(Math.random() * 5) + 1) + 1; // niepodzielne

		inputs.push(`${badCoins.join(" ")} | ${badAmount}`);
		outputs.push(-1);

		// 🔥 2. reszta przypadków normalna
		for (let k = 1; k < casesCount; k++) {
			const coinsCount = Math.floor(Math.random() * 4) + 2; // 2–5 monet
			let coins = [];

			while (coins.length < coinsCount) {
				const coin = Math.floor(Math.random() * 9) + 1;
				if (!coins.includes(coin)) {
					coins.push(coin);
				}
			}

			coins.sort((a, b) => a - b);

			const amount = Math.floor(Math.random() * 25) + 1;

			inputs.push(`${coins.join(" ")} | ${amount}`);
			outputs.push(minCoins(coins, amount));
		}

		return {
			args: inputs.join(", "),
			expected: outputs.join(" ")
		};
	},
};