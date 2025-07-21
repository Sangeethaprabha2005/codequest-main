import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import axios from 'axios';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [selectedLang, setSelectedLang] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleLanguageClick = (langCode) => {
    setSelectedLang(langCode);
    if (langCode === 'fr') {
      const userEmail = prompt('Enter your email for OTP verification:');
      if (userEmail) {
        setEmail(userEmail);
        sendEmailOtp(userEmail);
      }
    } else {
      const phoneNumber = prompt('Enter your phone number with country code (e.g., +91xxxxx):');
      if (phoneNumber) {
        setPhone(phoneNumber);
        sendPhoneOtp(phoneNumber);
      }
    }
  };

  const sendEmailOtp = async (email) => {
    try {
      const res = await axios.post('https://codequest-main.onrender.com/send-email-otp', { email });
      if (res.data.success) {
        alert('OTP sent to your email.');
        setOtpSent(true);
      } else {
        alert('Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending email OTP');
    }
  };

  const sendPhoneOtp = async (number) => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        auth
      );

      const confirmation = await signInWithPhoneNumber(auth, number, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      alert('OTP sent to your phone.');
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert('Error sending phone OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      if (selectedLang === 'fr') {
        const res = await axios.post('https://codequest-main.onrender.com/verify-email-otp', {
          email,
          otp,
        });
        if (res.data.success) {
          i18n.changeLanguage('fr');
          alert('Language switched to French');
          navigate('/');
        } else {
          alert('Invalid OTP');
        }
      } else {
        await confirmationResult.confirm(otp);
        i18n.changeLanguage(selectedLang);
        alert(`Language switched to ${selectedLang}`);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('OTP verification failed');
    }
  };

  return (
    <div className="lang-switcher-container">
      <div className="lang-switcher-card">
        <h2>🌍 Choose Your Language</h2>
        <div className="lang-btn-group">
          <button onClick={() => handleLanguageClick('en')}>English</button>
          <button onClick={() => handleLanguageClick('hi')}>हिंदी</button>
          <button onClick={() => handleLanguageClick('es')}>Español</button>
          <button onClick={() => handleLanguageClick('pt')}>Português</button>
          <button onClick={() => handleLanguageClick('zh')}>中文</button>
          <button onClick={() => handleLanguageClick('fr')}>Français</button>
        </div>

        {otpSent && (
          <div className="otp-verification">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={verifyOtp}>Verify</button>
          </div>
        )}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
