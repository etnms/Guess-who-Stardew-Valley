import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import styles from "./DarkThemeToggle.module.css";
import { useEffect } from "react";

function DarkThemeToggle() {
  const currentValue = localStorage.getItem("darktheme");

  useEffect(() => {
    // Get toggle value
    const toggle = document.querySelector("input[name='toggle-darktheme") as HTMLInputElement;
    if (currentValue === "lighttheme") toggle.checked = false;
    else toggle.checked = true;
  }, [currentValue]);

  const toggleDarkTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    if ((e.target as HTMLInputElement).checked) {
      document.documentElement.setAttribute("data-color-scheme", "dark");
      localStorage.setItem("darktheme", "darktheme");
    } else {
      localStorage.setItem("darktheme", "lighttheme");
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
  };

  return (
    <div className={styles["dark-theme-toggle"]}>
      <LightModeIcon className={styles.icon} />
      <label className={styles.switch}>
        <input
          type="checkbox"
          name="toggle-darktheme"
          onChange={(e) => toggleDarkTheme(e)}
          aria-label="switch"
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <DarkModeIcon className={styles.icon} />
    </div>
  );
}

export default DarkThemeToggle;
