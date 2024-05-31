import React, { useEffect, useState } from "react";
import styles from "./Timer.module.scss";

interface Props {
  seconds: number;
  render?: any;
  timerCompleteHandler: (state: boolean) => void;
}

const Timer = ({ seconds = 1, render, timerCompleteHandler }: Props) => {
  const [dimensions, setDimensions] = useState<number>(50);
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    let tempCount = 0;
    let timer = setInterval(() => {
      tempCount = tempCount + 1;
      setCounter(tempCount);
      setDimensions((prevState) => prevState - 1);
      if (tempCount === seconds) {
        timerCompleteHandler?.(true);
        clearInterval(timer);
      }
    }, 1000);
    return () => {
      setCounter(0);
      setDimensions(40);
      clearInterval(timer);
    };
  }, [render]);

  return (
    <div
      className={styles["timer-container"]}
      style={{ height: `${dimensions}px`, width: `${dimensions}px` }}
    >
      {seconds - counter}
    </div>
  );
};

export default Timer;
