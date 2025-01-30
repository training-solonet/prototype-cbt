import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type UseConnectionOptions = {
  onOnline?: () => void;
  alertOnOnline?: boolean;
  navigateToOnOnline?: string;
};

export default function useConnection({
  onOnline,
  alertOnOnline,
  navigateToOnOnline,
}: UseConnectionOptions) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      if (alertOnOnline) {
        alert("Koneksi internet tersedia! Kamu akan diarahkan ke halaman selesai.");
      }

      if (onOnline) {
        onOnline();
      }

      if (navigateToOnOnline) {
        navigate(navigateToOnOnline);
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [navigate, onOnline, alertOnOnline, navigateToOnOnline]);
}
