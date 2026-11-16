export default function AutomataDiagram({ path = [] }) {
  const states = [
    { id: "q0", x: 100, y: 150 },
    { id: "q1", x: 300, y: 150 },
    { id: "q2", x: 500, y: 150 },
  ];

  const isActive = (id) => path.includes(id);

  return (
    <div style={{
      background: "#0f172a",
      padding: "20px",
      borderRadius: "14px",
      overflowX: "auto",
      color: "white"
    }}>
      <h2 style={{ color: "#a78bfa" }}>DFA State Diagram</h2>

      <svg viewBox="0 0 620 280" width="100%">
        <defs>
          <marker
            id="dfaArrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0 0 L0 6 L9 3 Z" fill="#a78bfa" />
          </marker>
        </defs>

        {/* Start arrow */}
        <path
          d="M15 150 L55 150"
          stroke="#a78bfa"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#dfaArrow)"
        />

        {/* Transitions */}
        <path
          d="M140 150 L255 150"
          stroke="#a78bfa"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#dfaArrow)"
        />

        <path
          d="M340 150 L455 150"
          stroke="#a78bfa"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#dfaArrow)"
        />

        {/* Self loops */}
        <path
          d="M80 110 C40 35 160 35 120 110"
          stroke="#a78bfa"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#dfaArrow)"
        />

        <path
          d="M280 110 C240 35 360 35 320 110"
          stroke="#a78bfa"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#dfaArrow)"
        />

        {/* Labels */}
        <text x="195" y="135" fill="white" textAnchor="middle">1</text>
        <text x="395" y="135" fill="white" textAnchor="middle">0</text>
        <text x="100" y="45" fill="white" textAnchor="middle">0</text>
        <text x="300" y="45" fill="white" textAnchor="middle">1</text>

        {/* States */}
        {states.map((state) => (
          <g key={state.id}>
            <circle
              cx={state.x}
              cy={state.y}
              r="40"
              fill={isActive(state.id) ? "#166534" : "#312e81"}
              stroke={isActive(state.id) ? "#4ade80" : "#a78bfa"}
              strokeWidth="3"
            />

            {state.id === "q2" && (
              <circle
                cx={state.x}
                cy={state.y}
                r="33"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
              />
            )}

            <text
              x={state.x}
              y={state.y + 6}
              textAnchor="middle"
              fill="white"
              fontSize="18"
            >
              {state.id}
            </text>
          </g>
        ))}

        <text x="100" y="220" fill="#94a3b8" textAnchor="middle">
          Start State
        </text>

        <text x="500" y="220" fill="#94a3b8" textAnchor="middle">
          Final State
        </text>
      </svg>

      <p style={{ color: "#cbd5e1" }}>
        Green = Visited State | Double Circle = Final State
      </p>
    </div>
  );
}