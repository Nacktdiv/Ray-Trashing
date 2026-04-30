"use client";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function LoadingTrash() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative">

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-[-20px] h-3 w-3 rounded-full bg-emerald-500"
            initial={{ y: -20, x: -10, opacity: 0 }}
            animate={{ 
              y: 40, 
              x: 0, 
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5] 
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          animate={{
            rotate: [0, -5, 5, -5, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="relative z-10 text-emerald-600"
        >
          <Trash2 size={64} strokeWidth={1.5} />
        </motion.div>

        <motion.div 
          className="mx-auto mt-2 h-1 w-12 rounded-[100%] bg-slate-200"
          animate={{
            scaleX: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex flex-col items-center gap-1"
      >
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
          Memproses Data Sampah
        </h2>
        <div className="flex gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }}
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}