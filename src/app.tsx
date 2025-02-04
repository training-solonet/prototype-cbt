import { StrictMode } from "react";
import disableRightClick from "./utils/disableRightClick";
import disableShortcuts from "./utils/disableShortcuts";
import { CountdownProvider } from "./context/CountdownContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import ExamCompletedPage from "./pages/ExamCompletedPage";

export default function App() {
    disableRightClick();
    disableShortcuts();
  
    return (
      <StrictMode>
        <CountdownProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/completed" element={<ExamCompletedPage />} />
            </Routes>
          </Router>
        </CountdownProvider>
      </StrictMode>
    );
  }