import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'text';
    children: React.ReactNode;
}

export default function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
    const baseStyles = "px-8 py-3 rounded-full font-sans font-bold transition-all duration-300 text-sm tracking-wider uppercase";

    const variants = {
        primary: "bg-rabuste-gold text-white hover:bg-rabuste-mocha shadow-md hover:shadow-lg",
        outline: "border-2 border-rabuste-espresso text-rabuste-espresso hover:bg-rabuste-espresso hover:text-white",
        text: "text-rabuste-espresso hover:text-rabuste-gold underline-offset-4 hover:underline p-0"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
