"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Zap } from "lucide-react"

export function OTPVerification() {
    const [otp, setOtp] = useState(["", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerify = async () => {
        const otpCode = otp.join("")
        if (otpCode.length !== 4) return

        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)

        console.log("OTP verified:", otpCode)
    }

    const handleResend = () => {
        console.log("Resending OTP...")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl shadow-2xl">
                {/* Background with gradient - Silver to Black */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-300 via-gray-600 to-black" />
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>

                <div className="relative z-10 p-8 py-14">
                    <div className="text-center mb-8">
                        {/* Icon */}
                        <div className="w-12 h-12 mx-auto mb-6 text-white bg-gradient-to-br from-gray-200 to-gray-400 rounded-full p-2 shadow-lg">
                            <Zap className="w-full h-full text-gray-900" />
                        </div>
                        <h1 className="text-2xl font-semibold text-white mb-3">Enter verification code</h1>
                        <p className="text-white/70 text-sm leading-relaxed">
                            We emailed you a verification code to
                            <br />
                            <span className="text-white font-medium">your@email.com</span>
                        </p>
                    </div>

                    {/* OTP Input Fields */}
                    <div className="flex justify-center gap-4 mb-8">
                        {otp.map((digit, index) => (
                            <div key={index} className="relative">
                                <input
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-14 h-14 text-center text-xl font-medium bg-white/10 border-2 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/60 focus:outline-none transition-all duration-200 shadow-lg rounded-2xl backdrop-blur-sm"
                                    placeholder=""
                                />
                            </div>
                        ))}
                    </div>

                    {/* Resend Link */}
                    <div className="text-center mb-8">
                        <span className="text-white/60 text-sm">Didn't get the code? </span>
                        <button
                            onClick={handleResend}
                            className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 underline"
                        >
                            Resend
                        </button>
                    </div>

                    {/* Terms */}
                    <div className="text-center">
                        <p className="text-white/50 text-xs leading-relaxed">
                            By continuing, you agree to our{" "}
                            <button className="text-white/70 hover:text-white underline transition-colors">
                                Terms of Service
                            </button>{" "}
                            &{" "}
                            <button className="text-white/70 hover:text-white underline transition-colors">
                                Privacy Policy
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
