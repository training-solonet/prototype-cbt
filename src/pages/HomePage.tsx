import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCountdown } from "../context/CountdownContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { startCountdown } = useCountdown();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const isFormValid = username !== "" && password !== "" && token !== "";

  const handleNavigation = () => {
    if (isFormValid) {
      startCountdown();
      navigate("/test");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-[90%] w-full text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Ujian Online</h1>
        <div className="w-full flex flex-col gap-y-4 mb-6">
          <div className="flex flex-col text-left">
            <label htmlFor="username" className="text-xs text-gray-700 font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username.."
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="password" className="text-xs text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Masukkan password.."
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col text-left">
            <label htmlFor="token" className="text-xs text-gray-700 font-medium mb-1">
              Token Ujian
            </label>
            <input
              id="token"
              type="text"
              placeholder="Masukkan token ujian.."
              className="px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
        </div>
        <div
          onClick={handleNavigation}
          className={`text-xs font-semibold cursor-pointer bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full transition duration-300 ${
            isFormValid ? "" : "opacity-50 cursor-not-allowed"
          }`}
        >
          Mulai Ujian
        </div>
      </div>
    </div>
  );
}
