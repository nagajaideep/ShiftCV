import React, { useState } from 'react';
import Landing from './components/Landing';
import UploadForm from './components/UploadForm';
import EditorView from './components/EditorView';
import { transformResume } from './api';

function App() {
  const [view, setView] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [latex, setLatex] = useState('');
  const [error, setError] = useState('');

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
      <nav className="p-6 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
            <span className="font-bold text-xl tracking-tight">ShiftCV</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-400 font-medium">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="https://github.com/nagajaideep/ShiftCV" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </nav>

      <main className="pb-20">
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
