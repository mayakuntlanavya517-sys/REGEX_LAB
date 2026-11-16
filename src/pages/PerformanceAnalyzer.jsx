import { useState } from "react";
import { analyzeRegex } from "../engine/regexEngine";

function PerformanceAnalyzer() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [inputs, setInputs] = useState(
    "abb\naabb\nbabb\nab\naba\nbbabb\nabab\n"
  );
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  function runAnalysis() {
    try {
      const testStrings = inputs
        .split("\n")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      if (testStrings.length === 0) {
        setError("Enter at least one test string.");
        setReport(null);
        return;
      }

      const start = performance.now();
      const analysis = analyzeRegex(pattern, testStrings);
      const end = performance.now();

      const accepted = analysis.results.filter(
        item => item.accepted
      ).length;

      const rejected = analysis.results.length - accepted;
      const duration = end - start;

      setReport({
        total: analysis.results.length,
        accepted,
        rejected,
        duration,
        average: duration / analysis.results.length,
        results: analysis.results
      });

      setError("");
    } catch (err) {
      setReport(null);
      setError(err.message || "Performance analysis failed.");
    }
  }

  return (
    <div className="regex-studio">

      <div className="studio-heading">
        <div>
          <h1>Performance Analyzer</h1>
          <p>Measure regex processing performance and validation results</p>
        </div>
        <span className="engine-status">PERFORMANCE ENGINE</span>
      </div>

      <div className="editor-panel">

        <label>REGULAR EXPRESSION</label>

        <input
          className="regex-input"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
        />

        <label>TEST STRINGS (ONE PER LINE)</label>

        <textarea
          className="test-input"
          rows={8}
          value={inputs}
          onChange={e => setInputs(e.target.value)}
        />

        <button
          className="analyze-button"
          onClick={runAnalysis}
        >
          Analyze Performance
        </button>

        {error && <p className="error-message">{error}</p>}

      </div>

      {report && (
        <>
          <div className="engine-stats">

            <div className="engine-card">
              <span>TOTAL STRINGS</span>
              <h2>{report.total}</h2>
            </div>

            <div className="engine-card">
              <span>ACCEPTED</span>
              <h2>{report.accepted}</h2>
            </div>

            <div className="engine-card">
              <span>REJECTED</span>
              <h2>{report.rejected}</h2>
            </div>

          </div>

          <div className="result-panel">

            <h2>Performance Report</h2>

            <div className="result-row">
              <span>Execution Time</span>
              <strong>{report.duration.toFixed(4)} ms</strong>
            </div>

            <div className="result-row">
              <span>Average Time Per String</span>
              <strong>{report.average.toFixed(4)} ms</strong>
            </div>

            <div className="result-row">
              <span>Processed Strings</span>
              <strong>{report.total}</strong>
            </div>

            <div className="result-row">
              <span>Success Rate</span>
              <strong className="accepted">
                {((report.accepted / report.total) * 100).toFixed(2)}%
              </strong>
            </div>

          </div>

          <div className="result-panel">
            <h2>Individual Test Results</h2>

            {report.results.map((item, index) => (
              <div className="result-row" key={index}>
                <span>
                  {item.input || "(empty string)"}
                </span>

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

export default PerformanceAnalyzer;