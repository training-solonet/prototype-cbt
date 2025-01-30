import Swal from "sweetalert2";

const detectDevTools = () => {
  const threshold = 160;
  const check = setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      document.body.innerHTML = "";
      Swal.fire({
        icon: "error",
        title: "Developer Tools Terdeteksi!",
        text: "Akses ke halaman ini diblokir.",
        animation: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });

      clearInterval(check);
    }
  }, 1000);
};

export default detectDevTools;
