import { useNavigate } from "react-router-dom";
import { useCountdown } from "../context/CountdownContext";
import Swal from "sweetalert2";

export default function HomePage() {
  const navigate = useNavigate();

  const { startCountdown } = useCountdown();

  // const handleNavigation = () => {
  //   if (navigator.onLine) {
  //     Swal.fire("Peringatan!", "Anda sedang online! Kamu hanya bisa mengerjakan ujian saat offline.", "warning");
  //   } else {
  //     startCountdown();
  //     navigate("/test/1");
  //   }
  // };

  const handleNavigation = () => {
    startCountdown();
    navigate("/test/1");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-[90%] text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Ujian Online</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Selamat datang! Klik tombol di bawah untuk memulai ujian Anda.
        </p>
        <div
          onClick={handleNavigation}
          className="text-xs font-semibold cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300"
        >
          Mulai Ujian
        </div>
      </div>
    </div>
  );
}
