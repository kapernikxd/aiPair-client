'use client'

import React from 'react'
import { motion } from 'framer-motion'
// импорт иконок, ваших Badge/Pill и т.п.

export default function LandingClient() {
    return (
        <div>
            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold leading-tight sm:text-5xl"
            >
                Talk with an <span className="bg-gradient-to-r from-[#6f2da8] via-fuchsia-500 to-indigo-400 bg-clip-text text-transparent">AI companion</span> that actually listens
            </motion.h1>
            {/* здесь вся разметка лендинга с framer-motion */}
        </div>
    )
}