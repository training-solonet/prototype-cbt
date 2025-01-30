import Swal from "sweetalert2";

const detectSplitScreenOnMobile = () => {
  // Cek apakah perangkat adalah mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Fungsi untuk mengecek split screen
  const checkSplitScreen = () => {
    if (!isMobile()) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Menentukan ukuran minimum normal (bisa disesuaikan)
    const minWidth = 400;  // Jika kurang dari ini, kemungkinan split screen
    const minHeight = 300; // Jika kurang dari ini, kemungkinan split screen

    if (width < minWidth || height < minHeight) {
      Swal.fire({
        icon: "warning",
        title: "Mode Split Screen Terdeteksi",
        text: "Aplikasi mungkin tidak tampil dengan benar di mode layar terpisah.",
      });
    }
  };

  // Jalankan saat pertama kali halaman dimuat
  checkSplitScreen();

  // Jalankan saat ukuran layar berubah (misal masuk/keluar split-screen)
  window.addEventListener("resize", checkSplitScreen);
};

export default detectSplitScreenOnMobile;
