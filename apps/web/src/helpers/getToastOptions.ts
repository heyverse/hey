const getToastOptions = (theme?: string) => ({
  error: {
    className: "border border-red-500",
    iconTheme: {
      primary: "#EF4444",
      secondary: "white"
    }
  },
  loading: { className: "border border-neutral-300" },
  style: {
    background: theme === "dark" ? "#18181B" : "",
    color: theme === "dark" ? "#fff" : ""
  },
  success: {
    className: "border border-emerald-500",
    iconTheme: {
      primary: "#10B981",
      secondary: "white"
    }
  }
});

export default getToastOptions;
