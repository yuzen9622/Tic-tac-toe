import logo from "./logo.svg";

import Gameapp from "./main";
import { Routes, Route } from "react-router-dom";
import StartPage from "./start";
import Online from "./online";
import HistoryPage from "./history";
import Navbar from "./navbar";
import "./App.css";
import Register from "./register";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/single" element={<Gameapp />} />
        <Route path="/online" element={<Online />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<HistoryPage />} />
        <Route path="/auth/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
