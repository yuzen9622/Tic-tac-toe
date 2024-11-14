import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { server_url, handleLocationChange, url } from "./servirce";
import { io } from "socket.io-client";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
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
    socket.disconnect();
    setUser(null);
    setTimeout(() => navigate("/"), 0);
  }, [navigate, socket]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleLocationChange = useCallback(
    (socket) => {
      // 檢查是否切換到 online 頁面，並且確認是否已經重載過
      if (window.location.hash !== "#/online") {
        console.log(window.location.hash);

        socket?.disconnect();
        setSocket(null);
      } else {
        if (socket) return;
        const newSocket = io(url);
        newSocket.emit("join", { playerName: user });
        setSocket(newSocket);
      }
    },
    [socket, user]
  );
  useEffect(() => {
    if (user) {
      handleLocationChange(socket);
    }

    console.log(location.pathname);
  }, [location, user, socket, handleLocationChange]);

  const loginUser = useCallback(async () => {
    setError("");
    if (!validateEmail(loginInfo?.email)) {
      setError("請輸入合法電子郵件!");
      return false;
    }
    if (loginInfo?.password === "" || loginInfo?.email === "") {
      setError("不可為空白");
      return false;
    }
    const res = await fetch(`${server_url}/user/login`, {
      method: "post",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(loginInfo),
    });
    const data = await res.json();
    if (res.ok) {
      sessionStorage.setItem("player_info", JSON.stringify(data));
      updateUserInfo(data);

      const newSocket = io(url, {
        autoConnect: true,
      });
      newSocket?.emit("join", { playerName: data });
      setSocket(newSocket);
      return true;
    } else {
      setError(data?.message);
      sessionStorage.removeItem("player_info");
      return false;
    }
  }, [loginInfo, updateUserInfo]);

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
        navigate("/");
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
        socket,
        loginUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
