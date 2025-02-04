import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
        Swal.fire({
          title: "Peringatan!",
          text: "Anda terdeteksi koneksi online! Laporkan ke pengawas untuk melanjutkan ujian anda.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showCancelButton: false,
          showConfirmButton: false,
        });
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
