import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! How can I help you today?" }]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
        }),
      });

      const data = await response.json();
      const reply = data.choices?.[0]?.message;
      if (reply) {
        setMessages([...newMessages, reply]);
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white shadow-xl rounded-lg z-50 flex flex-col border border-gray-300">
          <div className="px-4 py-2 font-semibold bg-indigo-600 text-white rounded-t-lg">Chat with us</div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-xs ${msg.role === "user" ? "bg-indigo-100 self-end" : "bg-gray-100 self-start"}`}
              >
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}