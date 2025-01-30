import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
          alert("Tab disembunyikan, kamu akan diarahkan ke halaman selesai.");
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
