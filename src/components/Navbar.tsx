import React from 'react';
import { BookOpen, Download, Search, Moon, Sun, BookMarked, Sparkles } from 'lucide-react';
import { BOOK_INFO } from '../data/bookData';

interface NavbarProps {
  currentView: 'landing' | 'reader';
  onNavigate: (view: 'landing' | 'reader') => void;
  onOpenDownload: () => void;
  onOpenSearch: () => void;
  readingProgress: number; // 0 - 100
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  bookmarksCount: number;
  onOpenBookmarks?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenDownload,
  onOpenSearch,
  readingProgress,
  isDarkTheme,
  onToggleTheme,
  bookmarksCount
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0F0F11]/90 border-b border-white/5 text-[#E0E0E0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo / Brand */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left focus:outline-none group"
          id="btn-nav-home"
        >
          <div className="w-8 h-8 rounded-sm bg-amber-500 flex items-center justify-center text-[#0F0F11] font-bold italic shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            B
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif font-bold tracking-wide text-white text-sm md:text-base leading-tight group-hover:text-amber-400 transition-colors">
              {BOOK_INFO.title}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-amber-500/80 font-bold">Biblioteca Abierta</p>
          </div>
        </button>

        {/* Center Progress Bar if in Reader */}
        {currentView === 'reader' && (
          <div className="hidden md:flex items-center gap-3 bg-[#141416] border border-white/10 px-3 py-1.5 rounded-full text-xs text-slate-300">
            <span className="text-amber-400 font-semibold">{Math.round(readingProgress)}%</span>
            <div className="w-28 h-1.5 bg-[#0F0F11] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Completado</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            title="Buscar en el libro"
            id="btn-nav-search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Read / Home Toggle */}
          {currentView === 'landing' ? (
            <button
              onClick={() => onNavigate('reader')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all cursor-pointer"
              id="btn-nav-reader"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden xs:inline">Leer Online</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-white/5 border border-white/10 rounded-lg transition-all cursor-pointer"
              id="btn-nav-landing"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="hidden xs:inline">Inicio</span>
            </button>
          )}

          {/* Download Button */}
          <button
            onClick={onOpenDownload}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0F0F11] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            id="btn-nav-download"
          >
            <Download className="w-4 h-4" />
            <span>Descargar</span>
          </button>
        </div>
      </div>

      {/* Mobile Top Reading Progress Indicator */}
      {currentView === 'reader' && (
        <div className="w-full h-1 bg-slate-900 md:hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}
    </header>
  );
};
