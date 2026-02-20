import React from 'react';

export default function LogoText({ className = "" }) {
    return (
        <span className={`font-bold bg-gradient-to-r from-blue-600 via-[#ffb700] to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer ${className}`}>
            Rupeek
        </span>
    );
}
