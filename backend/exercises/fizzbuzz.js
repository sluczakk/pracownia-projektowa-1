module.exports = {
	id: "fizzbuzz",
  title: "FizzBuzz",
  difficulty: "easy",
  description: "Napisz funkcję wypisującą liczby, zamieniając niektóre z nich na wyrazy ze względu na podzielność.",
  longdescription: 
  `Napisz funkcję main() która dla podanej liczby całkowitej wypisuje ciąg FizzBuzz.

Dane wejściowe: string w postaci "<n>" np. "15"

Dane wyjściowe: string zawierający liczby od 1 do n (włącznie), gdzie:
- dla liczb podzielnych przez 3 wypisywane jest "Fizz"
- dla liczb podzielnych przez 5 wypisywane jest "Buzz"
- dla liczb podzielnych przez 3 i 5 wypisywane jest "FizzBuzz"
- w pozostałych przypadkach wypisywana jest liczba

Wynik powinien być oddzielony spacjami, np. dla n = 15:
"1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz"

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
  	const n = Math.floor(Math.random() * 20) + 31;

    let result = [];
    for (let i = 1; i <= n; i++) {
      if (i % 15 === 0) result.push("FizzBuzz");
      else if (i % 3 === 0) result.push("Fizz");
      else if (i % 5 === 0) result.push("Buzz");
      else result.push(i.toString());
    }

    return {
      args: `${n}`,
      expected: result.join(" ")
    };
  },
};