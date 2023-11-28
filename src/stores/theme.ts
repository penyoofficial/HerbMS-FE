import { ref, watchEffect } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(JSON.parse(localStorage.getItem("isDark") || "false"));

  /**
   * 切换主题。
   */
  function changeTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem("isDark", JSON.stringify(isDark.value));
    applyTheme();
  }

  /**
   * 应用主题。
   */
  function applyTheme() {
    if (isDark.value) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }

  return { changeTheme, applyTheme };
});
