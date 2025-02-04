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
      const minWidth = 600;
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

    // Panggil checkSplitScreen pertama kali
    checkSplitScreen();

    // Event listener untuk resize
    const handleResize = () => {
      checkSplitScreen();
    };

    // Menambahkan event listener untuk resize
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate, alertOnSplitScreen, navigateToOnSplitScreen]);
}
