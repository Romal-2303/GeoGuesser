import React from "react";
import FlagQuiz from "./Components/FlagQuiz/FlagQuiz.tsx";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles["App"]}>
      <FlagQuiz />
    </div>
  );
}

export default App;
