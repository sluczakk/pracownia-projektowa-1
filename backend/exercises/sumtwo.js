module.exports = {
  id: "sum-two-numbers",
  title: "Suma dwóch liczb",
  difficulty: "easy",
  description: "Napisz funkcję wypisującą sumę dwóch liczb.",
  longdescription: 
  `Napisz funkcję main() która wypisuje sumę dwóch liczb całkowitych jako string.
Dane wejściowe: string w postaci "<liczba1> <liczba2>" np. "2 8"
Dane wyjściowe: string w postaci "<suma>", np "10"

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout`,

  generateInputOutput: () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);

    return {
        args: `${a} ${b}`,
        expected: `${a + b}`
    };
  },
};