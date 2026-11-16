import { useState } from "react";
import { analyzeRegex } from "../engine/regexEngine";

function StringValidator() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [inputs, setInputs] = useState("abb\naabb\nbabb\nab\naba");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  function validateStrings() {
    try {
      const stringList = inputs
        .split("\n")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (stringList.length === 0) {
        setResults([]);
        setError("Please enter at least one test string.");
        return;
      }

      const analysis = analyzeRegex(pattern, stringList);

      setResults(analysis.results);
      setError("");
    } catch (err) {
      setResults([]);
      setError(err.message || "Invalid regular expression");
    }
  }

  return (
    <div className="regex-studio">
      <div className="studio-heading">
        <div>
          <h1>String Validator</h1>
          <p>Validate multiple strings against a regular expression</p>
        </div>
        <span className="engine-status">VALIDATION ENGINE</span>
      </div>

      <div className="editor-panel">
        <label>REGULAR EXPRESSION</label>

        <input
          className="regex-input"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
        />

        <label>INPUT STRINGS (ONE PER LINE)</label>

        <textarea
          className="test-input"
          rows={8}
          value={inputs}
          onChange={e => setInputs(e.target.value)}
        />

        <button
          className="analyze-button"
          onClick={validateStrings}
        >
          Validate All Strings
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {results.length > 0 && (
        <>
          <div className="engine-stats">
            <div className="engine-card">
              <span>TOTAL STRINGS</span>
              <h2>{results.length}</h2>
            </div>

            <div className="engine-card">
              <span>ACCEPTED</span>
              <h2>{results.filter(item => item.accepted).length}</h2>
            </div>

            <div className="engine-card">
              <span>REJECTED</span>
              <h2>{results.filter(item => !item.accepted).length}</h2>
            </div>
          </div>

          <div className="result-panel">
            <h2>Validation Results</h2>

            {results.map((item, index) => (
              <div className="result-row" key={index}>
                <span>{item.input || "(empty string)"}</span>
                <strong className={item.accepted ? "accepted" : "rejected"}>
                  {item.accepted ? "ACCEPTED" : "REJECTED"}
                </strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default StringValidator;