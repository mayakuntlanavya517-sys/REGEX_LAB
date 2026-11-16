import { useState } from "react";

function RegexLibrary() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const patterns = [
    {
      name: "Email Validation",
      category: "Validation",
      regex: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
      description: "Validates common email address formats."
    },
    {
      name: "Indian Mobile Number",
      category: "Phone",
      regex: "^[6-9][0-9]{9}$",
      description: "Validates a 10-digit Indian mobile number."
    },
    {
      name: "Strong Password",
      category: "Security",
      regex: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
      description: "At least 8 characters with uppercase, lowercase, number and special character."
    },
    {
      name: "Date (DD-MM-YYYY)",
      category: "Date",
      regex: "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-[0-9]{4}$",
      description: "Checks the DD-MM-YYYY date format."
    },
    {
      name: "URL Validation",
      category: "Web",
      regex: "^https?:\\/\\/[\\w.-]+\\.[A-Za-z]{2,}.*$",
      description: "Matches common HTTP and HTTPS URLs."
    },
    {
      name: "Digits Only",
      category: "General",
      regex: "^[0-9]+$",
      description: "Accepts strings containing only digits."
    },
    {
      name: "Alphabet Only",
      category: "General",
      regex: "^[A-Za-z]+$",
      description: "Accepts English alphabet characters only."
    },
    {
      name: "PIN Code",
      category: "General",
      regex: "^[1-9][0-9]{5}$",
      description: "Checks a six-digit Indian PIN code format."
    }
  ];

  const filteredPatterns = patterns.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  async function copyRegex(regex, name) {
    try {
      await navigator.clipboard.writeText(regex);
      setCopied(name);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      setCopied("Copy failed");
    }
  }

  return (
    <div className="regex-studio">

      <div className="studio-heading">
        <div>
          <h1>Regex Library</h1>
          <p>Explore reusable regular expression patterns</p>
        </div>
        <span className="engine-status">PATTERN LIBRARY</span>
      </div>

      <div className="editor-panel">
        <label>SEARCH PATTERNS</label>

        <input
          className="regex-input"
          placeholder="Search email, phone, password..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <p>{filteredPatterns.length} patterns available</p>
      </div>

      <div className="library-grid">
        {filteredPatterns.map((item, index) => (
          <div className="stat-card" key={index}>
            <span>{item.category}</span>

            <h3>{item.name}</h3>

            <p>{item.description}</p>

            <pre className="regex-code">{item.regex}</pre>

            <button
              className="analyze-button"
              onClick={() => copyRegex(item.regex, item.name)}
            >
              {copied === item.name ? "Copied!" : "Copy Regex"}
            </button>
          </div>
        ))}

        {filteredPatterns.length === 0 && (
          <p>No matching patterns found.</p>
        )}
      </div>

    </div>
  );
}

export default RegexLibrary;