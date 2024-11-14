import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { server_url } from "./servirce";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("player_info"))
      ? JSON.parse(sessionStorage.getItem("player_info"))
      : null
  );
  const [error, setError] = useState(null);

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateUserInfo = useCallback((info) => {
    setUser(info);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("player_info");
    setUser(null);
    setTimeout(() => navigate("/"), 0);
  }, [navigate]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  useEffect(() => {
    console.log(location.pathname);
  }, [location]);

  const registerUser = useCallback(async () => {
    setError("");
    console.log(registerInfo);
    if (
      registerInfo.name === "" ||
      registerInfo.email === "" ||
      registerInfo.password === ""
    ) {
      setError("不可為空");
      return;
    }
    if (!validateEmail(registerInfo.email)) {
      setError("電子郵件格式錯誤");
      return;
    }

    try {
      const res = await fetch(`${server_url}/user/register`, {
        method: "post",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(registerInfo),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("player_info", JSON.stringify(data));
        setUser(data);
        window.location.replace("/");
      } else {
        setError(data.message);
        setRegisterInfo({ name: "", email: "", password: "" });
      }
    } catch (error) {
      console.log(error);
      setError("伺服器錯誤");
    }
  }, [registerInfo]);

  return (
    <UserContext.Provider
      value={{
        user,
        updateLoginInfo,
        updateRegisterInfo,
        loginInfo,
        registerInfo,
        updateUserInfo,
        logout,
        registerUser,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
