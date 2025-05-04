"use client";

import { useToast } from "@/app/hooks/use-toast"; // or wherever your hook file is

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[999] space-y-2">
      {toasts.map(
        (toast) =>
          toast.open && (
            <div
              key={toast.id}
              className="bg-black text-white px-4 py-2 rounded shadow-md"
            >
              <strong>{toast.title}</strong>
              <div>{toast.description}</div>
            </div>
          )
      )}
    </div>
  );
}
