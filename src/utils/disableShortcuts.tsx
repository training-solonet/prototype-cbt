import { useEffect } from "react";
import Swal from "sweetalert2";

export default function disableShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const code = event.code.toLowerCase(); 

      if (
        event.ctrlKey &&
        event.shiftKey &&
        (key === "i" || code === "keyi")
      ) {
        event.preventDefault();
        // event.stopPropagation(); 
        Swal.fire("Peringatan!", "Anda tidak bisa menggunakan shortcut ini.", "warning");
        return false;
      }

      const forbiddenShortcuts = new Set([
        "f12", // Developer Tools
        "f5", // Refresh
        "control+shift+j", // Open Console (Chrome)
        "control+shift+i", // Open Console (Chrome)
        "control+u", // View Source
        "control+s", // Save Page
        "control+c", // Copy
        "control+a", // Select All
        "control+x", // Cut
      ]);

      const pressedKey = `${event.ctrlKey ? "control+" : ""}${
        event.shiftKey ? "shift+" : ""
      }${key}`;

      if (forbiddenShortcuts.has(pressedKey) || code === "f12") {
        event.preventDefault();
        // event.stopPropagation();  
        Swal.fire("Peringatan!", "Anda tidak bisa menggunakan shortcut ini.", "warning");
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);
}
