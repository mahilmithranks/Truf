'use client';

import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
                    <p className="text-gray-400">Last updated: December 19, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using TurfBook ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms & Conditions, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Use of Service</h2>
                        <p className="mb-3">
                            TurfBook provides an online platform for booking turf slots. You agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide accurate and complete information when creating an account</li>
                            <li>Maintain the security of your account credentials</li>
                            <li>Not use the Service for any illegal or unauthorized purpose</li>
                            <li>Not interfere with or disrupt the Service or servers</li>
                            <li>Comply with all local laws regarding online conduct and acceptable content</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Booking and Payments</h2>
                        <p className="mb-3">
                            When you make a booking through TurfBook:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>All bookings are subject to availability</li>
                            <li>Payment must be completed at the time of booking</li>
                            <li>You will receive a confirmation email upon successful booking</li>
                            <li>Prices are subject to change without prior notice</li>
                            <li>All payments are processed securely through our payment gateway</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Cancellation and Refund Policy</h2>
                        <p className="mb-3">
                            Our cancellation and refund policy is as follows:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Cancellations made 24 hours before the booking time are eligible for a full refund</li>
                            <li>Cancellations made between 12-24 hours before booking time receive a 50% refund</li>
                            <li>Cancellations made less than 12 hours before booking time are non-refundable</li>
                            <li>Refunds will be processed within 5-7 business days</li>
                            <li>TurfBook reserves the right to cancel bookings due to unforeseen circumstances</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. User Conduct</h2>
                        <p className="mb-3">
                            You agree to use the turf facilities responsibly and:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Respect the property and equipment</li>
                            <li>Follow all safety guidelines and rules</li>
                            <li>Not engage in any violent or abusive behavior</li>
                            <li>Arrive on time for your booking</li>
                            <li>Leave the facility in good condition</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Liability</h2>
                        <p>
                            TurfBook and its affiliates shall not be liable for any injuries, damages, or losses incurred while using the turf facilities. Users participate at their own risk and are responsible for their own safety and the safety of others.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
                        <p>
                            All content on TurfBook, including but not limited to text, graphics, logos, images, and software, is the property of TurfBook and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Modifications to Terms</h2>
                        <p>
                            TurfBook reserves the right to modify these Terms & Conditions at any time. We will notify users of any significant changes via email or through the Service. Your continued use of the Service after such modifications constitutes your acceptance of the updated terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
                        <p>
                            We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users, us, or third parties, or for any other reason.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
                        <p className="mb-3">
                            If you have any questions about these Terms & Conditions, please contact us:
                        </p>
                        <ul className="space-y-2">
                            <li>Email: info@turfbook.com</li>
                            <li>Phone: +91 9876543210</li>
                            <li>Support: Available 24/7</li>
                        </ul>
                    </section>
                </div>

                {/* Back to Home */}
                <div className="mt-12 pt-8 border-t border-zinc-800">
                    <Link
                        href="/"
                        className="inline-flex items-center text-white hover:text-gray-300 transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
