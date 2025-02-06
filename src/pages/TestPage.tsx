import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert
import examQuestions from "../utils/examQuestions";
import QuestionNavigation from "../components/QuestionNavigation";
import Question, { QuestionType } from "../components/Question";
import useVisibility from "../hooks/useVisibility";
import { useCountdown } from "../context/CountdownContext";

export default function TestPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState<{ id: number; answer: string | null }[]>([]);
  const [isOnline, setIsOnline] = useState(false); // Mulai dengan anggapan tidak ada internet
  const [isExamPaused, setIsExamPaused] = useState(false);

  const { formatTime, timeLeft, totalTimeTaken } = useCountdown();
  const question = examQuestions[currentIndex];

  useEffect(() => {
    const savedIndex = localStorage.getItem("examIndex");
    if (savedIndex) {
      setCurrentIndex(Number(savedIndex));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("examIndex", currentIndex.toString());
  }, [currentIndex]);

  useVisibility({
    alertOnVisibilityHidden: true,
  });

  useEffect(() => {
    if (timeLeft === 0) {
      navigate(
        `/completed?message=Waktu ujian Anda telah habis. Ujian otomatis selesai.&time=${formatTime(
          totalTimeTaken
        )}`
      );
    }
  }, [timeLeft, navigate]);

  useEffect(() => {
    const savedAnswersFromStorage = localStorage.getItem("answersaved");
    if (savedAnswersFromStorage) {
      try {
        const parsedAnswers = JSON.parse(savedAnswersFromStorage);
        if (Array.isArray(parsedAnswers)) {
          setSavedAnswers(parsedAnswers);
        } else {
          setSavedAnswers([]);
        }
      } catch (e) {
        console.error("Error parsing saved answers from localStorage", e);
        setSavedAnswers([]);
      }
    }
  }, []);

  useEffect(() => {
    if (savedAnswers.length > 0) {
      localStorage.setItem("answersaved", JSON.stringify(savedAnswers));
    }
  }, [savedAnswers]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    if (isExamPaused) return; // Cegah perubahan jawaban jika ujian dihentikan
    const updatedAnswers = savedAnswers.map((item) =>
      item.id === questionId ? { ...item, answer } : item
    );
    if (!savedAnswers.some((item) => item.id === questionId)) {
      updatedAnswers.push({ id: questionId, answer });
    }
    setSavedAnswers(updatedAnswers);
  };

  // --- CEK INTERNET DENGAN PING GOOGLE ---
  const checkInternetConnection = async () => {
    try {
      const response = await fetch("https://www.google.com", { mode: "no-cors" });
      setIsOnline(true);
      setIsExamPaused(true);

      Swal.fire({
        icon: "warning",
        title: "Ujian Dihentikan!",
        text: "Ujian dihentikan karena perangkat Anda terkoneksi ke internet. Matikan koneksi internet untuk melanjutkan ujian.",
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
    } catch (error) {
      setIsOnline(false);
      setIsExamPaused(false);

      Swal.fire({
        icon: "success",
        title: "Ujian Dilanjutkan!",
        text: "Anda tidak memiliki akses internet. Ujian dapat dilanjutkan.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  useEffect(() => {
    // Cek status internet saat pertama kali halaman dimuat
    checkInternetConnection();

    // Tambahkan event listener untuk mendeteksi perubahan status koneksi
    const handleConnectionChange = () => {
      if (navigator.onLine) {
        checkInternetConnection();
      } else {
        setIsOnline(false);
        setIsExamPaused(false);
        Swal.fire({
          icon: "success",
          title: "Ujian Dilanjutkan!",
          text: "Anda tidak memiliki akses internet. Ujian dapat dilanjutkan.",
          confirmButtonColor: "#3085d6",
        });
      }
    };

    window.addEventListener("online", handleConnectionChange);
    window.addEventListener("offline", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleConnectionChange);
      window.removeEventListener("offline", handleConnectionChange);
    };
  }, []);

  if (!question) {
    return (
      <div className="py-12 flex justify-center items-center min-h-screen bg-gray-200">
        <div className="bg-white shadow-lg rounded-lg p-8 min-w-[90%] text-center">
          <p className="text-lg font-semibold text-red-600">
            Soal tidak ditemukan!
          </p>
        </div>
      </div>
    );
  }

  const handleNavigation = (newIndex: number) => {
    if (isExamPaused) return; // Cegah navigasi jika ujian dihentikan
    const questionIndex = examQuestions.findIndex((q) => q.id === newIndex);
    if (questionIndex >= 0 && questionIndex < examQuestions.length) {
      setCurrentIndex(questionIndex);
    }
  };

  return (
    <div className="py-6 flex flex-col items-center bg-gray-200 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-[90%] w-full mb-6">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Ujian Online</p>
          <p className={`text-sm font-medium ${isOnline ? "text-red-600" : "text-green-600"}`}>
            {isOnline ? "Terkoneksi ke Internet (Ujian Dihentikan)" : "Offline (Ujian Berjalan)"}
          </p>
        </div>
        <hr className="my-4 opacity-15" />

        {isExamPaused ? (
          <div className="text-center text-red-600 font-bold">
            <p>Ujian sedang dihentikan. Matikan koneksi internet untuk melanjutkan.</p>
          </div>
        ) : (
          <Question
            currentId={currentIndex + 1}
            handleNavigation={handleNavigation}
            handleAnswerChange={handleAnswerChange}
            question={question as QuestionType}
            examQuestions={examQuestions as QuestionType[]}
            savedAnswers={savedAnswers}
          />
        )}
      </div>

      {!isExamPaused && (
        <QuestionNavigation
          currentId={currentIndex + 1}
          handleNavigation={handleNavigation}
          examQuestions={examQuestions as QuestionType[]}
          savedAnswers={savedAnswers}
        />
      )}
    </div>
  );
}
