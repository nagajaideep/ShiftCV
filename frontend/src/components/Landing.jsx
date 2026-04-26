import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Wand2, Download } from 'lucide-react';

const Landing = ({ onStart }) => {
  return (
    <div className="max-w-4xl mx-auto pt-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          <Sparkles size={14} />
          <span>Powered by Gemini 2.5 Flash</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Transform Your Resume <br />
          <span className="gradient-text">In Seconds</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Upload your existing resume and a LaTeX template. Our AI extracts your details and fits them perfectly into the new format.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <button onClick={onStart} className="btn-primary flex items-center gap-2 text-lg">
            <Wand2 size={20} />
            Start Transformation
          </button>
          <button className="btn-secondary flex items-center gap-2 text-lg">
            View Templates
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FileText className="text-blue-400" />, title: "Extract", desc: "AI parses your PDF or DOCX resume with high precision." },
            { icon: <Wand2 className="text-purple-400" />, title: "Transform", desc: "Your data is mapped onto any LaTeX or Word template." },
            { icon: <Download className="text-green-400" />, title: "Export", desc: "Download the final LaTeX source or a polished PDF." }
          ].map((feature, i) => (
            <div key={i} className="glass p-6 text-left hover:border-white/20 transition-colors">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
