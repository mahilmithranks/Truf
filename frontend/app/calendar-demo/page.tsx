import { CalendarBooking } from "@/components/ui/calendar-booking";

export default function CalendarDemo() {
    return (
        <main className="min-h-screen bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Calendar Component Demo
                    </h1>
                    <p className="text-xl text-gray-400">
                        Interactive booking calendar with black & white theme
                    </p>
                </div>

                {/* Single Calendar */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-white mb-6">Single Calendar Card</h2>
                    <CalendarBooking />
                </div>

                {/* Grid Layout Example */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Grid Layout Example</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <CalendarBooking />
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">Additional Info</h3>
                            <p className="text-gray-400 mb-4">
                                The calendar component features:
                            </p>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Responsive design that works on all devices</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Smooth hover animations and transitions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Black and white theme matching your design</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Interactive day selection (white = booked)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-white">•</span>
                                    <span>Clickable card that links to booking page</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
