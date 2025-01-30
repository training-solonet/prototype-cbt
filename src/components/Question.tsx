import { useNavigate } from "react-router-dom";
import { useCountdown } from "../context/CountdownContext";
import parse from "html-react-parser";

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
  question: QuestionType;
  examQuestions: QuestionType[];
}

export default function Question({
  currentId,
  handleNavigation,
  question,
  examQuestions,
}: QuestionProps) {
  const navigate = useNavigate();
  const { stopCountdown, totalTimeTaken, formatTime } = useCountdown();

  const navigateToComplete = () => {
    stopCountdown();
    navigate(`/completed?time=${formatTime(totalTimeTaken)}`);
  };

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
                alt="Soal Gambar"
                className="w-48 h-48 object-cover rounded-lg shadow"
              />
            ) : (
              <audio controls className="w-[40%]">
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
                <button className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}

        {question.type === "essay" && (
          <textarea
            placeholder="Tulis jawaban Anda di sini..."
            className="w-full p-3 text-xs border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          ></textarea>
        )}
      </div>

      <div className="flex justify-end gap-1.5 mt-6 w-full">
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
            currentId === examQuestions.length ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {currentId === examQuestions.length ? "Selesai" : "Selanjutnya"}
        </button>
      </div>
    </>
  );
}
