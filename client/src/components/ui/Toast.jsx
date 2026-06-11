import toast from "react-hot-toast";

export const showToast = {
  success: (message) =>
    toast.success(message, {
      style: {
        background: "#12121e",
        color: "#f3f4f6",
        border: "1px solid rgba(16, 185, 129, 0.3)",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#12121e",
      },
    }),
  error: (message) =>
    toast.error(message, {
      style: {
        background: "#12121e",
        color: "#f3f4f6",
        border: "1px solid rgba(239, 68, 68, 0.3)",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#12121e",
      },
    }),
  info: (message) =>
    toast(message, {
      style: {
        background: "#12121e",
        color: "#f3f4f6",
        border: "1px solid rgba(6, 182, 212, 0.3)",
      },
    }),
};
