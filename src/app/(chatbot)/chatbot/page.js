"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  ChevronLeft,
  Sparkles,
  User,
  Loader2,
} from "lucide-react";
import GetChatbot from "@/app/services/chatbot/getChatbot";
import GetAnswer from "@/app/services/chatbot/getAnswer";
import SaveChatbot from "@/app/services/chatbot/saveChatbot";

const AITutorChat = () => {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name");
  const id = searchParams.get("id");
  const { profile, user } = useUser();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // State untuk loading
  const bottomRef = useRef(null);

  const GetHistory = async () => {
    const res = await GetChatbot(user, id);
    if (res.success) {
      if (!res?.data[0]?.chat_history) {
        setMessages([
          {
            id: 1,
            role: "system",
            content: `Halo! Saya Gemini AI Tutor. Mari kita mulai membuat **${projectName}** Anda. Jika ada yang ingin ditanyakan jangan sungkan-sungkan ya?`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }
      setMessages(res.data[0]?.chat_history);
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    GetHistory();
  }, [projectName]);

  const handleGeminiChat = async () => {
    if (!inputValue.trim() || isTyping) return;

    const newQuestion = {
      id: Date.now(), // Gunakan timestamp agar ID unik
      role: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, newQuestion];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true); // Aktifkan animasi loading

    try {
      const res = await GetAnswer(updatedMessages);

      if (!res.success) {
        toast.error("Gagal mendapatkan jawaban: " + res.message);
        return;
      }

      const newAnswer = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.data?.answer,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...updatedMessages, newAnswer];
      setMessages(finalMessages);

      // Simpan ke database
      const saveRes = await SaveChatbot(finalMessages, id, profile);
      if (!saveRes.success) {
        console.error("Gagal menyimpan history:", saveRes.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server AI.");
    } finally {
      setIsTyping(false); // Matikan animasi loading
    }
  };

  // Auto scroll setiap kali ada pesan baru atau sedang mengetik
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header Workspace */}
      <header className="bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/project")}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight text-sm md:text-base">
              {projectName}
            </h2>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isTyping ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider italic">
                {isTyping ? "AI is Thinking..." : "AI Tutor Active"}
              </p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-full">
          <MoreVertical size={20} className="text-slate-400" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 md:max-w-[85%] ${msg.role === "user" ? "flex-row-reverse max-w-[85%]" : "max-w-[95%]"}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-emerald-600 text-white"
              }`}>
                {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
              </div>

              {/* Bubble */}
              <div className="space-y-1">
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm markdown-content ${
                  msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100' 
                }`}>
                  {/* Prop className dihapus, styling dipindah ke pembungkus div di atas */}
                  <ReactMarkdown 
                    components={{
                      p: ({node, ...props}) => <p className="leading-relaxed mb-2 last:mb-0" {...props} />,
                      pre: ({node, ...props}) => <pre className="bg-slate-800 text-white p-3 rounded-lg overflow-x-auto my-2" {...props} />,
                      code: ({node, ...props}) => <code className="bg-slate-100 text-pink-600 px-1 rounded" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                <p className={`text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-200">
                <Loader2 size={16} className="animate-spin" />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4"></div>
      </div>

      {/* Multi-Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 pb-8 md:pb-4">
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-[2rem] p-2 flex items-end gap-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
          <div className="flex gap-1 pl-2 pb-2">
            <label className="p-2 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">
              <ImageIcon size={22} />
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <label className="p-2 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">
              <Paperclip size={22} />
              <input type="file" className="hidden" />
            </label>
          </div>

          <textarea
            rows="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGeminiChat();
              }
            }}
            placeholder={isTyping ? "Gemini sedang berpikir..." : "Tanya Gemini AI..."}
            disabled={isTyping}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-2 resize-none max-h-32 text-slate-700 disabled:opacity-50"
          />

          <button
            onClick={handleGeminiChat}
            disabled={!inputValue.trim() || isTyping}
            className={`p-3 rounded-full transition-all ${
              inputValue.trim() && !isTyping
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
          Gemicraft AI Tutor can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default AITutorChat;