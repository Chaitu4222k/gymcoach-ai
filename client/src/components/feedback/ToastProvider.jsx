import { useState, useMemo } from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import ToastContext from "../../context/ToastContext";

function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const value = useMemo(
    () => ({
      success: (message) => showToast(message, "success"),

      error: (message) => showToast(message, "error"),

      warning: (message) => showToast(message, "warning"),

      info: (message) => showToast(message, "info"),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export default ToastProvider;