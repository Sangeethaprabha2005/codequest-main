import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { signup, login, phoneAuthLogin } from "../../action/auth";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase";
import icon from "../../assets/icon.png";
import Aboutauth from "./Aboutauth";
import "./Auth.css";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [usePhoneAuth, setUsePhoneAuth] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirectTo || "/";

  const handleSwitch = () => {
    setIsSignup(!isSignup);
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          handlePhoneLogin();
        },
        defaultCountry: "IN",
      },
      auth
    );
  };

  const handlePhoneLogin = () => {
    configureCaptcha();
    const phoneNumber = "+91" + emailOrPhone;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        alert("OTP has been sent");
      })
      .catch((error) => {
        console.error("SMS not sent", error);
      });
  };

  const verifyOTP = () => {
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        const user = result.user;
        dispatch(phoneAuthLogin({ phone: user.phoneNumber }, navigate));
        navigate(redirectPath); // 🔁 redirect after login
      })
      .catch((error) => {
        alert("Invalid OTP");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usePhoneAuth) {
      if (otp) {
        verifyOTP();
      } else {
        handlePhoneLogin();
      }
      return;
    }

    if (isSignup) {
      if (!name) {
        alert("Please enter a name to continue");
        return;
      }
      dispatch(signup({ name, email: emailOrPhone, password }, navigate, redirectPath));
    } else {
      dispatch(login({ email: emailOrPhone, password }, navigate, redirectPath));
    }
  };

  return (
    <section className="auth-section">
      {isSignup && <Aboutauth />}
      <div className="auth-container-2">
        {!isSignup && <img src={icon} alt="stack overflow" className="login-logo" />}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              <h4>Display Name</h4>
              <input type="text" name="name" onChange={(e) => setName(e.target.value)} />
            </label>
          )}

          <label>
            <h4>{usePhoneAuth ? "Phone Number" : "Email"}</h4>
            <input
              type={usePhoneAuth ? "tel" : "email"}
              name="email"
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
          </label>

          <label>
            <h4>Password</h4>
            <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
            {!isSignup && !usePhoneAuth && (
              <p style={{ color: "#007ac6", fontSize: "13px" }}>forgot password?</p>
            )}
          </label>

          {usePhoneAuth && (
            <label>
              <h4>OTP</h4>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </label>
          )}

          <button type="submit" className="auth-btn">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <label>
          <input
            type="checkbox"
            onChange={(e) => setUsePhoneAuth(e.target.checked)}
          />{" "}
          Use phone number instead
        </label>

        <p>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" className="handle-switch-btn" onClick={handleSwitch}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
      <div id="recaptcha-container"></div>
    </section>
  );
}

export default Auth;
