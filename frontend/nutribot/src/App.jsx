import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I’m NutriBot 🥗—ask me anything about nutrition.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dark, setDark] = useState(false);

  const formatReply = (text) => {
    if (!text) return ["(empty response)"];
    const parts = text
      .split(/\r?\n|(?:\d+\.\s)|(?:-\s)|(?:•\s)/g)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length >= 2 ? parts : [text.trim()];
  };

  const sendMessage = async () => {
    const q = input.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { sender: "user", text: q }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();
      const reply =
        typeof data?.reply === "string"
          ? data.reply
          : "⚠️ No response from server.";
      const chunks = formatReply(reply);


      setMessages((prev) => [...prev, { sender: "bot", text: chunks }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ sender: "bot", text: "Chat cleared. Ask me anything! 🧼" }]);
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      
      <header className="topbar">
        <div className="brand">✨ NutriBot</div>
        <div className="actions">
          <button className="btn ghost" onClick={clearChat}>
            Clear
          </button>
          <button className="btn ghost" onClick={() => setDark((d) => !d)}>
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      <main className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.sender}`}>
            {Array.isArray(m.text) ? (
              <ul className="points">
                {m.text.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            ) : (
              m.text
            )}
          </div>
        ))}

        {isTyping && (
          <div className="bubble bot typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </main>

      
      <footer className="inputrow">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your nutrition question…"
        />
        <button className="btn send" onClick={sendMessage}>
          ➤
        </button>
      </footer>
    </div>
  );
}
