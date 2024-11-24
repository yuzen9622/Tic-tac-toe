import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { server_url, url } from "./servirce";
import { io } from "socket.io-client";
export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [socket, setSocket] = useState(null);
  const [errorState, setErrorState] = useState({
    login: null,
    register: null,
  });
  const [isLoadingState, setIsLoadingState] = useState({
    login: false,
    register: false,
  });
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("player_info"))
      ? JSON.parse(sessionStorage.getItem("player_info"))
      : null
  );

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
    socket?.disconnect();
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
    setErrorState({ ...errorState, login: null });
    setIsLoadingState({ ...isLoadingState, login: true });
    if (!validateEmail(loginInfo?.email)) {
      setErrorState({ ...errorState, login: "請輸入合法電子郵件" });
      return false;
    }
    if (loginInfo?.password === "" || loginInfo?.email === "") {
      setErrorState({ ...errorState, login: "不可為空白" });
      return false;
    }
    try {
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
        setIsLoadingState({ ...isLoadingState, login: false });
        return true;
      } else {
        setErrorState({ ...errorState, login: data?.message });
        sessionStorage.removeItem("player_info");
        setIsLoadingState({ ...isLoadingState, login: false });
        return false;
      }
    } catch (error) {
      setErrorState({ ...errorState, login: error });
      sessionStorage.removeItem("player_info");
      console.error(error);
      return false;
    } finally {
      setIsLoadingState({ ...isLoadingState, login: false });
    }
  }, [loginInfo, updateUserInfo]);

  const registerUser = useCallback(
    async (e) => {
      e?.preventDefault();
      setErrorState({ ...errorState, register: null });
      setIsLoadingState({ ...isLoadingState, register: true });
      console.log(registerInfo);
      if (
        registerInfo.name === "" ||
        registerInfo.email === "" ||
        registerInfo.password === ""
      ) {
        setErrorState({ ...errorState, register: "不可為空" });
        setIsLoadingState({ ...isLoadingState, register: false });
        return;
      }
      if (!validateEmail(registerInfo.email)) {
        setErrorState({ ...errorState, register: "電子郵件格式錯誤" });
        setIsLoadingState({ ...isLoadingState, register: false });
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
          setErrorState({ ...errorState, register: data.message });
          setRegisterInfo({ name: "", email: "", password: "" });
        }
        setIsLoadingState({ ...isLoadingState, register: false });
      } catch (error) {
        console.log(error);
        setIsLoadingState({ ...isLoadingState, register: false });
        setErrorState({ ...errorState, register: "伺服器錯誤" });
      }
    },
    [registerInfo, navigate]
  );

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
        errorState,
        socket,
        loginUser,
        isLoadingState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
