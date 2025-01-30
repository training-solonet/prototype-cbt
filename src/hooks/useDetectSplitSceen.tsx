import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

type UseDetectSplitScreenOptions = {
  alertOnSplitScreen?: boolean;
  navigateToOnSplitScreen?: string;
};

export default function useDetectSplitScreen({
  alertOnSplitScreen,
  navigateToOnSplitScreen,
}: UseDetectSplitScreenOptions) {
  const navigate = useNavigate();

  useEffect(() => {
    const isMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const checkSplitScreen = () => {
      if (!isMobile()) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const minWidth = 400;
      const minHeight = 300;

      if (width < minWidth || height < minHeight) {
        if (alertOnSplitScreen) {
          Swal.fire({
            icon: "warning",
            title: "Mode Split Screen Terdeteksi",
            text: "Aplikasi mungkin tidak tampil dengan benar di mode layar terpisah.",
          });
        }

        if (navigateToOnSplitScreen) {
          navigate(navigateToOnSplitScreen);
        }
      }
    };

    checkSplitScreen();
    window.addEventListener("resize", checkSplitScreen);

    return () => {
      window.removeEventListener("resize", checkSplitScreen);
    };
  }, [navigate, alertOnSplitScreen, navigateToOnSplitScreen]);
}
