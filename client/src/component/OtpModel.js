import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase';
import './OTPModal.css';

const OTPModal = ({ visible, mode, onClose, onSuccess, contactInfo }) => {
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          window.recaptchaVerifier.clear();
          delete window.recaptchaVerifier;
        },
      }, auth);
    }
  };

  useEffect(() => {
    if (!visible) return;

    if (mode === 'phone' && contactInfo) {
      setupRecaptcha();
      sendPhoneOTP(contactInfo);
    } else if (mode === 'email' && contactInfo) {
      sendEmailOTP(contactInfo);
    }
  }, [visible, contactInfo]);

  const sendPhoneOTP = (phoneNumber) => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setSent(true);
      })
      .catch((err) => {
        alert('OTP error: ' + err.message);
        onClose();
      });
  };

  const sendEmailOTP = async (email) => {
    setLoading(true);
    try {
      await fetch('https://codeflo.onrender.com/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err) {
      alert('Failed to send email OTP');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (mode === 'phone') {
      try {
        const result = await confirmationResult.confirm(otp);
        const phoneNumber = result.user.phoneNumber;
        const res = await fetch('https://codeflo.onrender.com/api/auth/phone-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber }),
        });

        const data = await res.json();
        if (data.result && data.token) {
          localStorage.setItem('Profile', JSON.stringify(data));
          onSuccess();
        } else {
          alert("Failed to store user on server");
        }
      } catch (err) {
        console.error("OTP verification failed:", err);
        alert('Incorrect OTP or verification failed');
      }
    } else if (mode === 'email') {
      try {
        const res = await fetch('https://codeflo.onrender.com/verify-email-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: contactInfo, otp }),
        });

        const data = await res.json();
        if (data.success) {
          onSuccess();
        } else {
          alert('Incorrect OTP');
        }
      } catch (err) {
        alert('Verification failed');
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="otp-modal">
      <div className="otp-modal-content">
        <h3>Enter the OTP sent to your {mode === 'phone' ? 'phone' : 'email'}</h3>
        <input
          type="text"
          value={otp}
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={verifyOtp} disabled={loading || !otp}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>

        {/* Invisible recaptcha element (must be rendered) */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default OTPModal;
