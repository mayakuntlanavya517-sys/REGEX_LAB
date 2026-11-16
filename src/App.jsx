import { useState } from "react";
import "./App.css";

import RegexStudio from "./pages/RegexStudio.jsx";
import RegexTester from "./pages/RegexTester.jsx";
import NFAGenerator from "./pages/NFAGenerator.jsx";
import DFAGenerator from "./pages/DFAGenerator.jsx";
import AutomataVisualizer from "./pages/AutomataVisualizer.jsx";
import StringValidator from "./pages/StringValidator.jsx";
import TestCaseGenerator from "./pages/TestCaseGenerator.jsx";
import PerformanceAnalyzer from "./pages/PerformanceAnalyzer.jsx";
import RegexLibrary from "./pages/RegexLibrary.jsx";
import Settings from "./pages/Settings.jsx";

const modules = [
  { name: "Regex Studio", icon: "⌨️", description: "Create and edit regular expressions" },
  { name: "Regex Tester", icon: "🔍", description: "Test regex patterns live" },
  { name: "NFA Generator", icon: "⚙️", description: "Generate NFA from regex" },
  { name: "DFA Generator", icon: "🔄", description: "Convert NFA into DFA" },
  { name: "Automata Visualizer", icon: "📊", description: "Visualize automata transitions" },
  { name: "String Validator", icon: "✅", description: "Validate strings using regex" },
  { name: "Test Case Generator", icon: "🧪", description: "Generate regex test cases" },
  { name: "Performance Analyzer", icon: "⚡", description: "Analyze regex performance" },
  { name: "Regex Library", icon: "📚", description: "Explore regex patterns" },
  { name: "Settings", icon: "⚙️", description: "Customize your workspace" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [theme, setTheme] = useState("Dark");

  function renderPage() {
    switch (activeTab) {
      case "Regex Studio": return <RegexStudio />;
      case "Regex Tester": return <RegexTester />;
      case "NFA Generator": return <NFAGenerator />;
      case "DFA Generator": return <DFAGenerator />;
      case "Automata Visualizer": return <AutomataVisualizer />;
      case "String Validator": return <StringValidator />;
      case "Test Case Generator": return <TestCaseGenerator />;
      case "Performance Analyzer": return <PerformanceAnalyzer />;
      case "Regex Library": return <RegexLibrary />;
      case "Settings":
        return <Settings theme={theme} setTheme={setTheme} />;
      default: return null;
    }
  }

  return (
    <div className={`app-container ${theme === "Dark" ? "dark-theme" : "light-theme"}`}>
      <aside className="sidebar">
        <div className="logo">
          <h2>REGEX<span>LAB</span></h2>
          <p>Advanced Regex Workspace</p>
        </div>

        <nav>
          <button
            className={activeTab === "Dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("Dashboard")}
          >
            🏠 Dashboard
          </button>

          {modules.map((module) => (
            <button
              key={module.name}
              className={activeTab === module.name ? "nav-item active" : "nav-item"}
              onClick={() => setActiveTab(module.name)}
            >
              {module.icon} {module.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>REGEX LAB</p>
          <small>Smart Automata Platform</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>{activeTab}</h2>
            <p>Welcome to your Regex workspace</p>
          </div>
          <span className="status-indicator">● System Online</span>
        </header>

        {activeTab === "Dashboard" ? (
          <section className="dashboard">
            <div className="welcome-section">
              <h1>Welcome to REGEX LAB</h1>
              <p>
                Your intelligent workspace for Regular Expressions
                and Finite Automata.
              </p>
            </div>

            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>10</h3>
                <p>Available Tools</p>
              </div>
              <div className="stat-card">
                <h3>∞</h3>
                <p>Regex Possibilities</p>
              </div>
              <div className="stat-card">
                <h3>AI</h3>
                <p>Smart Workspace</p>
              </div>
            </div>

            <h2 className="section-title">Workspace Modules</h2>

            <div className="module-grid">
              {modules.map((module) => (
                <div
                  className="module-card"
                  key={module.name}
                  onClick={() => setActiveTab(module.name)}
                >
                  <div className="module-icon">{module.icon}</div>
                  <h3>{module.name}</h3>
                  <p>{module.description}</p>
                  <span>Open Module →</span>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="page-content">
            {renderPage()}
          </section>
        )}
      </main>
    </div>
  );
}