import axios from "axios";
const API = axios.create({
  baseURL: "https://codequest-main.onrender.com",
  withCredentials: true,
});


API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

export const login = (authdata) => API.post("/user/login", authdata);
export const signup = (authdata) => API.post("/user/signup", authdata);
export const phoneLogin = (phoneData) => API.post("/user/phone-login", phoneData);
export const getallusers = () => API.get("/user/getallusers");
export const updateprofile = (id, updatedata) => API.patch(`/user/update/${id}`, updatedata);

export const postquestion = (questiondata) => API.post("/questions/Ask", questiondata);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) => API.patch(`/questions/vote/${id}`, { value });

export const postanswer = (id, noofanswers, answerbody, useranswered, userid) =>
  API.patch(`/answer/post/${id}`, { noofanswers, answerbody, useranswered, userid });

export const deleteanswer = (id, answerid, noofanswers) =>
  API.patch(`/answer/delete/${id}`, { answerid, noofanswers });
