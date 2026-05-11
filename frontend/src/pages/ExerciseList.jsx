import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchExercises, fetchSolvedExercises } from "../api/exercises";

import ExerciseHeader from "../components/ExerciseStuff";

export default function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [solvedMap, setSolvedMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");

        const [exercisesData, solvedData] = await Promise.all([
          fetchExercises(),
          token ? fetchSolvedExercises(token) : Promise.resolve([])
        ]);

        setExercises(exercisesData);

        const grouped = {};
        for (const item of solvedData) {
          if (!grouped[item.exercise_id]) {
            grouped[item.exercise_id] = [];
          }
          grouped[item.exercise_id].push(item.language);
        }

        setSolvedMap(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="exercise-page">Ladowanie zadan...</div>;
  }

  if (error) {
    return <div className="exercise-page">Error: {error}</div>;
  }

  return (
    <div className="exercise-page">
      <div className="exercise-page-header">
        <h1>Zadania</h1>
      </div>

      <div className="exercise-list">
        {exercises.map((exercise) => {
          const solvedLanguages = solvedMap[exercise.id] || [];
          const isSolved = solvedLanguages.length > 0;

          return (
            <button
              key={exercise.id}
              className="exercise-card"
              onClick={() => navigate(`/exercises/${exercise.id}`)}
            >
              <ExerciseHeader
                title={exercise.title}
                difficulty={exercise.difficulty}
                solvedLanguages={solvedLanguages}
              />

              <p className="exercise-description">{exercise.description}</p>

            </button>
          );
        })}
      </div>
    </div>
  );
}