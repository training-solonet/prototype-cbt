import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptData, encryptData } from "../utils/encrypt";

interface CountdownContextType {
  timeLeft: number;
  isRunning: boolean;
  isTimeUp: boolean;
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  clearCountdown: () => void;
  formatTime: (seconds: number) => string;
  totalTimeTaken: number;
  remainingTime: number;
}

const CountdownContext = createContext<CountdownContextType | undefined>(
  undefined
);

export const CountdownProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const time = Date.now() + 60 * 60 * 1000;
  const savedExamEndTime = localStorage.getItem("examEndTime");
  const examEndTime = savedExamEndTime ? parseInt(savedExamEndTime) : time;

  const [timeLeft, setTimeLeft] = useState<number>(examEndTime - Date.now());
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  useEffect(() => {
    if (!savedExamEndTime) {
      localStorage.setItem("examEndTime", examEndTime.toString());
    }
  }, [examEndTime, savedExamEndTime]);

  useEffect(() => {
    const savedData = localStorage.getItem("countdown");

    if (savedData) {
      const decryptedData = decryptData(savedData);
      const parsedData = JSON.parse(decryptedData);

      setTimeLeft(parsedData.timeLeft);
      setIsRunning(parsedData.isRunning);
    }
  }, []);

  useEffect(() => {
    const countdownData = JSON.stringify({ timeLeft, isRunning });
    localStorage.setItem("countdown", encryptData(countdownData));
  }, [timeLeft, isRunning]);

  const startCountdown = () => {
    if (isRunning || timeLeft <= 0) return;
    setIsRunning(true);
    localStorage.removeItem("examEndTime");
    localStorage.removeItem("countdown");
    localStorage.removeItem("answersaved");
  };

  const stopCountdown = () => {
    setIsRunning(false);
  };

  const resetCountdown = () => {
    setIsRunning(false);
    setTimeLeft(examEndTime - Date.now());
    localStorage.removeItem("examEndTime");
    localStorage.removeItem("countdown");
  };

  const clearCountdown = () => {
    const time = Date.now() + 60 * 60 * 1000;
    const newExamEndTime = time;
  
    setTimeLeft(newExamEndTime - Date.now());
    setIsRunning(false);
    localStorage.setItem("countdown", encryptData(JSON.stringify({ timeLeft: newExamEndTime - Date.now(), isRunning: false })));
  };

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          setIsRunning(false);
          setIsTimeUp(true);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const remainingTime = Math.floor(examEndTime - Date.now());
  const totalTimeTaken = Math.floor(time - examEndTime);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <CountdownContext.Provider
      value={{
        timeLeft,
        isRunning,
        isTimeUp,
        startCountdown,
        stopCountdown,
        resetCountdown,
        clearCountdown,
        formatTime,
        totalTimeTaken,
        remainingTime,
      }}
    >
      {children}
    </CountdownContext.Provider>
  );
};

export const useCountdown = () => {
  const context = useContext(CountdownContext);
  if (!context) {
    throw new Error("useCountdown must be used within a CountdownProvider");
  }
  return context;
};
