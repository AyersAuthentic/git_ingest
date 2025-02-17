"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="up">
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-green-500 text-white border-none"
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-white opacity-90">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white hover:text-white/80" />
          </Toast>
        )
      })}
      <ToastViewport className="fixed top-0 inset-x-0 flex justify-center items-start p-4" />
    </ToastProvider>
  )
}
