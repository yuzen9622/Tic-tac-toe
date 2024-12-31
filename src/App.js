import Gameapp from "./main";
import { Routes, Route } from "react-router-dom";
import StartPage from "./start";
import Online from "./online";
import HistoryPage from "./history";
import Navbar from "./navbar";
import "./App.css";
import Register from "./register";
import AIonline from "./AIonline";
import Record from "./record";
import Profile from "./profile";

function App() {
  return (
    <>
      {/* 導覽列組件 */}
      <Navbar />
      {/* 定義應用的路由配置 */}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/single" element={<Gameapp />} />
        <Route path="/online" element={<Online />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:index" element={<HistoryPage />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/profile" element={<Profile />} />
        <Route path="/AI" element={<AIonline />} />
        <Route path="/record" element={<Record />} />
      </Routes>
    </>
  );
}

export default App;
