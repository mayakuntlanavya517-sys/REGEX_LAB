import { useState } from "react";

import {
  analyzeRegex,
  buildNFA
} from "../engine/regexEngine";

import {
  convertNFAToDFA,
  simulateDFA
} from "../engine/dfaEngine";

import AutomataDiagram from "../components/AutomataDiagram.jsx";

export default function RegexStudio() {
  const [pattern, setPattern] = useState("(a|b)*abb");

  const [testInput, setTestInput] = useState(
    "abb\naabb\nbabb\nab\naba"
  );

  const [analysis, setAnalysis] = useState(null);
  const [nfa, setNfa] = useState(null);
  const [dfa, setDfa] = useState(null);
  const [error, setError] = useState("");

  function handleAnalyze() {
    try {
      const inputs = testInput
        .split("\n")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const newNFA = buildNFA(pattern);

      const result = analyzeRegex(pattern, inputs);

      const dfaResult = convertNFAToDFA(newNFA);

      setNfa(newNFA);
      setAnalysis(result);
      setDfa(dfaResult);
      setError("");

    } catch (err) {
      setAnalysis(null);
      setNfa(null);
      setDfa(null);
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="regex-studio">

      {/* HEADER */}

      <div className="studio-heading">
        <div>
          <h1>Regex Studio</h1>
          <p>
            Regular Expression and Automata Engineering
          </p>
        </div>

        <span className="engine-status">
          ENGINE READY
        </span>
      </div>

      {/* REGEX INPUT */}

      <div className="editor-panel">

        <label>REGULAR EXPRESSION</label>

        <input
          className="regex-input"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="Enter regex pattern"
        />

        <p className="operator-list">
          Supported operators: | * + ? ( )
        </p>

        <label>TEST STRINGS (ONE PER LINE)</label>

        <textarea
          className="test-input"
          rows={5}
          value={testInput}
          onChange={e => setTestInput(e.target.value)}
        />

        <button
          className="analyze-button"
          onClick={handleAnalyze}
        >
          Compile & Generate Automata
        </button>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

      </div>

      {/* GENERATED RESULTS */}

      {analysis && nfa && dfa && (
        <>

          {/* STATISTICS */}

          <div className="engine-stats">

            <div className="engine-card">
              <span>NFA STATES</span>
              <h2>{analysis.stateCount}</h2>
            </div>

            <div className="engine-card">
              <span>NFA TRANSITIONS</span>
              <h2>{analysis.transitions.length}</h2>
            </div>

            <div className="engine-card">
              <span>DFA STATES</span>
              <h2>{dfa.states.length}</h2>
            </div>

            <div className="engine-card">
              <span>DFA FINAL STATES</span>
              <h2>{dfa.finalStates.length}</h2>
            </div>

          </div>

          {/* STRING VALIDATION */}

          <div className="result-panel">

            <h2>String Validation Results</h2>

            {analysis.results.map((item, index) => (
              <div
                className="result-row"
                key={index}
              >
                <span>{item.input}</span>

                <strong
                  className={
                    item.accepted
                      ? "accepted"
                      : "rejected"
                  }
                >
                  {item.accepted
                    ? "ACCEPTED"
                    : "REJECTED"}
                </strong>

              </div>
            ))}

          </div>

          {/* POSTFIX */}

          <div className="result-panel">

            <h2>Postfix Expression</h2>

            <code className="postfix">
              {analysis.postfix.join(" ")}
            </code>

          </div>

          {/* NFA TRANSITION TABLE */}

          <div className="result-panel">

            <h2>NFA Transition Table</h2>

            <div className="table-scroll">

              <table className="transition-table">

                <thead>
                  <tr>
                    <th>From</th>
                    <th>Symbol</th>
                    <th>To</th>
                  </tr>
                </thead>

                <tbody>
                  {analysis.transitions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.from}</td>
                      <td>{item.symbol}</td>
                      <td>{item.to}</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

          {/* NFA VISUAL DIAGRAM */}

          <div className="result-panel">

            <h2>NFA Visual Diagram</h2>

            <AutomataDiagram
              title="NFA"
              states={nfa.states}
              transitions={analysis.transitions}
              startState={nfa.start.id}
              acceptState={nfa.accept.id}
            />

          </div>

          {/* DFA SUBSET CONSTRUCTION */}

          <div className="result-panel">

            <h2>DFA Subset Construction Algorithm</h2>

            <p>
              <strong>Alphabet:</strong>{" "}
              {dfa.alphabet.join(", ")}
            </p>

            <p>
              <strong>Start State:</strong>{" "}
              {dfa.startState}
            </p>

            <p>
              <strong>Final States:</strong>{" "}
              {dfa.finalStates.join(", ") || "None"}
            </p>

            <div className="table-scroll">

              <table className="transition-table">

                <thead>
                  <tr>
                    <th>DFA State</th>
                    <th>Equivalent NFA States</th>
                    <th>Final State?</th>
                  </tr>
                </thead>

                <tbody>
                  {dfa.states.map(state => (
                    <tr key={state.id}>

                      <td>{state.id}</td>

                      <td>
                        {"{"}
                        {state.nfaStates.join(", ")}
                        {"}"}
                      </td>

                      <td>
                        {state.accepting ? "YES" : "NO"}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

          {/* DFA TRANSITION TABLE */}

          <div className="result-panel">

            <h2>DFA Transition Table</h2>

            <div className="table-scroll">

              <table className="transition-table">

                <thead>
                  <tr>
                    <th>From State</th>
                    <th>Input</th>
                    <th>To State</th>
                  </tr>
                </thead>

                <tbody>
                  {dfa.transitions.map((item, index) => (
                    <tr key={index}>
                      <td>{item.from}</td>
                      <td>{item.symbol}</td>
                      <td>{item.to}</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </div>

          {/* DFA VISUAL DIAGRAM */}

          <div className="result-panel">

            <h2>DFA Visual Diagram</h2>

            <AutomataDiagram
              title="DFA"
              states={dfa.states}
              transitions={dfa.transitions}
              startState={dfa.startState}
              acceptState={dfa.finalStates}
            />

            <p className="operator-list">
              Green double circles indicate final states.
              Start state: {dfa.startState}
              {" | "}
              Final states: {dfa.finalStates.join(", ") || "None"}
            </p>

          </div>

          {/* DFA SIMULATION TRACE */}

          <div className="result-panel">

            <h2>DFA Simulation Trace</h2>

            {analysis.results.map((item, index) => {

              const simulation = simulateDFA(
                dfa,
                item.input
              );

              return (

                <div
                  className="trace-card"
                  key={index}
                >

                  <h3>
                    Input: {item.input}
                  </h3>

                  {simulation.trace.map(step => (

                    <p key={step.step}>
                      Step {step.step}
                      {" — "}
                      {step.input}
                      {": "}
                      {step.state}
                    </p>

                  ))}

                  <strong
                    className={
                      simulation.accepted
                        ? "accepted"
                        : "rejected"
                    }
                  >
                    {simulation.accepted
                      ? "ACCEPTED"
                      : "REJECTED"}
                  </strong>

                  {simulation.reason && (
                    <p>{simulation.reason}</p>
                  )}

                </div>

              );

            })}

          </div>

        </>
      )}

    </div>
  );
}