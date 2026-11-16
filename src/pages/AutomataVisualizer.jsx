import { useState } from "react";
import AutomataDiagram from "../components/AutomataDiagram.jsx";

export default function AutomataVisualizer() {
  const [input, setInput] = useState("101");
  const [result, setResult] = useState(null);

  const transitions = {
    q0: { "0": "q0", "1": "q1" },
    q1: { "0": "q2", "1": "q1" },
    q2: { "0": "q0", "1": "q1" },
  };

  function visualize() {
    let currentState = "q0";
    const path = ["q0"];

    for (const symbol of input) {
      if (symbol !== "0" && symbol !== "1") {
        setResult({
          valid: false,
          accepted: false,
          path: [],
          message: "Only 0 and 1 are allowed.",
        });
        return;
      }

      currentState = transitions[currentState][symbol];
      path.push(currentState);
    }

    const accepted = currentState === "q2";

    setResult({
      valid: true,
      accepted,
      path,
      message: accepted
        ? "String Accepted! Final state reached."
        : "String Rejected! Final state not reached.",
    });
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Automata Visualizer</h1>

      <p style={styles.description}>
        Test binary strings and visualize DFA state transitions.
      </p>

      <div style={styles.inputBox}>
        <label>Enter Binary String</label>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder="Example: 101"
          style={styles.input}
        />

        <button onClick={visualize} style={styles.button}>
          Visualize Automata
        </button>
      </div>

      <div style={{ marginTop: "25px" }}>
        <AutomataDiagram path={result?.path || []} />
      </div>

      <div style={styles.tableBox}>
        <h2>Transition Table</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>State</th>
              <th>Input 0</th>
              <th>Input 1</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(transitions).map(([state, values]) => (
              <tr key={state}>
                <td>{state}</td>
                <td>{values["0"]}</td>
                <td>{values["1"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result && (
        <div style={styles.resultBox}>
          <h2 style={{
            color: result.accepted ? "#4ade80" : "#f87171"
          }}>
            {result.message}
          </h2>

          {result.valid && (
            <p>
              State Path: {result.path.join(" → ")}
            </p>
          )}

          <strong>
            Result: {result.accepted ? "ACCEPTED" : "REJECTED"}
          </strong>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "25px",
    color: "#f8fafc",
    maxWidth: "1100px",
    margin: "auto",
  },
  heading: {
    color: "#a78bfa",
    fontSize: "30px",
  },
  description: {
    color: "#94a3b8",
    marginBottom: "25px",
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "22px",
    background: "#1e293b",
    borderRadius: "12px",
  },
  input: {
    padding: "13px",
    background: "#0f172a",
    color: "white",
    border: "1px solid #475569",
    borderRadius: "8px",
    fontSize: "16px",
  },
  button: {
    padding: "13px",
    background: "#7c3aed",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tableBox: {
    marginTop: "25px",
    padding: "20px",
    background: "#1e293b",
    borderRadius: "12px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
  },
  resultBox: {
    marginTop: "25px",
    padding: "20px",
    background: "#1e293b",
    borderRadius: "12px",
  },
};