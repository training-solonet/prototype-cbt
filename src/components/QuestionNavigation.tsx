import { QuestionType } from "./Question";

interface QuestionNavigationProps {
  currentId: number;
  handleNavigation: (newId: number) => void;
  examQuestions: QuestionType[];
  savedAnswers: { id: number; answer: string | null }[];
}

export default function QuestionNavigation({
  currentId,
  handleNavigation,
  examQuestions,
  savedAnswers,
}: QuestionNavigationProps) {
  return (
    <div className="flex flex-col min-w-[90%] max-w-[90%] bg-white shadow-lg rounded-lg p-8 w-full">
      <h3 className="text-sm font-semibold mb-4">Navigasi Soal</h3>
      <div className="grid grid-cols-5 gap-3 text-xs mb-8">
        {examQuestions.map((q) => {
          const answer = savedAnswers.find((ans) => ans.id === q.id)?.answer;
          return (
            <button
              key={q.id}
              onClick={() => handleNavigation(q.id)}
              className={`px-3 py-2 text-center rounded-lg cursor-pointer ${
                q.id === currentId
                  ? "bg-gray-400 text-white"
                  : answer
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {q.id}
            </button>
          );
        })}
      </div>
      <div className="text-xs flex gap-x-4 gap-y-2 items-center flex-wrap w-full">
        <div className="flex gap-x-2 items-center">
          <div className="w-12 h-4 bg-gray-400 rounded-sm" />
          <p className="font-medium">Soal sekarang</p>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="w-12 h-4 bg-blue-500 rounded-sm" />
          <p className="font-medium">Soal dikerjakan</p>
        </div>
        <div className="flex gap-x-2 items-center">
          <div className="w-12 h-4 bg-gray-200 rounded-sm" />
          <p className="font-medium">Soal belum dikerjakan</p>
        </div>
      </div>
    </div>
  );
}
