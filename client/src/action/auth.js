import * as api from '../api';
import { setcurrentuser } from './currentuser';
import { fetchallusers } from './users';

export const signup = (authdata, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signup(authdata);
    console.log("✅ Signup response data:", data);
    
    localStorage.setItem("Profile", JSON.stringify(data));
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(data.result));
    dispatch(fetchallusers());
    
    navigate("/");
  } catch (error) {
    console.error("❌ Signup error:", error);
    alert("Signup failed: " + (error?.response?.data?.message || error.message));
  }
};

export const login = (authdata, navigate) => async (dispatch) => {
  try {
    const { data } = await api.login(authdata);
    console.log("✅ Login response data:", data);
    
    localStorage.setItem("Profile", JSON.stringify(data));
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(data.result));
    
    navigate("/");
  } catch (error) {
    console.error("❌ Login error:", error);
    alert("Login failed: " + (error?.response?.data?.message || error.message));
  }
};

export const phoneAuthLogin = (phoneNumber, navigate) => async (dispatch) => {
  try {
    const { data } = await api.phoneLogin({ phoneNumber });
    console.log("✅ Phone login response:", data);
    
    localStorage.setItem("Profile", JSON.stringify(data));
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(data.result));
    dispatch(fetchallusers());
    
    navigate("/");
  } catch (error) {
    console.error("❌ Phone login error:", error);
    alert("Phone login failed: " + (error?.response?.data?.message || error.message));
  }
};
