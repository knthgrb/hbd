import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreatorPage from "./pages/CreatorPage";
import BirthdayPage from "./pages/BirthdayPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrap">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<CreatorPage />} />
            <Route path="/b" element={<BirthdayPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
