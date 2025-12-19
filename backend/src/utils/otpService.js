import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Hash OTP for secure storage
export const hashOTP = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};

// Verify OTP
export const verifyOTP = (inputOTP, hashedOTP) => {
    const hashedInput = hashOTP(inputOTP);
    return hashedInput === hashedOTP;
};

// Generate OTP expiration time (10 minutes from now)
export const getOTPExpiration = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Check if OTP is expired
export const isOTPExpired = (expirationDate) => {
    return new Date() > new Date(expirationDate);
};

// Generate password reset token
export const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash reset token
export const hashResetToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate reset token expiration (1 hour from now)
export const getResetTokenExpiration = () => {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
};
