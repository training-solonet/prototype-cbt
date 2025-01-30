import { useParams, useNavigate } from "react-router-dom";
import examQuestions from "../utils/examQuestions";
import QuestionNavigation from "../components/QuestionNavigation";
import Question from "../components/Question";
import useVisibility from "../hooks/useVisibility";
import useConnection from "../hooks/useConnection";
import { useCountdown } from "../context/CountdownContext";
import { useEffect } from "react";
import disableTextActions from "../utils/disableTextAction";
import detectSplitScreen from "../utils/detectSplitScreen";
// import detectDevTools from "../utils/detectDevTools";

export default function TestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentId = parseInt(id || "0", 10);
  
  const { formatTime, timeLeft, stopCountdown, totalTimeTaken } = useCountdown();
  
  const question = examQuestions.find((q) => q.id === currentId);
  
  // detectDevTools();
  disableTextActions();
  detectSplitScreen();

  useVisibility({
    onVisibilityHidden: () => {
      stopCountdown();
      navigate(
        `/completed?message=Anda terdeteksi kecurangan! Anda telah berpindah ke tab/keluar dari ujian. Ujian otomatis selesai.&time=${formatTime(totalTimeTaken)}`
      );
    },
    alertOnVisibilityHidden: false,
    navigateToOnVisibilityHidden:
      `/completed?message=Anda terdeteksi kecurangan! Anda telah berpindah ke tab/keluar dari ujian. Ujian otomatis selesai.&time=${formatTime(totalTimeTaken)}`,
  });

  useConnection({
    onOnline: () => {
      stopCountdown();
      navigate(
        `/completed?message=Anda terdeteksi kecurangan! Anda sedang online! Ujian otomatis selesai.&time=${formatTime(totalTimeTaken)}`
      );
    }, 
    alertOnOnline: false,
    navigateToOnOnline:
      `/completed?message=Anda terdeteksi kecurangan! Anda sedang online! Ujian otomatis selesai.&time=${formatTime(totalTimeTaken)}`,
  });

  useEffect(() => {
    if (timeLeft === 0) {
      stopCountdown();
      navigate(
        `/completed?message=Waktu ujian Anda telah habis. Ujian otomatis selesai.&time=${formatTime(totalTimeTaken)}`
      );
    }
  }, [timeLeft, navigate, stopCountdown]);

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

  return (
    <div className="py-6 flex flex-col items-center bg-gray-200 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-[90%] w-full mb-6">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Ujian Online</p>
          <p className="text-sm font-medium text-red-600">
            {formatTime(timeLeft)}
          </p>
        </div>
        <hr className="my-4 opacity-15" />
        <Question
          currentId={currentId}
          handleNavigation={(newId: number) =>
            navigate(newId >= 1 && newId <= examQuestions.length ? `/test/${newId}` : "/test/1")
          }
          question={question}
          examQuestions={examQuestions}
        />
      </div>

      <QuestionNavigation
        currentId={currentId}
        handleNavigation={(newId: number) =>
          navigate(newId >= 1 && newId <= examQuestions.length ? `/test/${newId}` : "/test/1")
        }
        examQuestions={examQuestions}
      />
    </div>
  );
}
