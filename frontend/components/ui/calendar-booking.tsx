"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarDay: React.FC<{ day: number | string; isHeader?: boolean }> = ({
    day,
    isHeader,
}) => {
    // Random selection for demonstration - replace with actual booking data
    const isBooked =
        !isHeader && Math.random() < 0.3;

    return (
        <div
            className={`col-span-1 row-span-1 flex h-8 w-8 items-center justify-center ${isHeader ? "" : "rounded-xl"
                } ${isBooked
                    ? "bg-white text-black font-semibold"
                    : "text-gray-400 hover:bg-zinc-800 transition-colors"
                }`}
        >
            <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>
                {day}
            </span>
        </div>
    );
};

export function CalendarBooking() {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });
    const currentYear = currentDate.getFullYear();
    const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(
        currentYear,
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const bookingLink = `/turfs`;

    const renderCalendarDays = () => {
        let days: React.ReactNode[] = [
            ...dayNames.map((day, i) => (
                <CalendarDay key={`header-${day}`} day={day} isHeader />
            )),
            ...Array(firstDayOfWeek).map((_, i) => (
                <div
                    key={`empty-start-${i}`}
                    className="col-span-1 row-span-1 h-8 w-8"
                />
            )),
            ...Array(daysInMonth)
                .fill(null)
                .map((_, i) => <CalendarDay key={`date-${i + 1}`} day={i + 1} />),
        ];

        return days;
    };

    return (
        <BentoCard height="h-auto" linkTo={bookingLink}>
            <div className="grid h-full gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="w-6 h-6 text-white" />
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            Book Your Slot
                        </h2>
                    </div>
                    <p className="mb-2 text-sm md:text-base text-gray-400">
                        Check availability and reserve your perfect time slot
                    </p>
                    <Button className="mt-4 rounded-xl bg-white text-black hover:bg-gray-100 font-semibold">
                        Book Slots
                    </Button>
                </div>
                <div className="transition-all duration-500 ease-out">
                    <div>
                        <div className="h-full w-full max-w-md rounded-2xl border border-zinc-800 p-3 transition-colors duration-300 group-hover:border-zinc-700 bg-zinc-900/50">
                            <div
                                className="h-full rounded-xl border border-zinc-800/50 p-4"
                                style={{ boxShadow: "0px 2px 1.5px 0px rgba(255,255,255,0.05) inset" }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-sm text-white">
                                        <span className="font-semibold">
                                            {currentMonth}, {currentYear}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-white"></div>
                                        <p className="text-xs text-gray-400">Available slots</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 grid-rows-5 gap-2">
                                    {renderCalendarDays()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BentoCard>
    );
}

interface BentoCardProps {
    children: React.ReactNode;
    height?: string;
    rowSpan?: number;
    colSpan?: number;
    className?: string;
    showHoverGradient?: boolean;
    hideOverflow?: boolean;
    linkTo?: string;
}

export function BentoCard({
    children,
    height = "h-auto",
    rowSpan = 8,
    colSpan = 7,
    className = "",
    showHoverGradient = true,
    hideOverflow = true,
    linkTo,
}: BentoCardProps) {
    const cardContent = (
        <div
            className={`group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-6 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 ${hideOverflow && "overflow-hidden"
                } ${height} row-span-${rowSpan} col-span-${colSpan} ${className}`}
        >
            {linkTo && (
                <div className="absolute bottom-6 right-6 z-[999] flex h-12 w-12 rotate-6 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-[-8px] group-hover:rotate-0 group-hover:opacity-100 shadow-lg">
                    <svg
                        className="h-6 w-6 text-black"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.25 15.25V6.75H8.75"
                        ></path>
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 7L6.75 17.25"
                        ></path>
                    </svg>
                </div>
            )}
            {showHoverGradient && (
                <div className="user-select-none pointer-events-none absolute inset-0 z-30 bg-gradient-to-tl from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 rounded-2xl"></div>
            )}
            {children}
        </div>
    );

    if (linkTo) {
        return linkTo.startsWith("/") ? (
            <Link href={linkTo} className="block">
                {cardContent}
            </Link>
        ) : (
            <a
                href={linkTo}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
            >
                {cardContent}
            </a>
        );
    }

    return cardContent;
}
