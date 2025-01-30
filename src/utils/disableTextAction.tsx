import { useEffect } from "react";

export default function disableTextActions() {
  useEffect(() => {
    const disableEvent = (event: Event) => {
      event.preventDefault();
      return false;
    };

    // Mencegah pemilihan teks, copy, cut, paste, dan klik kanan
    document.addEventListener("selectstart", disableEvent);
    document.addEventListener("copy", disableEvent);
    document.addEventListener("cut", disableEvent);
    document.addEventListener("paste", disableEvent);
    document.addEventListener("contextmenu", disableEvent);

    return () => {
      document.removeEventListener("selectstart", disableEvent);
      document.removeEventListener("copy", disableEvent);
      document.removeEventListener("cut", disableEvent);
      document.removeEventListener("paste", disableEvent);
      document.removeEventListener("contextmenu", disableEvent);
    };
  }, []);
}
