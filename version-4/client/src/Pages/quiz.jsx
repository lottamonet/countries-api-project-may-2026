import React, { useEffect, useState } from "react";
import { generateRoundQuestions, generateOptions, getUsableCountries } from "../utils/quizUtils";
import "./quiz.css";

const ROUND_SIZE = 10;
const HIGH_SCORE_KEY = "quizHighScore";

function Quiz({ data }) {
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [roundOver, setRoundOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const poolReady = getUsableCountries(data).length >= ROUND_SIZE;

  // read high score on mount
  useEffect(() => {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    const parsed = stored !== null ? parseInt(stored, 10) : 0;
    setHighScore(Number.isFinite(parsed) ? parsed : 0);
  }, []);

  // write high score whenever it changes
  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
  }, [highScore]);

  function startNewRound() {
    setRoundQuestions(generateRoundQuestions(data, ROUND_SIZE));
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setRoundOver(false);
  }

  // start the first round once enough data has loaded
  useEffect(() => {
    if (poolReady && roundQuestions.length === 0) {
      startNewRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolReady]);

  // regenerate the 4 options whenever the active question changes
  useEffect(() => {
    if (roundQuestions.length === 0) return;
    setOptions(generateOptions(roundQuestions[currentIndex], data, 4));
    setSelectedAnswer(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundQuestions, currentIndex]);

  function handleOptionClick(option) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option.name === roundQuestions[currentIndex].name) {
      setScore((prev) => prev + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 < roundQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setRoundOver(true);
      if (score > highScore) setHighScore(score);
    }
  }

  if (!poolReady || roundQuestions.length === 0) {
    return (
      <div id="quiz">
        <h1 className="quiz-title">Flag Quiz</h1>
        <p className="quiz-loading">Loading countries...</p>
      </div>
    );
  }

  if (roundOver) {
    return (
      <div id="quiz">
        <h1 className="quiz-title">Flag Quiz</h1>
        <div className="quiz-score-screen">
          <p className="quiz-final-score">You scored {score} / {ROUND_SIZE}</p>
          <p className="quiz-high-score">Best: {highScore} / {ROUND_SIZE}</p>
          <button className="quiz-play-again-button" onClick={startNewRound}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = roundQuestions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isLastQuestion = currentIndex + 1 === roundQuestions.length;

  return (
    <div id="quiz">
      <h1 className="quiz-title">Flag Quiz</h1>
      <p className="quiz-subtitle">Guess the country from its flag</p>

      <div className="quiz-header">
        <p className="quiz-progress">{currentIndex + 1} / {ROUND_SIZE}</p>
        <p className="quiz-high-score">Best: {highScore} / {ROUND_SIZE}</p>
      </div>

      <img
        src={currentQuestion.flags?.svg || currentQuestion.flags?.png}
        alt="Guess the country"
        className="quiz-flag"
      />

      <div className="quiz-options">
        {options.map((option) => {
          let className = "quiz-option";
          let cue = null;
          if (isAnswered) {
            if (option.name === currentQuestion.name) {
              className += " correct";
              cue = " ✓ Correct";
            } else if (option.name === selectedAnswer.name) {
              className += " incorrect";
              cue = " ✗ Incorrect";
            }
          }
          return (
            <button
              key={option.name}
              className={className}
              disabled={isAnswered}
              onClick={() => handleOptionClick(option)}
            >
              {option.name}
              {cue}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button className="quiz-next-button" onClick={handleNext}>
          {isLastQuestion ? "See Results" : "Next Question"}
        </button>
      )}
    </div>
  );
}

export default Quiz;
