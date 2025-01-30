import Swal from "sweetalert2";

const detectSplitScreenOnMobile = () => {
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const checkSplitScreen = () => {
    if (!isMobile()) return;

    const screenRatio = window.innerWidth / window.innerHeight;
    const isSplit = screenRatio < 0.6 || screenRatio > 1.8;

    if (isSplit) {
      Swal.fire({
        icon: "warning",
        title: "Mode Split Screen Terdeteksi",
        text: "Aplikasi mungkin tidak tampil dengan benar di mode layar terpisah.",
      });
    }
  };

  checkSplitScreen();

  window.addEventListener("resize", checkSplitScreen);
};

export default detectSplitScreenOnMobile;
