import "./../App.css";
import Editor from "@monaco-editor/react";
import React, { useState, useEffect } from "react";

import API_BASE_URL from "../config";

export default function CodeRunner({
  exerciseid = "",
  exerciseTitle = "",
  solvedLanguages = [],
  setSolvedLanguages = () => {}
}) {
  const [code, setCode] = useState(``);
  const [language, setLanguage] = useState("python");

  useEffect(() => {
    setCode(
        exerciseid
        ? getDefaultCodeExercise(language)
        : getDefaultCode(language)
    );
    }, [language, exerciseid]);
  
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [loading, setLoading] = useState(false);

  const [displayText, setDisplayText] = useState("");

  // token wysylany do weryfikacji tozsamosci
  function getAuthHeaders(withJson = false) {
    const token = localStorage.getItem("token");

    return {
      ...(withJson ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    };
  }

  async function runCode() {
    setLoading(true);
    setStdout("");
    setStderr("");

    //console.log("Kod: " + code);
    //console.log("jezyk: " + language);

    try {
      const response = await fetch(`${API_BASE_URL}/run`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify({ code, language, exerciseid })
      });

      const data = await response.json();
      setStdout(data.stdout || "");
      setStderr(data.stderr || "");

      //console.log("wynik: " + data.stdout);

			setDisplayText(
				!exerciseid ? (
						data.stdout || ""
				) : (
						<>
						<div style={{ fontWeight: "bold", color: "#d94ade" }}>
								DANE WEJŚCIOWE:
						</div>
						<div>{data.exercise_input}</div>

						<div style={{ marginTop: "10px", fontWeight: "bold", color: "#dedc4a" }}>
								STDOUT:
						</div>
						<div>{data.stdout}</div>

						<div style={{ marginTop: "10px", fontWeight: "bold", color: "#60a5fa" }}>
								OCZEKIWANY WYNIK:
						</div>
						<div>{data.exercise_output}</div>

						<div style={{ marginTop: "10px", fontWeight: "bold", color: data.stdout.trim() === data.exercise_output.trim() ? "#4CAF50" : "#fa6060" }}>
								<p>{data.stdout.trim() === data.exercise_output.trim() ? "Zadanie rozwiązano poprawnie" : "Niepoprawny wynik"}</p>
						</div>
						</>
				)
      );

			// aktualizujemy rozwiazane jezyki lokalnie
			if (exerciseid) {
				if (data.stdout.trim() === data.exercise_output.trim()) {
					setSolvedLanguages(prev => {
						if (prev.includes(language)) return prev;
						return [...prev, language];
					});
				}
			}
			
    } catch (err) {
      setStderr("Zapytanie się nie powiodło: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function getDefaultCode(lang) {
    if (lang === "python") {
      return 'print("Hello from Python")';
    }
    if (lang === "java") {
      return `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java");
    }
}`;
    }
    if (lang === "cpp") {
      return `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from C++" << endl;
    return 0;
 }`;
    }
    return "";
  }

  function getDefaultCodeExercise(lang) {
    if (lang === "python") {
      return `def main():
    x = input() # input jako string
    print(x)    # output jako string
    
main()`;
    }
    if (lang === "java") {
      return `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String x = scanner.nextLine(); // input jako string
        System.out.println(x);         // output jako string
        scanner.close();
    }
}`;
    }
    if (lang === "cpp") {
      return `#include <iostream>
#include <string>
using namespace std;

int main() {
    string x;
    getline(cin, x);   // input jako string
    cout << x << endl; // output jako string
    return 0;
}`;
    }
    return "";
  }

  return (
    <main className="main-layout">
      <section className="panel left-panel">
        <div className="panel-header">
          <h2>{exerciseTitle || "Kod Programu"}</h2>

          <div className="controls">
            <select
              className="language-select"
              value={language}
              onChange={(e) => {
                const newLanguage = e.target.value;
                setLanguage(newLanguage);
                setCode(exerciseid ? getDefaultCodeExercise(newLanguage) : getDefaultCode(newLanguage));
              }}
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <button
              className="run-button"
              onClick={runCode}
              disabled={loading}
            >
              {loading ? "Uruchamianie..." : "Uruchom"}
            </button>
          </div>
        </div>

        <div className="editor-wrapper">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              scrollbar: {
                alwaysConsumeMouseWheel: false,
                consumeMouseWheelIfScrollbarIsNeeded: false,
                }
            }}
          />
        </div>
      </section>

      <section className="right-column">
        <div className="panel output-panel">
          <div className="panel-header">
            <h2>Wynik Programu</h2>
          </div>
          <pre className="output-area">{displayText}</pre>
        </div>

        <div className="panel error-panel">
          <div className="panel-header">
            <h2>Błędy</h2>
          </div>
          <pre className="error-area">{stderr || ""}</pre>
        </div>
      </section>
    </main>
  );
}