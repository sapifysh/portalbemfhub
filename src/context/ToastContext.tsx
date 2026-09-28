import { useState, createContext, useContext, type ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border max-w-sm text-body-small"
            style={{
              animation: 'slideUp 0.3s ease',
              background: toast.type === 'success'
                ? 'var(--color-surface-solid)'
                : toast.type === 'error'
                ? 'var(--color-surface-solid)'
                : 'var(--color-surface-solid)',
              borderColor: toast.type === 'success'
                ? 'var(--color-success)'
                : toast.type === 'error'
                ? 'var(--color-error)'
                : 'var(--color-info)',
              color: toast.type === 'success'
                ? 'var(--color-success)'
                : toast.type === 'error'
                ? 'var(--color-error)'
                : 'var(--color-info)',
              fontWeight: 500,
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
