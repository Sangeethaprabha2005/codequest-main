// src/utils/sendEmailOtp.js

import axios from 'axios';

const sendEmailOtp = async (email) => {
  try {
    await axios.post('https://your-backend.com/api/send-otp', {
      email,
    });
  } catch (error) {
    console.error('Error sending email OTP:', error);
    throw error;
  }
};

export default sendEmailOtp;
