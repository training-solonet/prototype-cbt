import { useLocation, useNavigate } from "react-router-dom";
import { useCountdown } from "../context/CountdownContext";
import examQuestions from "../utils/examQuestions";

export default function ExamCompletedPage() {
  const nav = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get("message");

  const { clearCountdown, remainingTime, formatTime, totalTimeTaken } =
    useCountdown();

  const savedAnswers = JSON.parse(localStorage.getItem("answersaved") || "[]");
  const answeredQuestionsCount = savedAnswers.filter(
    (ans: { id: number; answer: string | null }) =>
      ans.answer !== null && ans.answer !== ""
  ).length;

  const unansweredQuestions = examQuestions.length - answeredQuestionsCount;

  const handleNav = () => {
    clearCountdown();
    nav("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200">
      {message && (
        <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-4 max-w-[90%] w-full">
          <h2 className="font-semibold text-lg text-center">Peringatan!</h2>
          <p className="text-center text-sm">{message}</p>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 text-sm font-medium w-full max-w-[90%] mx-auto">
        <p className="flex justify-between">
          <span>Total Soal:</span>
          <span className="font-semibold">{examQuestions.length}</span>
        </p>
        <p className="flex justify-between">
          <span>Soal Terjawab:</span>
          <span className="font-semibold">{answeredQuestionsCount}</span>
        </p>
        <p className="flex justify-between">
          <span>Soal Belum Terjawab:</span>
          <span className="font-semibold">{unansweredQuestions}</span>
        </p>
        <p className="flex justify-between">
          <span>Sisa Waktu:</span>
          <span className="font-semibold">{formatTime(remainingTime)}</span>
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-[90%] w-full text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Ujian Selesai!</h1>

        <div className="text-center mb-4 text-sm font-medium w-1/2 mx-auto">
          <p>
            Anda telah menghabiskan waktu sebanyak {formatTime(totalTimeTaken)}{" "}
            dalam ujian ini!
          </p>
        </div>

        <p className="text-gray-600 text-sm">
          {message ? "" : "Terima kasih telah mengerjakan ujian ini."}
        </p>

        <p className="text-gray-600 mb-6 text-sm">
          Silahkan klik tombol di bawah untuk kembali ke beranda.
        </p>
        <div
          onClick={handleNav}
          className="text-xs cursor-pointer font-semibold bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300"
        >
          Kembali ke Beranda
        </div>
      </div>
    </div>
  );
}
