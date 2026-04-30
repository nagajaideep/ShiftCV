import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div className="text-center space-y-6 max-w-sm px-6">
        <div className="relative inline-block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-blue-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <Loader2 className="text-blue-400 animate-spin" size={32} />
            </motion.div>
          </motion.div>
          
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 -right-2 text-yellow-400"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        <div className="space-y-2">
          <motion.h3 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            AI is transforming your resume
          </motion.h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Please wait while we extract your details and fill the new template. This usually takes 10-20 seconds.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
