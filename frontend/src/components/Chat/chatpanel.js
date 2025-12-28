import React, { useState } from "react";

function ChatPanel({ token }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const myQuestion = question;
    setMessages(prev => [...prev, { role: "user", content: myQuestion }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/qa/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ question: myQuestion })
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No answer returned.",
          references: data.references || []
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Error asking question." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 14, borderRadius: 8 }}>
      <div
        style={{
          height: 250,
          overflowY: "auto",
          marginBottom: 10,
          background: "#f7f7f7",
          padding: 10,
          borderRadius: 6
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {m.role === "user" && (
              <div style={{ textAlign: "right" }}>
                <b>You:</b> {m.content}
              </div>
            )}
            {m.role === "assistant" && (
              <div>
                <b>AI:</b> {m.content}
                {m.references?.length > 0 &&
                  m.content?.includes("I couldn't find that") && (
                    <div
                      style={{
                        marginTop: 6,
                        color: "#666",
                        fontSize: 13,
                        background: "#fafafa",
                        border: "1px solid #eee",
                        borderRadius: 6,
                        padding: 8
                      }}
                    >
                      <b>Sources checked:</b>
                      <ul style={{ marginTop: 4 }}>
                        {m.references.map((r, idx) => (
                          <li key={idx}>
                            <em>{r.excerpt}</em>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your question..."
        value={question}
        onChange={e => setQuestion(e.target.value)}
        style={{ width: "80%", padding: 8 }}
      />

      <button
        onClick={askQuestion}
        disabled={loading}
        style={{ marginLeft: 8 }}
        className="ask-btn"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}

export default ChatPanel;
