const EPSILON = "ε";

// Find all states reachable through epsilon transitions
function epsilonClosure(states) {
  const visited = new Map();
  const stack = [...states];

  while (stack.length > 0) {
    const state = stack.pop();

    if (visited.has(state.id)) continue;

    visited.set(state.id, state);

    for (const transition of state.transitions) {
      if (transition.symbol === EPSILON) {
        stack.push(transition.to);
      }
    }
  }

  return [...visited.values()];
}

// Find states reachable using a particular input symbol
function move(states, symbol) {
  const result = new Map();

  for (const state of states) {
    for (const transition of state.transitions) {
      if (transition.symbol === symbol) {
        result.set(transition.to.id, transition.to);
      }
    }
  }

  return [...result.values()];
}

// Convert NFA into DFA using subset construction
function convertNFAToDFA(nfa) {
  const alphabet = [
    ...new Set(
      nfa.states.flatMap(state =>
        state.transitions
          .filter(t => t.symbol !== EPSILON)
          .map(t => t.symbol)
      )
    )
  ].sort();

  const startSet = epsilonClosure([nfa.start]);

  function stateKey(states) {
    return states.map(s => s.id).sort((a, b) => a - b).join(",");
  }

  const dfaStates = [];
  const transitions = [];
  const queue = [];

  const startDFA = {
    id: "D0",
    nfaStates: startSet.map(s => s.id),
    accepting: startSet.some(s => s.id === nfa.accept.id)
  };

  dfaStates.push(startDFA);
  queue.push(startSet);

  const visited = new Map();
  visited.set(stateKey(startSet), "D0");

  while (queue.length > 0) {
    const currentSet = queue.shift();
    const currentKey = stateKey(currentSet);
    const fromId = visited.get(currentKey);

    for (const symbol of alphabet) {
      const moved = move(currentSet, symbol);
      const nextSet = epsilonClosure(moved);
      const nextKey = stateKey(nextSet);

      let toId;

      if (!visited.has(nextKey)) {
        toId = `D${dfaStates.length}`;
        visited.set(nextKey, toId);

        dfaStates.push({
          id: toId,
          nfaStates: nextSet.map(s => s.id),
          accepting: nextSet.some(s => s.id === nfa.accept.id)
        });

        queue.push(nextSet);
      } else {
        toId = visited.get(nextKey);
      }

      transitions.push({
        from: fromId,
        symbol,
        to: toId
      });
    }
  }

  return {
    alphabet,
    states: dfaStates,
    transitions,
    startState: "D0",
    finalStates: dfaStates
      .filter(state => state.accepting)
      .map(state => state.id)
  };
}

// Simulate a string on the generated DFA
function simulateDFA(dfa, input) {
  let current = dfa.startState;

  const trace = [{
    step: 0,
    input: "START",
    state: current
  }];

  let step = 0;

  for (const symbol of input) {
    const transition = dfa.transitions.find(
      t => t.from === current && t.symbol === symbol
    );

    if (!transition) {
      return {
        accepted: false,
        finalState: null,
        trace,
        reason: `No transition for symbol: ${symbol}`
      };
    }

    current = transition.to;

    trace.push({
      step: ++step,
      input: symbol,
      state: current
    });
  }

  return {
    accepted: dfa.finalStates.includes(current),
    finalState: current,
    trace
  };
}

export { convertNFAToDFA, simulateDFA };