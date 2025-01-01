import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { server_url, url } from "./servirce";
import { io } from "socket.io-client";
/**
 * 用戶上下文，用於管理整個應用中的用戶資料和登錄註冊狀態。
 * 提供註冊、登入、登出等功能，並提供用戶資料的共享。
 *
 * @context UserContext
 *
 */
export const UserContext = createContext();

/**
 * UserContext 的提供者組件，用於提供用戶相關的狀態和功能給子組件。
 *  @params {Object} children
 * @returns {React.JSX.Element} UserContextProvider
 */
export const UserContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  /**
   * 狀態變數
   * @type {[Object | Function]} socket 用於管理 socket.io 的 socket
   * @type {[Object | Function]} errorState 錯誤訊息狀態
   * @type {[Boolean | Function]} isLoadingState 載入狀態
   * @type {[Object | Function]} user 當前使用者資料
   * @type {[Object | Function]} loginInfo 登入資訊
   * @type {[Object | Function]} registerInfo 註冊資訊
   */
  const [socket, setSocket] = useState(null);
  const [errorState, setErrorState] = useState({
    login: null,
    register: null,
    update: null,
  });
  const [isLoadingState, setIsLoadingState] = useState({
    login: false,
    register: false,
    update: false,
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

  /**
   * 更新登入資訊
   * @param {Object} info 登入資訊
   */
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  /**
   * 更新註冊資訊
   * @param {Object} info 註冊資訊
   */
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  /**
   * 更新使用者資訊
   * @param {Object} info 使用者資訊
   */
  const updateUserInfo = useCallback((info) => {
    setUser(info);
  }, []);

  /**
   * 登出函式，清除 sessionStorage 中的用戶資訊，並斷開 socket 連接。
   * 並將用戶設置為 null，然後跳轉到首頁。
   */
  const logout = useCallback(() => {
    sessionStorage.removeItem("player_info");
    socket?.disconnect();
    setUser(null);
    setTimeout(() => navigate("/"), 0);
  }, [navigate, socket]);

  /**
   *
   * @param {String} email
   * @returns {String} vaildEmail
   */
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  /**
   * 處理路由變化，當路由變化時，檢查是否切換到 online 頁面，並且確認是否已經重載過。
   * @param {Object} socket socket.io 的 socket
   * @returns {void}
   * @type {Function} handleLocationChange
   */
  const handleLocationChange = useCallback(
    (socket) => {
      if (window.location.hash !== "#/online") {
        // 檢查是否切換到 online 頁面，並且確認是否已經重載過
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

  /**
   * 當 location 變化時，檢查是否切換到 online 頁面，並且確認是否已經重載過。
   * 當 user 變化時，檢查是否有使用者登入，並且加入 socket.io 的房間。
   */
  useEffect(() => {
    if (user) {
      handleLocationChange(socket);
    }
    if (
      document.body.style.backgroundColor !== "rgba(19, 56, 190, 0.8)" &&
      location.pathname !== "/single"
    ) {
      document.body.style.backgroundColor = "";
    }
    console.log(location.pathname);
  }, [location, user, socket, handleLocationChange]);

  /**
   * 登入函式，用於處理登入請求，並將登入資訊發送到伺服器進行驗證。
   * 驗證成功後，將用戶資訊存儲到 sessionStorage 中，並更新用戶資訊。
   * @returns {Boolean} 是否登入成功
   * @type {Promise<Boolean>} 登入是否成功
   * @type {Function} loginUser
   */
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
        setIsLoadingState({ ...isLoadingState, login: data.message });
        return true;
      } else if (res.status === 500) {
        setErrorState({ ...errorState, login: data.message });
        sessionStorage.removeItem("player_info");
        setIsLoadingState({ ...isLoadingState, login: false });
        return false;
      }
    } catch (error) {
      setErrorState({ ...errorState, login: "伺服器問題" });
      sessionStorage.removeItem("player_info");
      console.error(error);
      return false;
    } finally {
      setIsLoadingState({ ...isLoadingState, login: false });
    }
  }, [loginInfo, updateUserInfo]);

  /**
   * 註冊函式，用於處理註冊請求，並將註冊資訊發送到伺服器進行驗證。
   * @param {Object} e
   * @returns {Promise<void>}
   * @type {Function} registerUser
   */
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

  /**
   * 更新使用者資料
   * @param {Object} info 使用者資料
   * @returns {Promise<void>}
   * @type {Function} updateProfile
   */
  const updateProfile = useCallback(async (info) => {
    setIsLoadingState({ ...errorState, update: true });
    try {
      const res = await fetch(`${server_url}/user/update`, {
        method: "post",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem("player_info", JSON.stringify(data));
        setUser(data);
      } else {
        setErrorState({ ...errorState, update: data.message });
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingState({ ...errorState, update: false });
    }
  }, []);

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
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
