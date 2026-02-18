import React from 'react';

export default function LogoText({ className = "" }) {
    return (
        <span className={`font-bold text-blue-600 ${className}`}>
            Rup<span className="text-[#ffb700]">ee</span>k
        </span>
    );
}
