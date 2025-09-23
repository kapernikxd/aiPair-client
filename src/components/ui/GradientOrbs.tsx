'use client';


import React from 'react';


export default function GradientOrbs() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[-20%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#F9A8D4]/10 blur-3xl" />
            <div className="absolute bottom-[-30%] right-[-20%] h-[32rem] w-[32rem] rounded-full bg-[#7C3AED]/20 blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] h-[24rem] w-[24rem] rounded-full bg-[#FBBF24]/10 blur-3xl" />
        </div>
    );
}