import rateLimit from 'express-rate-limit';

export const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 OTP requests per window
    message: {
        success: false,
        message: "Too many password reset requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 login/register requests per window
    message: {
        success: false,
        message: "Too many login/registration attempts from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});
