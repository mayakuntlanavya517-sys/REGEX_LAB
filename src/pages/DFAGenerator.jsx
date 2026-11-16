import { useState } from "react";
import { buildNFA } from "../engine/regexEngine";
import { convertNFAToDFA } from "../engine/dfaEngine";
import AutomataDiagram from "../components/AutomataDiagram.jsx";

function DFAGenerator() {
  const [pattern, setPattern] = useState("(a|b)*abb");
  const [dfa, setDfa] = useState(null);
  const [error, setError] = useState("");

  function generateDFA() {
    try {
      if (!pattern.trim()) {
        setError("Please enter a regular expression.");
        setDfa(null);
        return;
      }

      const nfa = buildNFA(pattern);
      const result = convertNFAToDFA(nfa);

      if (!result || !result.states) {
        throw new Error("DFA generation failed. Please check the expression.");
      }

      setDfa(result);
      setError("");
    } catch (err) {
      setDfa(null);
      setError(err.message || "Unable to generate DFA.");
    }
  }

  return (
    <div className="regex-studio">
      <div className="studio-heading">
        <div>
          <h1>DFA Generator</h1>
          <p>
            Convert a Regular Expression into a Deterministic
            Finite Automaton using subset construction.
          </p>
        </div>
        <span className="engine-status">DFA ENGINE</span>
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

        <button
          className="analyze-button"
          onClick={generateDFA}
        >
          Generate DFA
        </button>

        {error && <p className="rejected">{error}</p>}
      </div>

      {dfa && (
        <>
          <div className="result-panel">
            <h2>DFA Overview</h2>

            <div className="result-row">
              <span>Start State</span>
              <strong>{String(dfa.start)}</strong>
            </div>

            <div className="result-row">
              <span>Total DFA States</span>
              <strong>{dfa.states.length}</strong>
            </div>

            <div className="result-row">
              <span>Accept States</span>
              <strong>
                {Array.isArray(dfa.accept)
                  ? dfa.accept.map(String).join(", ")
                  : String(dfa.accept ?? "Not available")}
              </strong>
            </div>

            <div className="result-row">
              <span>Total Transitions</span>
              <strong>{dfa.transitions?.length ?? 0}</strong>
            </div>
          </div>

          <div className="result-panel">
            <h2>DFA State Details</h2>
            <pre style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              color: "var(--text)",
              fontSize: "13px",
              lineHeight: 1.8
            }}>
              {JSON.stringify(dfa.states, null, 2)}
            </pre>
          </div>

          <div className="result-panel">
            <h2>DFA Transition Table</h2>

            {dfa.transitions?.length > 0 ? (
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
                    {dfa.transitions.map((transition, index) => (
                      <tr key={index}>
                        <td style={{ padding: "12px" }}>
                          {String(transition.from)}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {String(
                            transition.symbol ??
                            transition.label ??
                            transition.input ??
                            "ε"
                          )}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {String(transition.to)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No transitions available.</p>
            )}
          </div>

          <div className="result-panel">
            <h2>DFA State Diagram</h2>

            <AutomataDiagram
              title="DFA Diagram"
              states={dfa.states}
              transitions={dfa.transitions}
              startState={dfa.startState}
              acceptState={dfa.finalStates}
            />
          </div>

          <div className="result-panel">
            <h2>Complete DFA Structure</h2>
            <pre style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              color: "var(--text)",
              fontSize: "12px",
              lineHeight: 1.7
            }}>
              {JSON.stringify(dfa, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}

export default DFAGenerator;