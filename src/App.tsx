import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { BookReader } from './components/BookReader';
import { DownloadModal } from './components/DownloadModal';
import { SearchModal } from './components/SearchModal';
import { CHAPTERS } from './data/bookData';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'reader'>('landing');
  const [activeChapterId, setActiveChapterId] = useState<string | undefined>(undefined);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

  // Load initial reading progress from localStorage if available
  useEffect(() => {
    const savedChapterIdx = localStorage.getItem('el_sistema_invisible_chapter');
    if (savedChapterIdx) {
      const idx = parseInt(savedChapterIdx, 10);
      if (!isNaN(idx) && CHAPTERS[idx]) {
        const progress = Math.round(((idx + 1) / CHAPTERS.length) * 100);
        setReadingProgress(progress);
      }
    }
  }, []);

  const handleStartReading = (chapterId?: string) => {
    if (chapterId) {
      setActiveChapterId(chapterId);
    }
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSearchResult = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] font-sans text-[#E0E0E0] flex flex-col selection:bg-amber-500 selection:text-[#0F0F11]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDownload={() => setIsDownloadModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        readingProgress={readingProgress}
        isDarkTheme={isDarkTheme}
        onToggleTheme={() => setIsDarkTheme(!isDarkTheme)}
        bookmarksCount={0}
      />

      {/* Main View Area */}
      <div className="flex-1">
        {currentView === 'landing' ? (
          <HeroLanding
            onStartReading={handleStartReading}
            onOpenDownload={() => setIsDownloadModalOpen(true)}
          />
        ) : (
          <BookReader
            initialChapterId={activeChapterId}
            onOpenDownload={() => setIsDownloadModalOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onUpdateProgress={(progress) => setReadingProgress(progress)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#121214] border-t border-white/5 py-6 px-4 text-center text-xs text-white/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="uppercase tracking-widest text-[10px]">
            © {new Date().getFullYear()} <strong className="text-white">El Sistema Invisible</strong> — Edición Digital Abierta
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-medium">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Descargar PDF / EPUB
            </button>
            <span className="text-white/20">•</span>
            <button
              onClick={() => handleStartReading()}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Lector Móvil
            </button>
          </div>
        </div>
      </footer>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* In-Book Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
