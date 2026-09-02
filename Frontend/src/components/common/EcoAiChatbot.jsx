import React, { useState, useRef, useEffect } from 'react';
import { askEcoAi } from '../../services/ecoAiService';
import { Bot, Send, X, Paperclip, Image as ImageIcon, Trash2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export const EcoAiChatbot = ({ currentProduct = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [attachedImage, setAttachedImage] = useState(null); // base64 string
  const [attachedImageMime, setAttachedImageMime] = useState('image/jpeg');
  const [attachedImageName, setAttachedImageName] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'model',
      text: '👋 Vanakkam! I am ECO AI, powered by Google Gemini. Ask me ANYTHING about eco-friendly products, scrap prices, or website navigation in Tamil, Tanglish, English, Hindi, Malayalam, Telugu, or any language! You can also attach photos for AI vision analysis. 📷✨',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Handle Image Upload & Convert to Base64
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      alert('Please upload a JPG, JPEG, PNG, or WEBP image format.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('File size too large! Please upload an image under 8MB.');
      return;
    }

    setAttachedImageMime(file.type || 'image/jpeg');
    setAttachedImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    setAttachedImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: '👋 Chat cleared! How can ECO AI help you today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    handleRemoveImage();
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const textToSend = inputMessage.trim();
    const currentImg = attachedImage;
    const currentImgMime = attachedImageMime;

    if (!textToSend && !currentImg) return;

    // Build user message item
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      image: currentImg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update UI immediately
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    handleRemoveImage();
    setLoading(true);

    // Build chat history context (last 10 turns)
    const historyPayload = messages
      .filter(m => m.text)
      .slice(-10)
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.text
      }));

    // Call Secure Backend Google Gemini API
    const result = await askEcoAi({
      message: textToSend,
      history: historyPayload,
      image: currentImg,
      imageMime: currentImgMime,
      productContext: currentProduct
    });

    setLoading(false);

    // Append AI response
    const aiMsg = {
      id: `ai-${Date.now()}`,
      role: 'model',
      text: result.answer || "Sorry, ECO AI is temporarily unavailable. Please try again.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-extrabold text-sm rounded-full shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.6)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-emerald-300/40"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-emerald-100 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span>🤖 ECO AI</span>
          <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-950/80 text-emerald-300 rounded-full border border-emerald-400/40 uppercase tracking-wider">
            Gemini
          </span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-96 h-[520px] max-h-[85vh] bg-slate-950 text-white rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-xl">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-500/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-wide">ECO AI</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] font-extrabold rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Your Official ECO MART AI Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Page Context Banner */}
          {currentProduct && (
            <div className="px-3.5 py-1.5 bg-emerald-950/60 border-b border-emerald-500/20 text-[11px] flex items-center gap-2 text-emerald-200 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Viewing: <strong>{currentProduct.title}</strong> (₹{currentProduct.price})</span>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 space-y-3.5 overflow-y-auto text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Image Attachment Preview in Bubble */}
                  {msg.image && (
                    <div className="rounded-xl overflow-hidden border border-slate-700 max-w-[200px]">
                      <img src={msg.image} alt="User attachment" className="w-full h-auto object-cover max-h-36" />
                    </div>
                  )}

                  {/* Text Content */}
                  {msg.text && (
                    <div
                      className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-tr-none shadow-md'
                          : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  <div className={`text-[9px] text-slate-500 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading / Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2.5 text-slate-400">
                <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-300">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping delay-150" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping delay-300" />
                  </div>
                  <span className="text-[11px] font-medium">ECO AI is analyzing with Google Gemini...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Image Attachment Preview Box before Sending */}
          {attachedImage && (
            <div className="px-3.5 py-2 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 overflow-hidden">
                <img src={attachedImage} alt="Attachment Preview" className="w-9 h-9 rounded-lg object-cover border border-emerald-500/50 shrink-0" />
                <div className="truncate text-[11px]">
                  <p className="text-emerald-400 font-bold truncate">{attachedImageName || 'Attached Photo'}</p>
                  <p className="text-[9px] text-slate-400">Ready to send to Gemini Vision</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-md cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input Footer Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach Image for AI Vision Analysis"
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                attachedImage
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask in Tamil, Tanglish, English, Hindi..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
            />

            <button
              type="submit"
              disabled={loading || (!inputMessage.trim() && !attachedImage)}
              className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition-all cursor-pointer shadow-md shrink-0"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EcoAiChatbot;
