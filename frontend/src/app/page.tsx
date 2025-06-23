'use client';
import React, { useState, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!input.trim() || !apiKey.trim()) {
      setError("Please enter a message and your OpenAI API key.");
      return;
    }
    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: "You are a helpful AI assistant.",
          user_message: userMsg.content,
          api_key: apiKey,
        }),
      });
      if (!res.ok) throw new Error("API error: " + res.statusText);
      const aiText = await res.text();
      setMessages((prev) => [...prev, { role: "ai", content: aiText }]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-100 to-green-100">
      <div className="w-full max-w-2xl rounded-xl shadow-xl border border-gray-200 bg-white/80 backdrop-blur-md p-6 sm:p-10 flex flex-col items-start font-mono">
        <div className="w-full flex items-center mb-4">
          <span className="h-3 w-3 rounded-full bg-red-400 mr-2"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-300 mr-2"></span>
          <span className="h-3 w-3 rounded-full bg-green-400"></span>
        </div>
        <div className="w-full flex-1 overflow-y-auto mb-4 min-h-[200px] max-h-96 p-2 bg-white/60 rounded border border-gray-100">
          {messages.length === 0 && (
            <div className="text-gray-400">Start the conversation!</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className={msg.role === "user" ? "text-blue-400" : "text-green-500"}>
                {msg.role === "user" ? "You" : "AI"}
              </span>
              <span className="text-gray-500">:~$</span>
              <span className="ml-2 whitespace-pre-line">{msg.content}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="w-full flex flex-col gap-2">
          <input
            type="password"
            className="w-full rounded px-3 py-2 border border-gray-200 bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200 text-sm mb-1"
            placeholder="OpenAI API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            autoComplete="off"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded px-3 py-2 border border-gray-200 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="rounded px-4 py-2 bg-green-200 text-green-900 font-semibold hover:bg-green-300 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </form>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}
