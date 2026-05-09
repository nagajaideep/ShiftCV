import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import UploadForm from './components/UploadForm';
import EditorView from './components/EditorView';
import LoadingOverlay from './components/LoadingOverlay';
import { transformResume, checkBackendStatus } from './api';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [latex, setLatex] = useState('');
  const [error, setError] = useState('');
  const [backendReady, setBackendReady] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(true);

  useEffect(() => {
    const pingBackend = async () => {
      const isReady = await checkBackendStatus();
      setBackendReady(isReady);
      setCheckingBackend(false);
    };
    
    pingBackend();
    // Re-check every 30 seconds
    const interval = setInterval(pingBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => setView('upload');

  const handleTransform = async (resumeFile, templateFile) => {
    setLoading(true);
    setError('');
    try {
      const result = await transformResume(resumeFile, templateFile);
      setLatex(result);
      setView('editor');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to transform resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {loading && <LoadingOverlay />}
      </AnimatePresence>

      <nav className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <span className="font-bold text-xl tracking-tight">ShiftCV</span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Backend Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${checkingBackend ? 'bg-gray-400 animate-pulse' : backendReady ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 animate-pulse'}`} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                {checkingBackend ? 'Checking...' : backendReady ? 'Backend Active' : 'Backend Sleeping'}
              </span>
            </div>
            
            <div className="hidden md:flex gap-6 text-sm text-gray-400 font-medium">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="https://github.com/nagajaideep/ShiftCV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </nav>

      <main className={view === 'editor' ? 'app-main app-main-editor' : 'app-main pb-20'}>
        {error && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {view === 'landing' && <Landing onStart={handleStart} />}
        {view === 'upload' && <UploadForm onTransform={handleTransform} loading={loading} />}
        {view === 'editor' && <EditorView initialLatex={latex} />}
      </main>
    </div>
  );
}

export default App;
