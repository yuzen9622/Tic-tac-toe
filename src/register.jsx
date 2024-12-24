import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Link } from "react-router-dom";
import "./main.css";

/**
 *
 * @returns {React.JSX.Element} Register
 */
export default function Register() {
  /**
   * useContext 取得當前使用者資訊，並設定一些狀態來管理註冊資料、錯誤訊息、載入狀態。
   *
   * @type {Object} registerInfo 註冊信息，包括用戶輸入的註冊資料。
   * @type {Function} updateRegisterInfo 更新註冊資料的函式。
   * @type {Object} errorState 錯誤訊息狀態，當發生錯誤時會存儲錯誤信息。
   * @type {Function} registerUser 用於提交註冊表單的函式。
   * @type {Object} isLoadingState 載入狀態，顯示用戶是否正在註冊過程中。
   */
  const {
    registerInfo,
    updateRegisterInfo,
    errorState,
    registerUser,
    isLoadingState,
  } = useContext(UserContext);

  return (
    <form
      onSubmit={(e) => {
        registerUser(e);
      }}
      className="register"
    >
      <h3 style={{ fontSize: "25px", color: "white" }}>Register</h3>
      <input
        type="text"
        value={registerInfo.name}
        placeholder="name"
        required
        onChange={(e) =>
          updateRegisterInfo({ ...registerInfo, name: e.target.value })
        }
      />
      <input
        type="email"
        value={registerInfo.email}
        placeholder="email"
        required
        onChange={(e) =>
          updateRegisterInfo({ ...registerInfo, email: e.target.value })
        }
      />
      <input
        type="password"
        required
        onChange={(e) =>
          updateRegisterInfo({ ...registerInfo, password: e.target.value })
        }
        value={registerInfo.password}
        placeholder="password"
      />
      <p className="error">{errorState.register}</p>
      <p className="comment">
        已經有帳號了嗎?<Link to={"/online"}>登入</Link>
      </p>

      <div className="btn">
        <button disabled={isLoadingState.register} type="submit">
          {isLoadingState.register ? "註冊中..." : "註冊"}
        </button>
      </div>
    </form>
  );
}
