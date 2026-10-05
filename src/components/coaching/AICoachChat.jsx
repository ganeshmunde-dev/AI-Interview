// src/components/coaching/AICoachChat.jsx
import { useState } from 'react';
import { HiOutlineChatAlt, HiOutlinePaperAirplane, HiOutlineSparkles, HiOutlineUser } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { sendCoachChatMessage } from '@/services/coachingService';

const SUGGESTED_QUESTIONS = [
  'How can I improve my interview scores?',
  'Why am I losing points on depth and trade-offs?',
  'Give me a high-frequency mock question to practice.',
  'How should I structure my answers under time pressure?',
];

export default function AICoachChat({
  role = 'Frontend Developer',
  overallScore = 70,
  weakSkills = [],
  strongSkills = [],
  className = '',
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'coach',
      text: `Hello! I'm your AI Interview Coach for ${role}. Ask me anything about improving your technical answers, structuring explanations, or mastering your weak areas.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendCoachChatMessage({
        message: messageText,
        role,
        overallScore,
        weakSkills,
        strongSkills,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: response.reply,
          source: response.source,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: "I'm having a brief connection issue, but here is a quick tip: structure answers with direct definitions, clear code examples, and explicit trade-offs.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineChatAlt className="text-indigo-400" /> Interactive AI Coach Chat
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Ask targeted questions and receive advice based on your historical evaluations
          </p>
        </div>
        <span className="badge badge-primary text-[10px] font-semibold uppercase">
          Live Assistant
        </span>
      </div>

      {/* Messages Stream */}
      <div className="space-y-3 max-h-72 overflow-y-auto p-3 rounded-xl bg-muted-app/60 border border-app mb-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.sender === 'coach' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <HiOutlineSparkles size={14} />
              </div>
            )}
            <div
              className={`p-3 rounded-xl text-xs max-w-[80%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white'
                  : 'bg-app-card border border-app text-app-primary'
              }`}
            >
              {m.text}
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-muted-app text-app-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <HiOutlineUser size={14} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>AI Coach is formulating advice...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-app-card border border-app hover:border-indigo-500/30 text-app-secondary hover:text-indigo-400 transition-all cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI coach a question..."
          className="input-field text-xs py-2 flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiOutlinePaperAirplane size={14} className="rotate-90" />
          <span>Send</span>
        </button>
      </form>
    </Card>
  );
}
