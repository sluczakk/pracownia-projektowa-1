module.exports = {
  id: "two-sum-classic",
  title: "Two Sum",
  difficulty: "medium",
  description: "Znajdź dwie liczby, których suma daje target.",
  longdescription: 
  `Napisz funkcję main() która znajduje dwie liczby w tablicy, których suma jest równa podanej wartości.

Dane wejściowe: string w postaci "<liczby> | <target>"
gdzie liczby są oddzielone spacjami, np. "2 7 11 15 | 9"

Dane wyjściowe: string zawierający indeksy (indeks zaczyna się od 0) dwóch liczb, których suma daje target, np. "0 1"

Kolejność indeksów ma znaczenie.

Zakładamy, że:
- istnieje dokładnie jedno rozwiązanie
- nie można użyć tego samego elementu dwa razy

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
    let nums, target, validPairs;

    do {
      const length = Math.floor(Math.random() * 10) + 15;
      nums = [];

      for (let i = 0; i < length; i++) {
        nums.push(Math.floor(Math.random() * 30));
      }

      const i = Math.floor(Math.random() * length);
      let j;
      do {
        j = Math.floor(Math.random() * length);
      } while (j === i);

      target = nums[i] + nums[j];

      validPairs = [];
      for (let a = 0; a < nums.length; a++) {
        for (let b = a + 1; b < nums.length; b++) {
          if (nums[a] + nums[b] === target) {
            validPairs.push([a, b]);
          }
        }
      }
    } while (validPairs.length !== 1);

    // gwarantujemy kolejność (np. rosnąco)
    const [a, b] = validPairs[0];
    const ordered = a < b ? [a, b] : [b, a];

    return {
      args: `${nums.join(" ")} | ${target}`,
      expected: `${ordered[0]} ${ordered[1]}`
    };
  },
};