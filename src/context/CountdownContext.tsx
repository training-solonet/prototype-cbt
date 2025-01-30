import React, { createContext, useContext, useState, useEffect } from "react";
import { decryptData, encryptData } from "../utils/encrypt";

interface CountdownContextType {
  timeLeft: number;
  isRunning: boolean;
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  formatTime: (seconds: number) => string;
  totalTimeTaken: number;
}

const CountdownContext = createContext<CountdownContextType | undefined>(
  undefined
);

export const CountdownProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const time = 100;

  const [timeLeft, setTimeLeft] = useState<number>(time);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    const savedTime = localStorage.getItem("timeLeft");
    const savedStatus = localStorage.getItem("isRunning");

    if (savedTime) {
      const decryptedTime = decryptData(savedTime);
      setTimeLeft(Number(decryptedTime));
    }

    if (savedStatus === "true") {
      const decryptedStatus = decryptData(savedStatus);
      setIsRunning(Boolean(decryptedStatus));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timeLeft", encryptData(String(timeLeft)));
    localStorage.setItem("isRunning", encryptData(String(isRunning)));
  }, [timeLeft, isRunning]);

  const startCountdown = () => {
    if (isRunning || timeLeft === 0) return;
    setIsRunning(true);
  };

  const stopCountdown = () => {
    setIsRunning(false);
  };

  const resetCountdown = () => {
    setIsRunning(false);
    setTimeLeft(time);
  };

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const totalTimeTaken = time - timeLeft;

  const formatTime = (seconds: number) => {
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
        startCountdown,
        stopCountdown,
        resetCountdown,
        formatTime,
        totalTimeTaken,
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
