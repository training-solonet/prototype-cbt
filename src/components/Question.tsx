import { useNavigate } from "react-router-dom";
import { useCountdown } from "../context/CountdownContext";

export interface QuestionType {
  id: number;
  question: string;
  options: string[];
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
        <h2 className="text-sm font-semibold mb-4">
          {`Soal ${question.id}: ${question.question}`}
        </h2>
        <ul className="space-y-3 text-xs">
          {question.options.map((option, index) => (
            <li key={index}>
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
                {option}
              </button>
            </li>
          ))}
        </ul>
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
          className={`bg-blue-500 text-white px-4 py-1.5 text-xs rounded-lg cursor-pointer ${
            currentId === examQuestions.length ? "bg-green-500" : ""
          }`}
        >
          {currentId === examQuestions.length ? "Selesai" : "Selanjutnya"}
        </button>
      </div>
    </>
  );
}
