"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Hide on admin pages
    if (pathname.startsWith("/admin")) return null;

    // Phone number (without spaces/dashes)
    const phoneNumber = "94752455812";
    const message = encodeURIComponent("Hi! I'm interested in your products. Can you help me?");
    const whatsappLink = `https://wa.me/94752455812?text=Hi! I'm interested in your products. Can you help me?`;

    useEffect(() => {
        // Delay appearance for a smooth entrance
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className={`
                fixed bottom-6 right-6 z-50
                w-14 h-14 rounded-full
                bg-[#25D366] hover:bg-[#20bd5a]
                flex items-center justify-center
                shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40
                transition-all duration-300
                hover:scale-110
                group
                ${isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"}
            `}
        >
            {/* Pulse ring */}
            <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-20" />

            {/* WhatsApp Icon */}
            <svg
                viewBox="0 0 32 32"
                fill="white"
                className="w-7 h-7 relative z-10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M16.004 0h-.008C7.174 0 .004 7.17.004 16c0 3.5 1.128 6.744 3.046 9.378L1.06 31.292l6.156-1.96A15.896 15.896 0 0016.004 32C24.834 32 32 24.83 32 16S24.834 0 16.004 0zm9.342 22.616c-.39 1.1-1.932 2.012-3.178 2.278-.854.18-1.968.324-5.722-1.23-4.804-1.988-7.892-6.856-8.132-7.174-.23-.318-1.938-2.58-1.938-4.92s1.226-3.488 1.662-3.966c.436-.478.952-.598 1.27-.598.316 0 .632.004.908.016.292.014.684-.11 1.07.816.39.94 1.328 3.238 1.444 3.472.118.234.196.508.04.816-.156.316-.234.51-.47.786-.234.276-.492.618-.702.828-.234.234-.478.488-.206.958.276.47 1.226 2.022 2.632 3.276 1.812 1.614 3.34 2.114 3.814 2.35.47.234.748.196 1.024-.12.276-.316 1.186-1.382 1.502-1.858.316-.478.632-.398 1.07-.238.436.158 2.77 1.306 3.244 1.544.478.234.796.356.914.55.118.196.118 1.13-.272 2.218z" />
            </svg>

            {/* Tooltip */}
            <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                Chat with us
                <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </span>
        </a>
    );
}
