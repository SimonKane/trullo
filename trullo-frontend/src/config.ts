// API Base URL - använder miljövariabel i produktion, localhost i utveckling
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
