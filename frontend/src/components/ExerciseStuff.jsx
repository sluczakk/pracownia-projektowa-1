import {
  difficultyLabels,
  languageIcons,
} from "../constants/exerciseconstants";

function ExerciseLanguageIcons({ solvedLanguages }) {
  return (
    <div className="language-icons">
      {Object.entries(languageIcons).map(([lang, icon]) => (
        <img
          key={lang}
          src={icon}
          alt={lang}
          className={`language-icon ${solvedLanguages.includes(lang) ? "solved" : "unsolved"}`}
        />
      ))}
    </div>
  );
}

export default function ExerciseHeader({ title, difficulty, solvedLanguages }) {
  return (
    <div className="exercise-card-top">
      <div className="title-with-icons">
        <h1 className="exercise-details-title">{title}</h1>
        <ExerciseLanguageIcons solvedLanguages={solvedLanguages} />
      </div>

      <span className={`difficulty-badge difficulty-${difficulty}`}>
        {difficultyLabels[difficulty]}
      </span>
    </div>
  );
}