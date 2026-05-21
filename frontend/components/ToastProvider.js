"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const TOAST_STYLES = {
  success: "bg-emerald-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-stone-800 text-white",
};

const DIALOG_STYLES = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-stone-200 bg-white text-stone-900",
};

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((message, options = {}) => {
    const id = crypto.randomUUID();
    const { variant = "info", duration = 4000 } = options;

    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        variant,
      },
    ]);

    if (duration > 0) {
      window.setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const showDialog = useCallback((nextDialog) => {
    setDialog(nextDialog);
  }, []);

  const alert = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      showDialog({
        type: "alert",
        message,
        title: options.title || "Notice",
        confirmLabel: options.confirmLabel || "OK",
        variant: options.variant || "info",
        resolve,
      });
    });
  }, [showDialog]);

  const confirm = useCallback((message, options = {}) => {
    return new Promise((resolve) => {
      showDialog({
        type: "confirm",
        message,
        title: options.title || "Please confirm",
        confirmLabel: options.confirmLabel || "Confirm",
        cancelLabel: options.cancelLabel || "Cancel",
        variant: options.variant || "warning",
        resolve,
      });
    });
  }, [showDialog]);

  const success = useCallback((message, options = {}) => toast(message, { ...options, variant: "success" }), [toast]);
  const error = useCallback((message, options = {}) => toast(message, { ...options, variant: "error" }), [toast]);

  const value = useMemo(
    () => ({
      toast,
      alert,
      confirm,
      success,
      error,
    }),
    [toast, alert, confirm, success, error],
  );

  const handleDialogClose = (result) => {
    if (!dialog) return;
    dialog.resolve(result);
    setDialog(null);
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-3">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`min-w-[220px] max-w-sm rounded-lg shadow-lg px-4 py-3 text-sm ${TOAST_STYLES[item.variant] || TOAST_STYLES.info}`}>
            <div className="flex items-start justify-between gap-3">
              <span className="leading-5">{item.message}</span>
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="text-white/80 hover:text-white">
                x
              </button>
            </div>
          </div>
        ))}
      </div>

      {dialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
          <div
            className={`w-full max-w-md rounded-xl border shadow-xl px-6 py-5 ${DIALOG_STYLES[dialog.variant] || DIALOG_STYLES.info}`}>
            <div className="mb-3 text-lg font-semibold">{dialog.title}</div>
            <div className="text-sm leading-6">{dialog.message}</div>
            <div className="mt-5 flex justify-end gap-3">
              {dialog.type === "confirm" && (
                <button
                  type="button"
                  onClick={() => handleDialogClose(false)}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100">
                  {dialog.cancelLabel}
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDialogClose(true)}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700">
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export { ToastProvider, useToast };
