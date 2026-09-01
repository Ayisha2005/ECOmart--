import React, { useState } from 'react';
import { queryGoogleGemini } from '../../services/geminiAiService';
import { Sparkles, MessageSquare, X, Send, Bot, RefreshCw, Zap, CheckCircle2 } from 'lucide-react';

export const GoogleEcoAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hello! I am your Google Gemini AI Eco Assistant. Ask me anything about Indian scrap pricing, material grading, or green transport logistics!'
    }
  ]);

  const handleSendMessage = async (queryText = inputQuery) => {
    const textToSend = queryText.trim();
    if (!textToSend || isLoading) return;

    // Add User Message
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setInputQuery('');
    setIsLoading(true);

    // Call Google Gemini AI Service
    const result = await queryGoogleGemini(textToSend);
    setIsLoading(false);

    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: result.answer,
        source: result.source
      }
    ]);
  };

  const handleQuickPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <>
      {/* Floating Toggle Button Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 rounded-full font-extrabold text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer transition-all hover:scale-105 active:scale-95 animate-bounce"
        >
          <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
          <span>Ask Google AI</span>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px] backdrop-blur-2xl animate-fadeIn">
          
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Google Gemini AI</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-mono border border-emerald-500/30 uppercase">Free AI</span>
                </h3>
                <p className="text-[10px] text-slate-400">Eco Scrap Trading & Logistics Assistant</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleQuickPrompt("Check PET plastic scrap market rate in Chennai")}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[10px] font-bold whitespace-nowrap cursor-pointer"
            >
              💰 Plastic Rates
            </button>
            <button
              onClick={() => handleQuickPrompt("How to compress cardboard bales for transport?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-[10px] font-bold whitespace-nowrap cursor-pointer"
            >
              📦 Cardboard Bales
            </button>
            <button
              onClick={() => handleQuickPrompt("How to check copper wire scrap purity grade?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[10px] font-bold whitespace-nowrap cursor-pointer"
            >
              ⚡ Copper Wire
            </button>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold rounded-tr-none shadow-md'
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.source && (
                  <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                    Powered by {msg.source}
                  </span>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-slate-800/80 p-3 rounded-2xl max-w-[70%] border border-slate-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Google Gemini AI is analyzing query...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Google AI about scrap rates or transport..."
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-emerald-500 outline-hidden placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold cursor-pointer disabled:opacity-50 transition-all active:scale-95"
            >
              <Send className="w-4 h-4 text-slate-950" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default GoogleEcoAiAssistant;
