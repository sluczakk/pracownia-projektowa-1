const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn, execSync } = require("child_process");
const crypto = require("crypto");

const exercises = require("./exercises");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50kb" }));

const SECRET_KEY = "sekretnyklucz";

app.use(express.static(path.join(__dirname, "public")));

// baza danych sqlite3

const dbPath = process.env.DATABASE_PATH || "/home/data/database_testerumiejetnosciprogramowania.sqlite";

// do dockera
function getTempPath() {
  const isInDocker = fs.existsSync("/.dockerenv");
  
  if (isInDocker) {
    const containerId = execSync("hostname").toString().trim();
    const inspect = JSON.parse(execSync(`docker inspect ${containerId}`).toString());
    const mounts = inspect[0].Mounts;
    const match = mounts.find(m => "/app/temp".startsWith(m.Destination));
    return {
      containerTemp: "/app/temp",
      hostTemp: "/app/temp".replace(match.Destination, match.Source)
    };
  } else {
    const localTemp = path.join(__dirname, "temp");
    return {
      containerTemp: localTemp,
      hostTemp: localTemp
    };
  }
}

const { containerTemp, hostTemp } = getTempPath();

console.log("resolved =", path.resolve(dbPath));

fs.mkdirSync("/home/data", { recursive: true });

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("DB error:", err.message);
  } else {
    console.log("Connected to SQLite DB");
  }
});

// tworzymy tabele z uzytkownikami
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS solved_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      exercise_id TEXT NOT NULL,
      language TEXT NOT NULL,
      solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      UNIQUE(user_id, exercise_id, language),

      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

db.run("PRAGMA foreign_keys = ON");

// ======== konta uzytkownikow ========

// rejestracja
app.post("/auth/register", async (req, res) => {
  const { email, password, repeatedpassword } = req.body;

  if (password !== repeatedpassword) {
    return res.status(400).json({ message: "Hasła nie pasują" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ message: "Email już istnieje" });
      }

      const user = {
        id: this.lastID,
        email,
      };

      const token = jwt.sign(user, SECRET_KEY, { expiresIn: "7d" });

      res.json({ token, user });
    }
  );
});

// logowanie
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user) {
      return res.status(401).json({ message: "Nie istnieje konto z podanym emailem" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Złe hasło" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  });
});

// weryfikacja tokena
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Brak tokenu" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Nieprawidłowy token" });
  }
}

function getUser(req)
{
  const authHeader = req.headers.authorization;

  if (!authHeader){
    return null
  }
  else {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return decoded;
    } catch {
      console.log("Nieprawidlowy token")
      return null
    }
  }
}

app.get("/auth/verifytoken", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


// ======== odpalanie kodu ========

const MAX_STDOUT = 5000;

const memorylimit = "64m";
const cpuslimit = "0.5";
const securityopt = "no-new-privileges";
const pidslimit = "64";

function cleanupJobDir(jobDir) {
  setTimeout(() => {
    fs.rm(jobDir, { recursive: true, force: true }, () => {});
  }, 200);
}

app.post("/run", (req, res) => {
  const code = req.body?.code; // Przesłany kod
  const language = req.body?.language; // Wybrany język
  const exerciseid = req.body?.exerciseid; // wybrane zadanie; jezeli puste, to brak

  let exercise = exercises[exerciseid];

  let stdout = " "; // Zwracane wartości
  let stderr = " "; // Zwracane błędy
  let returncode = 0;
  let finished = false;

  const finish = (payload) => {
      if (!finished) {
        finished = true;
        //console.log("kod2: " + JSON.stringify(payload));
        res.json(payload);
      }
    };

  //console.log("kod1: " + code);

  if (language == "python" || language == "java" || language == "cpp") {
    const jobId = crypto.randomUUID();
    const jobDir = path.join(containerTemp, jobId);  // write files
    const hostJobDir = path.join(hostTemp, jobId);            // mount arg

    //console.log(jobDir);
    //console.log(hostJobDir);

    fs.mkdirSync(jobDir, { recursive: true });

    if (language == "python")
      fs.writeFileSync(path.join(jobDir, "main.py"), code);
    else if (language == "java")
      fs.writeFileSync(path.join(jobDir, "Main.java"), code);
    else if (language == "cpp")
      fs.writeFileSync(path.join(jobDir, "main.cpp"), code);

    const mountArg = `${hostJobDir.replace(/\\/g, "/")}:/app`;
    const containerName = `job-${jobId}`;

    // uruchamiamy kontener z danym srodowiskiem
    var code_process;
    if (language == "python") {
      code_process = spawn("docker", [
        "run",
        "--rm",
        "--name", containerName,

        "--network", "none",             // brak internetu
        "--memory", memorylimit,         // limit RAM
        "--cpus", cpuslimit,             // limit CPU

        "--security-opt", securityopt,
        "--pids-limit", pidslimit,
        //"--read-only",

        "-i", // bedziemy wpisywac input

        "-v", mountArg,                  

        "runcode-python"                 // nazwa image dockera
      ]);
    }
    else if (language == "java") {
      code_process = spawn("docker", [
        "run",
        "--rm",
        "--name", containerName,

        "--network", "none",             // brak internetu
        "--memory", "256m",              // limit RAM
        "--cpus", cpuslimit,             // limit CPU

        "--security-opt", securityopt,
        "--pids-limit", pidslimit,
        //"--read-only",

        "-i", // bedziemy wpisywac input

        "-v", mountArg,                  

        "runcode-java"                   // nazwa image dockera
      ]);
    }
    else if (language == "cpp") {
      code_process = spawn("docker", [
        "run",
        "--rm",
        "--name", containerName,

        "--network", "none",             // brak internetu
        "--memory", "256m",              // limit RAM
        "--cpus", cpuslimit,             // limit CPU

        "--security-opt", securityopt,
        "--pids-limit", pidslimit,
        //"--read-only",

        "-i", // bedziemy wpisywac input

        "-v", mountArg,                  // folder z plikiem, z którego czytamy

        "runcode-cpp"                   // nazwa image dockera
      ]);
    }

    // wpisujemy do programu wygenerowane dane wejsciowe do zadania
    let exercise_input = "";
    let exercise_output = "";
    
    if (exercise) {
      let exercise_io = exercise.generateInputOutput();
      exercise_input = (exercise_io.args);
      exercise_output = exercise_io.expected;
      code_process.stdin.write(exercise_input);
      code_process.stdin.end();
      //console.log("Input:", JSON.stringify(exercise_input));
    }

    // ustawiamy timeout
    const timeout = setTimeout(() => {
      spawn("docker", ["kill", containerName]); 
      cleanupJobDir(jobDir);
      finish({
        stdout,
        stderr: "Timeout",
        returncode: -1
      });
    }, 6000); // 6 sekund

    // co program wypisuje do konsoli
    code_process.stdout.on("data", (data) => {
      //console.log("RAW STDOUT:", JSON.stringify(data.toString()));
      stdout += data.toString();

      // zbyt duzy stdout
      if (stdout.length > MAX_STDOUT) {
        cleanupJobDir(jobDir);
        spawn("docker", ["kill", containerName]);
        finish({
          stdout: " ",
          stderr: "stdout too long",
          returncode: -1
        });
      }
    });

    stdout = ""

    // bledy wypisywane przez program
    code_process.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // blad z uruchomieniem
    code_process.on("error", (err) => {
      cleanupJobDir(jobDir);
      finish({
        stdout: "",
        stderr: `Failed to start Docker: ${err.message}`,
        returncode: -1
      });
    });

    // zamkniecie procesu -> zwracamy wynik do uzytkownika
    code_process.on("close", (exitCode) => {
      // porownujemy stdout z tym co powinno wyjsc w zadaniu
      if (exercise) {
        solved = (stdout.trim() === exercise_output.trim());

        const tokenuser = getUser(req)
        if (tokenuser) {
          if (solved) {
            //console.log("Uzytkownik " + tokenuser.id + " poprawnie rozwiazal zadanie <" + exerciseid + "> w jezyku " + language)
            db.run(
              `
              INSERT OR IGNORE INTO solved_exercises (user_id, exercise_id, language)
              VALUES (?, ?, ?)
            `,
              [tokenuser.id, exerciseid, language]
            );
          }
        }
        
        if (solved) {
          //console.log("Udalo sie! user: ");
        }
        else {
          //console.log("Nie udalo sie.");
        }
      }

      cleanupJobDir(jobDir); 
      if (exerciseid) {
        finish({ stdout, stderr, exitCode, exercise_input, exercise_output });
      }
      else {
        finish({ stdout, stderr, exitCode });
      }
      return;
    });
  }
  else {
    finish({stdout, stderr, returncode: -1});
  }
  return;
})

/* ======== cwiczenia ======== */

// lista cwiczen
app.get("/exercises", (req, res) => {
  const list = Object.values(exercises).map((ex) => ({
    id: ex.id,
    title: ex.title,
    difficulty: ex.difficulty,
    description: ex.description
  }));

  res.json(list);
});

// pojedyncze zadanie
app.get("/exercises/:id", (req, res) => {
  const exercise = exercises[req.params.id];

  if (!exercise) {
    return res.status(404).json({ message: "Zadania nie znaleziono" });
  }

  res.json({
    id: exercise.id,
    title: exercise.title,
    difficulty: exercise.difficulty,
    description: exercise.description,
    description: exercise.longdescription
  });
});

// zadania rozwiazane przez uzytkownika
app.get("/solved-exercises", authMiddleware, (req, res) => {
  db.all(
    `
    SELECT exercise_id, language, solved_at
    FROM solved_exercises
    WHERE user_id = ?
    `,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json(rows);
    }
  );
});

// jezyki pojedynczego rozwiazanego zadania
app.get("/solved-exercises/:exerciseId", authMiddleware, (req, res) => {
  const { exerciseId } = req.params;

  db.all(
    `
    SELECT language, solved_at
    FROM solved_exercises
    WHERE user_id = ? AND exercise_id = ?
    `,
    [req.user.id, exerciseId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      //console.log(rows);
      res.json(rows);
    }
  );
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});