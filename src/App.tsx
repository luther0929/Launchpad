import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Upload from "./components/Upload";
import Analyze from "./components/Analyze";
import Optimize from "./components/Optimize";
import Download from "./components/Download";
import Stepper from "./components/Stepper";
import "./App.css";

const AppShell: React.FC = () => {
  const location = useLocation();

  const steps = ["Upload", "Analyze", "Optimize", "Download"];
  const activeIndex = (() => {
    const idx = steps.findIndex((s) => location.pathname === `/${s.toLowerCase()}`);
    return idx === -1 ? 0 : idx;
  })();

  return (
    <div
      className="min-h-[100vh] w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    >
      {/* Animated background orbs */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl float-slow"
        style={{
          background: "radial-gradient(circle, #667eea 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl float-medium"
        style={{
          background: "radial-gradient(circle, #764ba2 0%, transparent 70%)",
          bottom: "-10%",
          left: "-5%",
        }}
      />
      <div
        className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl float-fast"
        style={{
          background: "radial-gradient(circle, #f093fb 0%, transparent 70%)",
          top: "40%",
          left: "50%",
        }}
      />

      {/* Breadcrumb / Stepper */}
      <div
        className="w-full flex justify-center py-4 relative z-10"
        style={{
          background: "linear-gradient(135deg, rgba(15,12,41,0.8) 0%, rgba(48,43,99,0.6) 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(102,126,234,0.3)",
          boxShadow: "0 4px 20px rgba(102,126,234,0.2)",
        }}
      >
        <div className="w-full max-w-6xl px-4">
          <Stepper steps={steps} activeIndex={activeIndex} />
        </div>
      </div>

      {/* Component content */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-10 relative z-10">
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;