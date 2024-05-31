import React, { useEffect, useState } from "react";
import countriesData from "../../utils/data/countries.json";
import styles from "./FlagQuiz.module.scss";
import Timer from "../Timer/TimerComponent.tsx";
import { MessageGenerator } from "../../utils/helpers/MessageGenerator.tsx";

type countryObj = {
  name?: string;
  img?: string;
  latlng?: number[];
  shortName?: string;
};

const FlagQuiz = () => {
  const [startQuiz, setStartQuiz] = useState(false);
  const [quesCountry, setQuesCountry] = useState<countryObj>({});
  const [optionsArr, setOptionsArr] = useState<countryObj[]>([]);
  const [scoreDetails, setScoreDetails] = useState({});
  const [scoreCount, setScoreCount] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [result, setResult] = useState("");
  const [selectedOption, setSelectedOption] = useState<countryObj>({});
  const [disableDiv, setDisableDiv] = useState(false);
  const [quizFinish, setQuizFinish] = useState(false);
  const [quesArr, setQuesArr] = useState<countryObj[]>([]);
  let customTimer;

  // Function to get an array of three random elements from the input array
  function getRandomElements(array, numberOfElements) {
    // Make a copy of the original array to avoid modifying it
    const shuffledArray = array.slice();

    // Shuffle the array using the Fisher-Yates algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }

    // Return the first numberOfElements elements from the shuffled array
    return shuffledArray.slice(0, numberOfElements);
  }

  useEffect(() => {
    const recursiveFunc = (attempt = 0) => {
      if (attempt >= maxAttempts) {
        // Add a base case to stop recursion after a certain number of attempts
        return null;
      }
      let randomCountries = getRandomElements(countriesData, 4);
      let randomIndex = Math.floor(Math.random() * 3);
      console.log(quesArr);
      quesArr.forEach((ques) => {
        if (ques.name === randomCountries[randomIndex].name) {
          recursiveFunc(attempt + 1);
        }
      });

      return [randomCountries[randomIndex], randomCountries];
    };
    const maxAttempts = 10; // Set a maximum number of attempts
    let result = recursiveFunc();

    while (!result) {
      // Retry until a valid result is obtained or maxAttempts is reached
      result = recursiveFunc();
    }
    let [ques, options] = result;
    setQuesArr((prevState) => [...prevState, ques]);
    setQuesCountry(ques);
    setOptionsArr(options);
  }, [answered]);

  useEffect(() => {
    return () => clearTimeout(customTimer);
  }, []);

  const optionClickHandler = (option: countryObj) => () => {
    clearTimeout(customTimer);
    setDisableDiv(true);
    setSelectedOption(option);
    setScoreDetails({ optionSelected: option, askedQues: quesCountry });
    if (option.name === quesCountry.name) {
      setScoreCount((prevState) => prevState + 5);
      setResult("Correct");
    } else {
      setResult("Wrong");
    }
    customTimer = setTimeout(() => {
      setResult("");
      if (answered + 1 < 20) {
        setAnswered((prevState) => prevState + 1);
      } else {
        setQuizFinish(true);
      }
      setDisableDiv(false);
    }, 1000);
  };

  const playAgainClickHandler = () => {
    setQuesCountry({});
    setOptionsArr([]);
    setScoreCount(0);
    setAnswered(0);
    setResult("");
    setSelectedOption({});
    setDisableDiv(false);
    setQuizFinish(false);
  };

  return (
    <div className={styles["flag-quiz-container"]}>
      {!startQuiz && (
        <div className={styles["start-quiz-container"]}>
          <b>Guess the Country Quiz</b>
          <button
            className={styles["sq-btn"]}
            onClick={() => {
              setStartQuiz(true);
            }}
          >
            Start Quiz
          </button>
        </div>
      )}
      {!quizFinish && startQuiz && (
        <>
          <div className={styles["fg-header-container"]}>
            <div className={styles["fg-header"]}>Guess the Country</div>
            <div className={styles["fg-header-options"]}>
              <div className={styles["questions-details"]}>
                {answered + 1} of 20
              </div>
              <div className={styles["score"]}>Score: {scoreCount}</div>
            </div>
          </div>
          <div className={styles["partitioner"]}></div>
          <div className={styles["fq-display-container"]}>
            <div className={styles["timer"]}>
              {!disableDiv && (
                <Timer
                  seconds={20}
                  render={answered}
                  timerCompleteHandler={(e) => {
                    if (answered + 1 < 20) {
                      setAnswered((prevState) => prevState + 1);
                    } else {
                      setQuizFinish(true);
                    }
                  }}
                />
              )}
            </div>
            <img
              src={quesCountry.img}
              className={styles["country-img"]}
              alt="country image"
            />
          </div>
          <div className={styles["fq-options-container"]}>
            {optionsArr.map((option, index: number) => (
              <div
                key={index}
                className={`${styles[`fg-option-${index}`]} ${
                  styles["option"]
                } ${disableDiv && `${styles["disable-div"]}`}`}
                onClick={optionClickHandler(option)}
                style={
                  selectedOption.name === option.name
                    ? result === "Correct"
                      ? { backgroundColor: "#22bb33" }
                      : result === "Wrong"
                      ? { backgroundColor: "#bb2124" }
                      : {}
                    : result === "Wrong" && quesCountry.name === option.name
                    ? { backgroundColor: "#22bb33" }
                    : {}
                }
              >
                {option.name}
              </div>
            ))}
          </div>
        </>
      )}
      {quizFinish && (
        <div className={styles["finish-screen"]}>
          <div className={styles["final-score"]}>
            You Scored {scoreCount} Points!
          </div>
          <div className={styles["partitioner"]}></div>
          <div className={styles["final-message"]}>
            {MessageGenerator(scoreCount)}
          </div>
          <button
            className={styles["play-again-btn"]}
            onClick={playAgainClickHandler}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default FlagQuiz;
