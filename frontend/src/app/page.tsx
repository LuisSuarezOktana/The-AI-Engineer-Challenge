'use client';
import React, { useState, useEffect, useRef } from "react";

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
  const [darkMode, setDarkMode] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [messages, loading]);

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
      // Format conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      }));
      
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          developer_message: "You are a helpful AI assistant.",
          user_message: userMsg.content,
          conversation_history: conversationHistory,
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
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-pink-100 via-blue-100 to-green-100'
    }`}>
      
      {/* Dark Mode Toggle - Top Right of Screen */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-4 right-4 w-12 h-6 rounded-full transition-all duration-300 flex items-center p-1 z-50 ${
          darkMode 
            ? 'bg-blue-600 justify-end' 
            : 'bg-gray-300 justify-start'
        }`}
        aria-label="Toggle dark mode"
      >
        <div className={`w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${
          darkMode 
            ? 'bg-yellow-300' 
            : 'bg-white'
        }`}>
          {darkMode ? '☀️' : '🌙'}
        </div>
      </button>

      <div className={`w-full max-w-2xl rounded-xl shadow-xl border transition-colors duration-300 ${
        darkMode 
          ? 'border-gray-600 bg-gray-800/90 backdrop-blur-md' 
          : 'border-gray-200 bg-white/80 backdrop-blur-md'
      } p-6 sm:p-10 flex flex-col items-start font-mono relative`}>
        
        <div className="w-full flex items-center mb-4">
          <span className="h-3 w-3 rounded-full bg-red-400 mr-2"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-300 mr-2"></span>
          <span className="h-3 w-3 rounded-full bg-green-400"></span>
        </div>
        <div 
          ref={chatContainerRef}
          className={`w-full flex-1 overflow-y-auto mb-4 min-h-[200px] max-h-96 p-2 rounded border scroll-smooth transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700/60 border-gray-600' 
              : 'bg-white/60 border-gray-100'
          }`}
        >
          {messages.length === 0 && (
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Start the conversation!</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className={`${msg.role === "user" ? "text-blue-400" : "text-green-500"}`}>
                {msg.role === "user" ? "You" : "AI"}
              </span>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>:~$</span>
              <span className={`ml-2 whitespace-pre-line ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{msg.content}</span>
            </div>
          ))}
          {loading && (
            <div className="mb-2">
              <span className="text-green-500">AI</span>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>:~$</span>
              <span className={`ml-2 animate-pulse ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Generating response</span>
              <span className={`ml-1 animate-blink ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>|</span>
            </div>
          )}
        </div>
        <form onSubmit={sendMessage} className="w-full flex flex-col gap-2">
          <input
            type="password"
            className={`w-full rounded px-3 py-2 border text-sm transition-colors duration-300 ${
              darkMode 
                ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400' 
                : 'border-gray-200 bg-pink-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-pink-200'
            } focus:outline-none`}
            placeholder="OpenAI API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            autoComplete="off"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              className={`flex-1 rounded px-3 py-2 border text-sm transition-colors duration-300 ${
                darkMode 
                  ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400' 
                  : 'border-gray-200 bg-blue-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-200'
              } focus:outline-none`}
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              required
              ref={inputRef}
            />
            <button
              type="submit"
              className={`rounded px-4 py-2 font-semibold transition-colors duration-300 disabled:opacity-50 ${
                darkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-green-200 text-green-900 hover:bg-green-300'
              }`}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </form>
        {error && <div className={`mt-2 font-medium ${darkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</div>}
      </div>
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          display: inline-block;
          width: 1ch;
          animation: blink 1s steps(1) infinite;
        }
      `}</style>
    </div>
  );
}
