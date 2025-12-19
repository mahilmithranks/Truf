'use client';

import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-gray-400">Last updated: December 19, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to TurfBook's Privacy Policy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                        <p className="mb-3">
                            We may collect, use, store and transfer different kinds of personal data about you:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">Identity Data:</strong> Name, username, date of birth</li>
                            <li><strong className="text-white">Contact Data:</strong> Email address, phone number</li>
                            <li><strong className="text-white">Financial Data:</strong> Payment card details (processed securely by our payment provider)</li>
                            <li><strong className="text-white">Transaction Data:</strong> Details about bookings and payments</li>
                            <li><strong className="text-white">Technical Data:</strong> IP address, browser type, device information</li>
                            <li><strong className="text-white">Usage Data:</strong> Information about how you use our website and services</li>
                            <li><strong className="text-white">Marketing Data:</strong> Your preferences in receiving marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                        <p className="mb-3">
                            We use your personal data for the following purposes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>To register you as a new customer and manage your account</li>
                            <li>To process and deliver your turf bookings</li>
                            <li>To manage payments, fees, and charges</li>
                            <li>To send you booking confirmations and updates</li>
                            <li>To provide customer support and respond to your queries</li>
                            <li>To improve our website, products, and services</li>
                            <li>To send you marketing communications (with your consent)</li>
                            <li>To protect against fraud and ensure security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                        <p>
                            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, accessed, altered, or disclosed in an unauthorized way. We limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
                        <p>
                            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. When we no longer need your data, we will securely delete or anonymize it.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Your Legal Rights</h2>
                        <p className="mb-3">
                            Under data protection laws, you have rights including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong className="text-white">Access:</strong> Request access to your personal data</li>
                            <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
                            <li><strong className="text-white">Erasure:</strong> Request deletion of your personal data</li>
                            <li><strong className="text-white">Object:</strong> Object to processing of your personal data</li>
                            <li><strong className="text-white">Restriction:</strong> Request restriction of processing</li>
                            <li><strong className="text-white">Portability:</strong> Request transfer of your data</li>
                            <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Cookies</h2>
                        <p>
                            Our website uses cookies to distinguish you from other users and provide you with a good experience. Cookies are small text files that are placed on your device to help the website provide a better user experience. You can set your browser to refuse all or some cookies, but this may affect your ability to use our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Links</h2>
                        <p>
                            Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                        <p>
                            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                        <p className="mb-3">
                            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                        </p>
                        <ul className="space-y-2">
                            <li>Email: privacy@turfbook.com</li>
                            <li>Phone: +91 9876543210</li>
                            <li>Address: TurfBook Privacy Team</li>
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
