import React, { useContext, useEffect, useState } from "react";
import "./main.css";
import { UserContext } from "./userContext";

/**
 * 更改個人資料
 * @param {Function} setIsOpen
 * @returns {React.JSX.Element} ChangeProfile
 */
export default function ChangeProfile({ setIsOpen }) {
  const { user, updateProfile, isLoadingState, errorState } =
    useContext(UserContext);
  const [changeProfile, setChangeProfile] = useState({
    id: user?.id,
    name: user.name,
    email: user.email,
    password: "",
  });

  return (
    <form
      onSubmit={(e) => {
        updateProfile(changeProfile);
      }}
      className="register"
    >
      <h3 style={{ fontSize: "25px", color: "white" }}>更改個人資料</h3>
      <input
        type="text"
        value={changeProfile.name}
        placeholder="name"
        required
        onChange={(e) =>
          setChangeProfile({ ...changeProfile, name: e.target.value })
        }
      />
      <input
        type="email"
        value={changeProfile.email}
        placeholder="email"
        required
        onChange={(e) =>
          setChangeProfile({ ...changeProfile, email: e.target.value })
        }
      />
      <input
        type="password"
        onChange={(e) =>
          setChangeProfile({ ...changeProfile, password: e.target.value })
        }
        value={changeProfile.password}
        autoComplete="off"
        placeholder="new password"
      />
      {errorState?.update && <p className="error">{errorState.update}</p>}
      <div className="btn">
        <button type="button" onClick={() => setIsOpen(false)}>
          取消
        </button>
        <button type="submit">更改</button>
      </div>
    </form>
  );
}
