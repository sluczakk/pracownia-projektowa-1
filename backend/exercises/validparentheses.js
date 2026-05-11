module.exports = {
  id: "valid-parentheses",
  title: "Poprawne nawiasy",
  difficulty: "medium",
  description: "Sprawdź czy każdy fragment nawiasów jest poprawny.",
  longdescription: 
  `Napisz funkcję main() która sprawdza czy każdy fragment nawiasów w napisie jest poprawnie zbalansowany.

Dane wejściowe: string zawierający kilka fragmentów nawiasów oddzielonych spacjami, np. "[()] {([)}"

Dane wyjściowe: string zawierający wyniki dla każdego fragmentu ("true" lub "false") oddzielone spacjami.

Przykład:
"[()] {([)}" → "true false"

Nawiasy są poprawne jeśli:
- każdy otwierający nawias ma odpowiadający zamykający
- nawiasy są poprawnie zagnieżdżone

Dane wejściowe są podawane poprzez pierwszy stdin (pierwsze wypisanie z buforu wejściowego).
Dane wyjściowe są podawane przez ostatni stdout.`,

  generateInputOutput: () => {
    const opens = ["(", "[", "{"];
    const closes = {
      "(": ")",
      "[": "]",
      "{": "}"
    };
    const pairs = { ")": "(", "]": "[", "}": "{" };

    function generateValidBlock() {
      let stack = [];
      let result = "";
      const length = Math.floor(Math.random() * 5) + 2;

      for (let i = 0; i < length; i++) {
        if (stack.length === 0 || Math.random() < 0.6) {
          const open = opens[Math.floor(Math.random() * opens.length)];
          stack.push(open);
          result += open;
        } else {
          const last = stack.pop();
          result += closes[last];
        }
      }

      while (stack.length > 0) {
        result += closes[stack.pop()];
      }

      return result;
    }

    function isValid(str) {
      let stack = [];
      for (let char of str) {
        if (opens.includes(char)) {
          stack.push(char);
        } else {
          if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
            return false;
          }
          stack.pop();
        }
      }
      return stack.length === 0;
    }

    const blocksCount = Math.floor(Math.random() * 6) + 8;

    let blocks = [];

    for (let i = 0; i < blocksCount; i++) {
      let block = generateValidBlock();

      // 50% szansy na popsucie
      if (Math.random() < 0.4) {
        const brackets = ["(", ")", "[", "]", "{", "}"];
        const pos = Math.floor(Math.random() * block.length);
        const randomBracket = brackets[Math.floor(Math.random() * brackets.length)];
        block = block.slice(0, pos) + randomBracket + block.slice(pos + 1);
      }

      blocks.push(block);
    }

    const input = blocks.join(" ");
    const expected = blocks.map(b => isValid(b) ? "true" : "false").join(" ");

    return {
      args: input,
      expected
    };
  },
};