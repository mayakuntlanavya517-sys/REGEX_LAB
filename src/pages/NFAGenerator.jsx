import { useState } from "react";
import { buildNFA } from "../engine/regexEngine";
import AutomataDiagram from "../components/AutomataDiagram.jsx";

function NFAGenerator() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [nfa, setNfa] = useState(null);
  const [error, setError] = useState("");

  function generateNFA() {
    try {
      if (!pattern.trim()) {
        throw new Error("Please enter a regular expression.");
      }

      const result = buildNFA(pattern);

      const transitions = result.states.flatMap((state) =>
        state.transitions.map((transition) => ({
          from: state.id,
          to: transition.to.id,
          symbol: transition.symbol
        }))
      );

      setNfa({
        states: result.states.map((state) => state.id),
        transitions,
        startState: result.start.id,
        finalStates: [result.accept.id]
      });

      setError("");
    } catch (err) {
      setNfa(null);
      setError(err.message || "Unable to generate NFA.");
    }
  }

  return (
    <div className="regex-studio">
      <div className="studio-heading">
        <div>
          <h1>NFA Generator</h1>
          <p>Convert Regular Expressions into Nondeterministic Finite Automata.</p>
        </div>
        <span className="engine-status">NFA ENGINE</span>
      </div>

      <div className="editor-panel">
        <h2>Regular Expression Input</h2>
        <label>ENTER REGEX PATTERN</label>

        <input
          className="regex-input"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="Example: (a|b)*abb"
        />

        <button className="analyze-button" onClick={generateNFA}>
          Generate NFA
        </button>

        {error && <p className="rejected">{error}</p>}
      </div>

      {nfa && (
        <>
          <div className="result-panel">
            <h2>NFA Overview</h2>

            <div className="result-row">
              <span>Start State</span>
              <strong>{nfa.startState}</strong>
            </div>

            <div className="result-row">
              <span>Accept State</span>
              <strong>{nfa.finalStates.join(", ")}</strong>
            </div>

            <div className="result-row">
              <span>Total States</span>
              <strong>{nfa.states.length}</strong>
            </div>

            <div className="result-row">
              <span>Total Transitions</span>
              <strong>{nfa.transitions.length}</strong>
            </div>
          </div>

          <div className="result-panel">
            <h2>NFA State Diagram</h2>

            <AutomataDiagram
              title="NFA Diagram"
              states={nfa.states}
              transitions={nfa.transitions}
              startState={nfa.startState}
              acceptState={nfa.finalStates}
            />
          </div>

          <div className="result-panel">
            <h2>NFA Transition Table</h2>

            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left"
              }}>
                <thead>
                  <tr>
                    <th style={{ padding: "12px" }}>From</th>
                    <th style={{ padding: "12px" }}>Symbol</th>
                    <th style={{ padding: "12px" }}>To</th>
                  </tr>
                </thead>
                <tbody>
                  {nfa.transitions.map((t, index) => (
                    <tr key={index}>
                      <td style={{ padding: "12px" }}>{t.from}</td>
                      <td style={{ padding: "12px" }}>{t.symbol}</td>
                      <td style={{ padding: "12px" }}>{t.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NFAGenerator;