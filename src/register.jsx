import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Link } from "react-router-dom";
import "./main.css";
export default function Register() {
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
