import { useState } from "react";
import { analyzeRegex } from "../engine/regexEngine";

function TestCaseGenerator() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [maxLength, setMaxLength] = useState(4);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  function generateStrings() {
    try {
      const alphabet = ["a", "b"];
      let strings = [""];

      for (let length = 1; length <= maxLength; length++) {
        const previous = strings.filter(
          item => item.length === length - 1
        );

        previous.forEach(item => {
          alphabet.forEach(letter => {
            strings.push(item + letter);
          });
        });
      }

      const analysis = analyzeRegex(pattern, strings);
      setResults(analysis.results);
      setError("");
    } catch (err) {
      setResults([]);
      setError(err.message || "Invalid regex");
    }
  }

  return (
    <div className="regex-studio">
      <div className="studio-heading">
        <div>
          <h1>Test Case Generator</h1>
          <p>Generate and validate automatic test cases</p>
        </div>
        <span className="engine-status">TEST ENGINE</span>
      </div>

      <div className="editor-panel">
        <label>REGULAR EXPRESSION</label>

        <input
          className="regex-input"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
        />

        <label>MAXIMUM STRING LENGTH</label>

        <select
          className="regex-input"
          value={maxLength}
          onChange={e => setMaxLength(Number(e.target.value))}
        >
          {[2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <button className="analyze-button" onClick={generateStrings}>
          Generate Test Cases
        </button>

        {error && <p className="error-message">{error}</p>}
      </div>

      {results.length > 0 && (
        <>
          <div className="engine-stats">
            <div className="engine-card">
              <span>TOTAL CASES</span>
              <h2>{results.length}</h2>
            </div>
            <div className="engine-card">
              <span>ACCEPTED</span>
              <h2>{results.filter(x => x.accepted).length}</h2>
            </div>
            <div className="engine-card">
              <span>REJECTED</span>
              <h2>{results.filter(x => !x.accepted).length}</h2>
            </div>
          </div>

          <div className="result-panel">
            <h2>Generated Test Cases</h2>

            {results.map((item, index) => (
              <div className="result-row" key={index}>
                <span>{item.input === "" ? "(empty string)" : item.input}</span>
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

export default TestCaseGenerator;