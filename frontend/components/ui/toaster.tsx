'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg',
                    description: 'group-[.toast]:text-gray-600',
                    actionButton:
                        'group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-600 group-[.toast]:to-purple-600 group-[.toast]:text-white',
                    cancelButton:
                        'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900',
                    success: 'group-[.toaster]:bg-green-50 group-[.toaster]:border-green-200 group-[.toaster]:text-green-900',
                    error: 'group-[.toaster]:bg-red-50 group-[.toaster]:border-red-200 group-[.toaster]:text-red-900',
                    warning: 'group-[.toaster]:bg-yellow-50 group-[.toaster]:border-yellow-200 group-[.toaster]:text-yellow-900',
                    info: 'group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-200 group-[.toaster]:text-blue-900',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
