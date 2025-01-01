import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";
import "./main.css";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import ChangeProfile from "./changeProfile";
/**
 * 個人資料
 * @returns {React.JSX.Element} Profile
 */
export default function Profile() {
  const { user, errorState } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    /**
     * 當使用者沒權限時，導向首頁
     */
    if (!user?.id) navigate("/");
  }, [0]);
  useEffect(() => {
    if (errorState.update) {
      setIsOpen(true);
    }
  }, [errorState]);
  function formatDateTime(utcTime) {
    const date = new Date(utcTime);
    date.setHours(date.getHours() + 8);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <>
      {isOpen && <ChangeProfile setIsOpen={setIsOpen} />}
      <div className="profile">
        <h3>個人資料</h3>
        <div className="info">
          <p>用戶名: {user?.name}</p>
          <p>帳戶: {user?.email}</p>
          <p>註冊時間: {formatDateTime(user?.date)}</p>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            更改個人資料
          </button>
        </div>
      </div>
    </>
  );
}
