// src/utils/verifyEmailOtp.js

import axios from 'axios';

const verifyEmailOtp = async (email, otp) => {
  try {
    const res = await axios.post('https://your-backend.com/api/verify-otp', {
      email,
      otp,
    });

    return res.data.success; // true or false
  } catch (error) {
    console.error('OTP verification failed:', error);
    return false;
  }
};

export default verifyEmailOtp;
