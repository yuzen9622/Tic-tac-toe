import logo from "./logo.svg";
import "./App.css";
import Gameapp from "./main";
import { Routes, Route } from "react-router-dom";
import StartPage from "./start";
import Online from "./online";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/single" element={<Gameapp />} />
        <Route path="/online" element={<Online />} />
      </Routes>
    </>
  );
}

export default App;
