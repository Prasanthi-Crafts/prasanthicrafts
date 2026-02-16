"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function MaintenancePage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    // Set the target date (e.g., 7 days from now)
    // In a real scenario, this would be a specific launch date
    const [targetDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // Set to 7 days from now
        return date;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor(
                    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                const minutes = Math.floor(
                    (difference % (1000 * 60 * 60)) / (1000 * 60)
                );
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-yellow-500 blur-[100px]"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-[120px]"></div>
            </div>

            <div className="z-10 flex flex-col items-center max-w-4xl w-full text-center space-y-8 animate-fade-in">
                {/* Logo / Brand Name */}
                <h2 className="text-yellow-400 text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase mb-4">
                    Prasanthi Crafts
                </h2>

                {/* Main Heading */}
                <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight">
                    Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Maintenance</span>
                </h1>

                {/* Subheading */}
                <p className="text-gray-300 text-lg md:text-xl max-w-2xl px-4 leading-relaxed">
                    We are currently working on improving your experience. We will be back shortly with a new look and better features.
                </p>

                {/* Countdown Timer */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 w-full max-w-3xl">
                    <TimeBox value={timeLeft.days} label="Days" />
                    <TimeBox value={timeLeft.hours} label="Hours" />
                    <TimeBox value={timeLeft.minutes} label="Minutes" />
                    <TimeBox value={timeLeft.seconds} label="Seconds" />
                </div>

                {/* Footer / Contact (Optional) */}
                <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-md">
                    <p className="text-gray-500 text-sm">
                        Have questions? Contact us at <span className="text-yellow-400 hover:underline cursor-pointer">support@prasanthicrafts.com</span>
                    </p>
                </div>
            </div>
        </main>
    );
}

function TimeBox({ value, label }: { value: number; label: string }) {
    // Pad single digits with leading zero
    const formattedValue = value < 10 ? `0${value}` : value;

    return (
        <div className="flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6 min-w-[120px] shadow-lg hover:border-yellow-500/60 transition-colors duration-300">
            <span className="text-5xl md:text-6xl font-mono font-bold text-white mb-2">
                {formattedValue}
            </span>
            <span className="text-yellow-400 text-xs md:text-sm uppercase tracking-widest font-semibold">
                {label}
            </span>
        </div>
    );
}
