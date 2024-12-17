import logo from "./logo.svg";

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
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/single" element={<Gameapp />} />
        <Route path="/online" element={<Online />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:index" element={<HistoryPage />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/AI" element={<AIonline />} />
        <Route path="/record" element={<Record />} />
      </Routes>
    </>
  );
}

export default App;
