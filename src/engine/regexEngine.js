const EPSILON = "ε";

function tokenize(pattern) {
  const tokens = [...pattern].filter(
    (char) => !/\s/.test(char)
  );

  if (tokens.length === 0) {
    throw new Error("Regular expression cannot be empty.");
  }

  const allowedOperators = ["|", "*", "+", "?", "(", ")"];

  for (const token of tokens) {
    if (
      !allowedOperators.includes(token) &&
      token !== EPSILON &&
      token !== "∅" &&
      (token === "\\" || token === ".")
    ) {
      throw new Error(`Unsupported symbol: ${token}`);
    }
  }

  const isEnd = (token) =>
    token !== undefined &&
    (token === ")" || ["*", "+", "?"].includes(token) ||
      (!["|", "("].includes(token)));

  const isStart = (token) =>
    token !== undefined &&
    (token === "(" ||
      (!["|", ")", "*", "+", "?"].includes(token)));

  const expanded = [];

  for (let i = 0; i < tokens.length; i++) {
    const current = tokens[i];
    const previous = tokens[i - 1];

    if (isEnd(previous) && isStart(current)) {
      expanded.push("·");
    }

    expanded.push(current);
  }

  return expanded;
}

function toPostfix(pattern) {
  const tokens = tokenize(pattern);
  const output = [];
  const operators = [];

  const precedence = {
    "|": 1,
    "·": 2
  };

  for (const token of tokens) {
    if (
      !["|", "·", "(", ")", "*", "+", "?"].includes(token)
    ) {
      output.push(token);
    } else if (token === "(") {
      operators.push(token);
    } else if (token === ")") {
      while (
        operators.length &&
        operators[operators.length - 1] !== "("
      ) {
        output.push(operators.pop());
      }

      if (!operators.length) {
        throw new Error("Unmatched closing parenthesis.");
      }

      operators.pop();
    } else if (["*", "+", "?"].includes(token)) {
      if (!output.length) {
        throw new Error("Unary operator has no operand.");
      }
      output.push(token);
    } else {
      while (
        operators.length &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >=
          precedence[token]
      ) {
        output.push(operators.pop());
      }

      operators.push(token);
    }
  }

  while (operators.length) {
    const op = operators.pop();

    if (op === "(") {
      throw new Error("Unmatched opening parenthesis.");
    }

    output.push(op);
  }

  let depth = 0;

  for (const token of output) {
    if (["|", "·"].includes(token)) {
      if (depth < 2) {
        throw new Error("Invalid expression: missing operand.");
      }
      depth--;
    } else if (["*", "+", "?"].includes(token)) {
      if (depth < 1) {
        throw new Error("Invalid unary operator.");
      }
    } else {
      depth++;
    }
  }

  if (depth !== 1) {
    throw new Error("Invalid regular expression.");
  }

  return output;
}

function buildNFA(pattern) {
  const postfix = toPostfix(pattern);

  let nextId = 0;
  const stack = [];

  function newState() {
    return {
      id: nextId++,
      transitions: []
    };
  }

  function connect(from, to, symbol = EPSILON) {
    from.transitions.push({ symbol, to });
  }

  function literal(symbol) {
    const start = newState();
    const end = newState();

    if (symbol === EPSILON) {
      connect(start, end);
    } else if (symbol !== "∅") {
      connect(start, end, symbol);
    }

    return { start, end };
  }

  for (const token of postfix) {
    if (!["|", "·", "*", "+", "?"].includes(token)) {
      stack.push(literal(token));
      continue;
    }

    if (token === "·") {
      const right = stack.pop();
      const left = stack.pop();

      connect(left.end, right.start);
      stack.push({
        start: left.start,
        end: right.end
      });
    }

    if (token === "|") {
      const right = stack.pop();
      const left = stack.pop();

      const start = newState();
      const end = newState();

      connect(start, left.start);
      connect(start, right.start);
      connect(left.end, end);
      connect(right.end, end);

      stack.push({ start, end });
    }

    if (token === "*") {
      const fragment = stack.pop();

      const start = newState();
      const end = newState();

      connect(start, fragment.start);
      connect(start, end);
      connect(fragment.end, fragment.start);
      connect(fragment.end, end);

      stack.push({ start, end });
    }

    if (token === "+") {
      const fragment = stack.pop();

      const start = newState();
      const end = newState();

      connect(start, fragment.start);
      connect(fragment.end, fragment.start);
      connect(fragment.end, end);

      stack.push({ start, end });
    }

    if (token === "?") {
      const fragment = stack.pop();

      const start = newState();
      const end = newState();

      connect(start, fragment.start);
      connect(start, end);
      connect(fragment.end, end);

      stack.push({ start, end });
    }
  }

  const result = stack.pop();

  return {
    start: result.start,
    accept: result.end,
    states: collectStates(result.start)
  };
}

function collectStates(start) {
  const visited = new Map();
  const queue = [start];

  while (queue.length > 0) {
    const state = queue.shift();

    if (visited.has(state.id)) {
      continue;
    }

    visited.set(state.id, state);

    for (const transition of state.transitions) {
      queue.push(transition.to);
    }
  }

  return [...visited.values()];
}
function epsilonClosure(states) {
  const result = new Map();
  const stack = [...states];

  for (const state of states) {
    result.set(state.id, state);
  }

  while (stack.length) {
    const current = stack.pop();

    for (const transition of current.transitions) {
      if (
        transition.symbol === EPSILON &&
        !result.has(transition.to.id)
      ) {
        result.set(transition.to.id, transition.to);
        stack.push(transition.to);
      }
    }
  }

  return [...result.values()];
}

function simulateNFA(nfa, input) {
  let current = epsilonClosure([nfa.start]);

  const trace = [{
    step: 0,
    input: "START",
    states: current.map((s) => s.id)
  }];

  let step = 0;

  for (const symbol of input) {
    const next = [];

    for (const state of current) {
      for (const transition of state.transitions) {
        if (transition.symbol === symbol) {
          next.push(transition.to);
        }
      }
    }

    current = epsilonClosure(next);
    step++;

    trace.push({
      step,
      input: symbol,
      states: current.map((s) => s.id)
    });
  }

  const accepted = current.some(
    (state) => state.id === nfa.accept.id
  );

  return {
    accepted,
    trace,
    finalStates: current.map((s) => s.id)
  };
}

function analyzeRegex(pattern, inputs) {
  const nfa = buildNFA(pattern);

  const results = inputs.map((input) => ({
    input,
    ...simulateNFA(nfa, input)
  }));

  const transitions = nfa.states.flatMap((state) =>
    state.transitions.map((transition) => ({
      from: state.id,
      symbol: transition.symbol,
      to: transition.to.id
    }))
  );

  return {
    postfix: toPostfix(pattern),
    stateCount: nfa.states.length,
    startState: nfa.start.id,
    acceptState: nfa.accept.id,
    transitions,
    results
  };
}

export { analyzeRegex, buildNFA, simulateNFA };