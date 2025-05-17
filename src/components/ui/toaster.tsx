import { ReactNode } from "react";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProviderWrapper({ children }: ToastProviderProps) {
  return (
    <ToastProvider>
      {children}
      <ToastViewport />
    </ToastProvider>
  );
}