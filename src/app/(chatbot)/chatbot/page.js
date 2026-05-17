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
  X, 
} from "lucide-react";
import GetChatbot from "@/app/services/chatbot/getChatbot";
import GetAnswer from "@/app/services/chatbot/getAnswer";
import SaveChatbot from "@/app/services/chatbot/saveChatbot";
import CompressImage from "@/app/components/shared/compressImage";

const AITutorChat = () => {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name");
  const id = searchParams.get("id");
  const { profile, user } = useUser();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [imageValue, setImageValue] = useState(null); 
  const [isTyping, setIsTyping] = useState(false);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const compressedBase64 = await CompressImage(file);
        setImageValue(compressedBase64);
        localStorage.setItem('temp_image_chat', compressedBase64);
      } catch (error) {
        toast.error("Gagal kompres dan menyimpan gambar");
      }
    }
    // Reset file input value agar user bisa upload file yang sama jika mau
    e.target.value = "";
  };

  // Fungsi untuk membatalkan/menghapus gambar preview yang siap dikirim
  const handleRemovePreviewImage = () => {
    setImageValue(null);
    localStorage.removeItem('temp_image_chat');
  };

  useEffect(() => {
    const savedImage = localStorage.getItem('temp_image_chat');
    if (savedImage) {
      setImageValue(savedImage);
    }
  }, []);

  const handleGeminiChat = async () => {
    if ((!inputValue.trim() && !imageValue) || isTyping) return;

    let newQuestion = {
      id: Date.now(),
      role: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (imageValue) {
      newQuestion.image = imageValue;
    }

    const updatedMessages = [...messages, newQuestion];
    setMessages(updatedMessages);
    setInputValue("");
    
    setImageValue(null);
    localStorage.removeItem('temp_image_chat');
    
    setIsTyping(true);

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

      const saveRes = await SaveChatbot(finalMessages, id, profile);
      if (!saveRes.success) {
        console.error("Gagal menyimpan history:", saveRes.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan pada server AI.");
    } finally {
      setIsTyping(false);
    }
  };

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
                {/* 1. PREVIEW GAMBAR DI DALAM BUBBLE CHAT */}
                {msg.image && (
                  <div className={`mb-1 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="relative max-w-xs overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white p-1">
                      <img 
                        src={msg.image} 
                        alt="Uploaded file" 
                        className="max-h-60 w-auto object-cover rounded-xl"
                      />
                    </div>
                  </div>
                )}

                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm markdown-content ${
                  msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100' 
                }`}>
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

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 pb-8 md:pb-4 flex flex-col gap-2">
        
        {/* 2. PREVIEW PANEL DI ATAS INPUT BOX (STANDBY SEBELUM DIKIRIM) */}
        {imageValue && (
          <div className="max-w-4xl mx-auto w-full px-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="relative inline-block bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <img 
                src={imageValue} 
                alt="Upload preview" 
                className="h-20 w-20 object-cover rounded-xl"
              />
              <button
                onClick={handleRemovePreviewImage}
                className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white p-1 rounded-full shadow-md hover:bg-rose-600 transition-colors"
                title="Hapus gambar"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-2 flex items-end gap-2 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
          <div className="flex gap-1 pl-2 pb-2">
            <label className="p-2 text-slate-400 hover:text-emerald-600 cursor-pointer transition-colors">
              <ImageIcon size={22} />
              <input 
                type="file"   
                accept="image/*" 
                className="hidden"
                onChange={handleImageUpload} 
              />
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
            // Tombol aktif jika teks terisi ATAU ada gambar yang siap dikirim
            disabled={(!inputValue.trim() && !imageValue) || isTyping}
            className={`p-3 rounded-full transition-all ${
              (inputValue.trim() || imageValue) && !isTyping
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-1 font-medium">
          Gemicraft AI Tutor can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default AITutorChat;