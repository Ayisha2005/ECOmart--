import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { queryGoogleGemini } from '../../services/geminiAiService';
import { Sparkles, MessageSquare, X, Send, Bot, RefreshCw, Camera, Trash2, Globe, Image } from 'lucide-react';

export const GoogleEcoAiAssistant = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [attachedMime, setAttachedMime] = useState('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 வணக்கம்! I am Google Gemini AI. Ask me ANYTHING in Tamil, Tanglish, English, Hindi, or any language! You can also upload any image for AI vision analysis. 📷✨'
    }
  ]);

  // HIDE AI Assistant ON ALL LOGIN & REGISTRATION PAGES!
  const currentPath = location.pathname.toLowerCase();
  const isAuthPage =
    currentPath === '/register' ||
    currentPath === '/' ||
    currentPath.includes('/login') ||
    currentPath.includes('/register');

  if (isAuthPage) {
    return null;
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedMime(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (queryText = inputQuery) => {
    const textToSend = queryText.trim();
    if ((!textToSend && !attachedImage) || isLoading) return;

    const currentImg = attachedImage;
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // User Message Object
    const userMsg = {
      sender: 'user',
      text: textToSend || '📷 Attached image for AI analysis',
      image: currentImg
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    // Call Google Gemini Multimodal AI Service
    const result = await queryGoogleGemini(textToSend, currentImg, attachedMime);
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

  return (
    <>
      {/* Floating Toggle Button Bottom Right (Only on Internal Dashboards) */}
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
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[530px] backdrop-blur-2xl animate-fadeIn">
          
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Google Gemini AI</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-mono border border-emerald-500/30 uppercase">
                    Multimodal
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Any Language (தமிழ் / English / Etc.)</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Language Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => handleSendMessage("வணக்கம்! தமிழ்ல உதவி பண்ண முடியுமா?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-[10px] font-bold whitespace-nowrap cursor-pointer"
            >
              🇮🇳 தமிழ் (Tamil)
            </button>
            <button
              onClick={() => handleSendMessage("Plastic PET scrap vilai enna in India?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-[10px] font-bold whitespace-nowrap cursor-pointer"
            >
              💬 Tanglish Query
            </button>
            <button
              onClick={() => handleSendMessage("How to check copper scrap purity?")}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 text-[10px] font-bold whitespace-nowrap cursor-pointer"
            >
              🌐 English
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
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="User Attachment"
                      className="w-48 h-32 object-cover rounded-xl mb-2 border border-slate-700 shadow-sm"
                    />
                  )}
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
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-slate-800/80 p-3 rounded-2xl max-w-[75%] border border-slate-700">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Google Gemini AI is processing image & text...</span>
              </div>
            )}
          </div>

          {/* Attached Image Preview Bar */}
          {attachedImage && (
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={attachedImage} alt="Attached" className="w-10 h-10 object-cover rounded-lg border border-slate-700" />
                <span className="text-[11px] font-bold text-emerald-400">Image Attached for AI Vision</span>
              </div>
              <button
                onClick={handleRemoveImage}
                className="p-1 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 cursor-pointer transition-all"
              title="Attach Scrap Image for AI Vision Analysis"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI anything / என்ன கேள்வி வேண்டுமானாலும் கேளுங்கள்..."
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-emerald-500 outline-hidden placeholder:text-slate-500"
            />

            <button
              type="submit"
              disabled={isLoading || (!inputQuery.trim() && !attachedImage)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold cursor-pointer disabled:opacity-50 transition-all active:scale-95"
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
