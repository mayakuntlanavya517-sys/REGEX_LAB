import { useState } from "react";
import { analyzeRegex } from "../engine/regexEngine";

function RegexTester() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [input, setInput] = useState("abb");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function testRegex() {
    try {
      const analysis = analyzeRegex(pattern, [input]);

      setResult(analysis.results[0]);
      setError("");
    } catch (err) {
      setResult(null);
      setError(err.message || "Invalid regular expression");
    }
  }

  return (
    <div className="regex-studio">

      <div className="studio-heading">
        <div>
          <h1>Regex Tester</h1>
          <p>Test strings against regular expressions</p>
        </div>
        <span className="engine-status">TEST ENGINE</span>
      </div>

      <div className="editor-panel">
        <label>REGULAR EXPRESSION</label>

        <input
          className="regex-input"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
        />

        <label>TEST STRING</label>

        <input
          className="regex-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a string"
        />

        <button className="analyze-button" onClick={testRegex}>
          Test Expression
        </button>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {result && (
          <div className="result-panel">
            <h2>Test Result</h2>

            <p>
              Input: <strong>{result.input}</strong>
            </p>

            <h2 className={result.accepted ? "accepted" : "rejected"}>
              {result.accepted ? "ACCEPTED" : "REJECTED"}
            </h2>

            <p>
              {result.accepted
                ? "The input string belongs to the language."
                : "The input string does not belong to the language."}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default RegexTester;