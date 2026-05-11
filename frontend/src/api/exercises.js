import API_BASE_URL from "../config";

// pobieranie listy wszystkich zadan
export async function fetchExercises() {
  const res = await fetch(`${API_BASE_URL}/exercises`);

  if (!res.ok) {
    throw new Error("Nie udalo sie pobrac zadan");
  }

  return res.json();
}

// pobieranie informacji o poszczegolnym zadaniu
export async function fetchExerciseById(id) {
  const res = await fetch(`${API_BASE_URL}/exercises/${id}`);

  if (!res.ok) {
    throw new Error("Nie udalo sie pobrac zadania");
  }

  return res.json();
}

// pobieranie rozwiazanych zadan
export async function fetchSolvedExercises(token) {
  const res = await fetch(`${API_BASE_URL}/solved-exercises`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Nie udalo sie pobrac rozwiazanych zadan");
  }

  return res.json();
}

// jezyki rozwiazanego zadania
export async function fetchSolvedLanguagesForExercise(exerciseId, token) {
  const res = await fetch(`${API_BASE_URL}/solved-exercises/${exerciseId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Nie udalo sie pobrac rozwiazanych jezykow");
  }

  return res.json();
}