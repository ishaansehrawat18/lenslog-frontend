import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";
import { chatWithAI } from "../../services/aiService.js";
import { useAuth } from "../../hooks/useAuth.js";

function AIChatWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm the LensLog assistant. Ask me anything about photography or the app." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Don't show the widget at all for logged-out visitors
  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setSending(true);

    try {
      const reply = await chatWithAI(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't respond right now. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="mb-3 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-black">LensLog Assistant</h3>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                      msg.role === "user" ? "bg-black text-white" : "bg-gray-100 text-black"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-gray-100 px-3 py-2 text-xs text-gray-400">Thinking...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-2">
              <input
                type="text"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-black focus:bg-white"
              />
              <button
                type="submit"
                disabled={sending}
                aria-label="Send"
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-60"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg hover:bg-gray-800"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </motion.button>
    </div>
  );
}

export default AIChatWidget;