import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchExerciseById, fetchSolvedLanguagesForExercise } from "../api/exercises";

import {
  languageLabels
} from "../constants/exerciseconstants";

import CodeRunner from "../components/CodeRunner";
import ExerciseHeader from "../components/ExerciseStuff";

export default function ExerciseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [solvedLanguages, setSolvedLanguages] = useState([]);

  useEffect(() => {
    async function loadExercise() {
      try {
        const data = await fetchExerciseById(id);
        setExercise(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    async function loadSolvedLanguages() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
				console.log("loading " + id);
        const data = await fetchSolvedLanguagesForExercise(id, token);
        setSolvedLanguages(data.map((item) => item.language));
      } catch (err) {
        console.error(err);
      }
    }

    loadExercise();
    loadSolvedLanguages();
  }, [id]);

  if (loading) {
    return <div className="exercise-page">Ładowanie zadania...</div>;
  }

  if (error) {
    return <div className="exercise-page">Error: {error}</div>;
  }

  if (!exercise) {
    return <div className="exercise-page">Zadania nie znaleziono</div>;
  }

  return (
    <div className="exercise-page">
      <button className="back-button" onClick={() => navigate("/exercises")}>
        ← Powrót
      </button>

      <div className="exercise-details-card">
        <ExerciseHeader
					title={exercise.title}
					difficulty={exercise.difficulty}
					solvedLanguages={solvedLanguages}
				/>

				{solvedLanguages.length > 0 && (
        <p className="exercise-solved-languages">
            Zadanie rozwiązano w językach: {solvedLanguages.map(lang => languageLabels[lang] || lang).join(", ")}
        </p>
        )}

        <div className="exercise-full-description">
          {exercise.description}
        </div>
      </div>

      <CodeRunner
        exerciseid={exercise.id}
        exerciseTitle={exercise.title}
				solvedLanguages={solvedLanguages}
  			setSolvedLanguages={setSolvedLanguages}
      />
    </div>
  );
}