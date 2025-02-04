import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type UseVisibilityOptions = {
  onVisibilityHidden?: () => void;
  alertOnVisibilityHidden?: boolean;
  navigateToOnVisibilityHidden?: string;
};

export default function useVisibility({
  onVisibilityHidden,
  alertOnVisibilityHidden,
  navigateToOnVisibilityHidden,
}: UseVisibilityOptions) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (alertOnVisibilityHidden) {
          Swal.fire({
            title: "Peringatan!",
            text: "Anda terdeteksi berpindah tab/screen! Laporkan ke pengawas untuk melanjutkan anda.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: false,
            showConfirmButton: false,
          });
        }

        if (onVisibilityHidden) {
          onVisibilityHidden();
        }

        if (navigateToOnVisibilityHidden) {
          navigate(navigateToOnVisibilityHidden);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate, onVisibilityHidden, alertOnVisibilityHidden, navigateToOnVisibilityHidden]);
}