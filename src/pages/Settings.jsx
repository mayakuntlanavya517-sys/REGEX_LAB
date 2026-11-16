function Settings({ theme, setTheme }) {
  return (
    <div className="regex-studio">
      <div className="studio-heading">
        <div>
          <h1>Application Settings</h1>
          <p>Manage your REGEX LAB preferences</p>
        </div>
        <span className="engine-status">SYSTEM CONFIGURATION</span>
      </div>

      <div className="editor-panel">
        <h2>Appearance</h2>

        <label>APPLICATION THEME</label>

        <select
          className="regex-input"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="Dark">Dark Theme</option>
          <option value="Light">Light Theme</option>
        </select>

        <div className="result-row">
          <span>Current Theme</span>
          <strong>{theme}</strong>
        </div>

        <p className="accepted">
          Theme preference is applied to the application.
        </p>
      </div>

      <div className="result-panel">
        <h2>System Information</h2>

        <div className="result-row">
          <span>Application</span>
          <strong>REGEX LAB</strong>
        </div>

        <div className="result-row">
          <span>Version</span>
          <strong>1.0.0</strong>
        </div>

        <div className="result-row">
          <span>Platform</span>
          <strong>React + Vite</strong>
        </div>

        <div className="result-row">
          <span>Engine</span>
          <strong>Automata Processing Engine</strong>
        </div>

        <div className="result-row">
          <span>Status</span>
          <strong className="accepted">Operational</strong>
        </div>
      </div>
    </div>
  );
}

export default Settings;