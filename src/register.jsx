import React, { useContext } from "react";
import { UserContext } from "./userContext";
import { Link } from "react-router-dom";
import "./main.css";
export default function Register() {
  const { registerInfo, updateRegisterInfo, error, registerUser } =
    useContext(UserContext);

  return (
    <div className="register">
      <h3 style={{ fontSize: "25px", color: "white" }}>Register</h3>
      <input
        type="text"
        value={registerInfo.name}
        placeholder="name"
        onChange={(e) =>
          updateRegisterInfo({ ...registerInfo, name: e.target.value })
        }
      />
      <input
        type="email"
        value={registerInfo.email}
        placeholder="email"
        onChange={(e) =>
          updateRegisterInfo({ ...registerInfo, email: e.target.value })
        }
      />
      <input
        type="password"
        onChange={(e) =>
          updateRegisterInfo({ ...registerInfo, password: e.target.value })
        }
        value={registerInfo.password}
        placeholder="password"
      />
      <p className="error">{error}</p>
      <p className="comment">
        已經有帳號了嗎?<Link to={"/online"}>登入</Link>
      </p>

      <div className="btn">
        <button onClick={() => registerUser()}>註冊</button>
      </div>
    </div>
  );
}
