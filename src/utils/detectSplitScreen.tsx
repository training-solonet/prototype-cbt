import Swal from "sweetalert2";

const detectSplitScreenOnMobile = () => {
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  let previousWidth = window.innerWidth;
  let previousHeight = window.innerHeight;

  const checkSplitScreen = () => {
    if (!isMobile()) return;

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    const widthChange = Math.abs(previousWidth - currentWidth);
    const heightChange = Math.abs(previousHeight - currentHeight);

    if (widthChange > 200 || heightChange > 200) {
      Swal.fire({
        icon: "warning",
        title: "Mode Split Screen Terdeteksi",
        text: "Aplikasi mungkin tidak tampil dengan benar di mode layar terpisah.",
      });
    }

    previousWidth = currentWidth;
    previousHeight = currentHeight;
  };

  checkSplitScreen();

  window.addEventListener("resize", checkSplitScreen);
};

export default detectSplitScreenOnMobile;
