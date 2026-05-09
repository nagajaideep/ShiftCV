import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const LoadingOverlay = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-overlay"
    >
      <div className="loading-panel">
        <div className="loading-orbit" aria-hidden="true">
          <div className="loading-ring loading-ring-outer" />
          <div className="loading-ring loading-ring-inner" />
          <span className="loading-orbit-dot loading-orbit-dot-a" />
          <span className="loading-orbit-dot loading-orbit-dot-b" />
          <span className="loading-orbit-dot loading-orbit-dot-c" />

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="loading-sparkle"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        <div className="loading-copy">
          <motion.h3 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="loading-title"
          >
            AI is transforming your resume
          </motion.h3>
          <p className="loading-message">
            Please wait while we extract your details and fill the new template. This usually takes 10-20 seconds.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingOverlay;
