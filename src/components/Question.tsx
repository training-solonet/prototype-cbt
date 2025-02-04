import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCountdown } from "../context/CountdownContext";
import parse from "html-react-parser";
import Swal from "sweetalert2";

export interface QuestionType {
  id: number;
  type: "multiple-choice" | "essay";
  question: string;
  options?: string[];
  media?: { type: "image" | "audio"; url: string };
  answer: string;
}

interface QuestionProps {
  currentId: number;
  handleNavigation: (newId: number) => void;
  handleAnswerChange: (questionId: number, answer: string) => void;
  question: QuestionType;
  examQuestions: QuestionType[];
  savedAnswers: { id: number; answer: string | null }[];
}

export default function Question({
  currentId,
  handleNavigation,
  handleAnswerChange,
  question,
  examQuestions,
  savedAnswers,
}: QuestionProps) {
  const navigate = useNavigate();
  const { formatTime, remainingTime, isTimeUp, stopCountdown } = useCountdown();
  const [savedAnswer, setSavedAnswer] = useState<string | null>(null);
  const answeredQuestionsCount = savedAnswers.filter(ans => ans.answer !== null && ans.answer !== "").length;

  useEffect(() => {
    const answer = savedAnswers.find((ans) => ans.id === question.id)?.answer;
    setSavedAnswer(answer || null);
  }, [question.id, savedAnswers]);

  useEffect(() => {
    if (isTimeUp) {
      const remainingTimeFormatted = formatTime(remainingTime);
      stopCountdown();
      navigate(`/completed?time=${remainingTimeFormatted}&message=Time's%20up`);
    }
  }, [isTimeUp, remainingTime, formatTime, navigate])

  const handleAnswerChangeLocal = (answer: string) => {
    handleAnswerChange(question.id, answer);
    setSavedAnswer(answer);
  };

  const navigateToComplete = () => {
    const totalQuestions = examQuestions.length;
    const answeredQuestions = savedAnswers.filter((ans) => ans.answer !== null).length;
    const unansweredQuestions = totalQuestions - answeredQuestions;

    if (unansweredQuestions > 0) {
      Swal.fire({
        title: "Peringatan!",
        text: `Anda belum menjawab semua soal! Anda memiliki ${unansweredQuestions} soal yang belum dijawab.`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Ok, lanjutkan",
      })
    } else {
      Swal.fire({
        title: "Peringatan!",
        text: 'Anda yakin ingin selesaikan ujian? Anda tidak dapat mengulanginya.',
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Selesai",
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          stopCountdown();
          navigate(`/completed`);
        }
      });
    }
  }

  return (
    <>
      <div className="mt-6 w-full">
        <h2 className="text-sm mb-4">
          Soal {question.id}: {parse(question.question)}
        </h2>

        {question.media && (
          <div className="mb-4">
            {question.media.type === "image" ? (
              <img
                src={question.media.url}
                alt={question.question}
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            ) : (
              <audio controls className="w-[80%]">
                <source src={question.media.url} type="audio/mpeg" />
                Browser Anda tidak mendukung pemutar audio.
              </audio>
            )}
          </div>
        )}

        {question.type === "multiple-choice" && (
          <ul className="space-y-3 text-xs">
            {question.options?.map((option, index) => (
              <li key={index}>
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    savedAnswer === option
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-black"
                  }`}
                  onClick={() => handleAnswerChangeLocal(option)}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}

        {question.type === "essay" && (
          <textarea
            value={savedAnswer || ""}
            onChange={(e) => handleAnswerChangeLocal(e.target.value)}
            placeholder="Tulis jawaban Anda di sini..."
            className="w-full p-3 text-xs border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
        )}
      </div>

      <div className="flex justify-between mt-6 items-center w-full">
        <p className="text-xs">{answeredQuestionsCount} dari {examQuestions.length} soal dijawab</p>
        <div className="flex gap-x-2">
          <button
            onClick={() => handleNavigation(currentId - 1)}
            className={`bg-blue-500 text-white px-4 py-1.5 text-xs rounded-lg ${
              currentId === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={currentId === 1}
          >
            Kembali
          </button>
          <button
            onClick={
              currentId === examQuestions.length
                ? navigateToComplete
                : () => handleNavigation(currentId + 1)
            }
            className={`px-4 py-1.5 text-xs text-white rounded-lg cursor-pointer ${
              currentId === examQuestions.length ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {currentId === examQuestions.length ? "Akhiri ujian" : "Selanjutnya"}
          </button>
        </div>
      </div>
    </>
  );
}
