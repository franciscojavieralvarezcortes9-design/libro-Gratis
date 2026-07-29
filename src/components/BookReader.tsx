import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Menu, Settings, Bookmark, Search,
  Volume2, VolumeX, Pause, Play, Download, Sparkles, X, Sun, Moon,
  Type, AlignLeft, ArrowUp, Check, Share2
} from 'lucide-react';
import { BOOK_INFO, CHAPTERS } from '../data/bookData';
import { Chapter, ReadingSettings, Bookmark as BookmarkType } from '../types';

interface BookReaderProps {
  initialChapterId?: string;
  onOpenDownload: () => void;
  onOpenSearch: () => void;
  onUpdateProgress: (progress: number) => void;
}

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: 'serif',
  theme: 'dark',
  textAlign: 'left',
  autoScrollSpeed: 0,
  keepScreenAwake: true
};

export const BookReader: React.FC<BookReaderProps> = ({
  initialChapterId,
  onOpenDownload,
  onOpenSearch,
  onUpdateProgress
}) => {
  // Current Chapter Index
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(() => {
    if (initialChapterId) {
      const idx = CHAPTERS.findIndex((c) => c.id === initialChapterId);
      if (idx !== -1) return idx;
    }
    const saved = localStorage.getItem('el_sistema_invisible_chapter');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Reading Settings
  const [settings, setSettings] = useState<ReadingSettings>(() => {
    const saved = localStorage.getItem('el_sistema_invisible_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // UI Drawer states
  const [showTocDrawer, setShowTocDrawer] = useState<boolean>(false);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);

  // Bookmarks saved in localStorage
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem('el_sistema_invisible_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Text-To-Speech (TTS) State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Container refs
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const tocSearchInputRef = useRef<HTMLInputElement>(null);
  const [tocFilter, setTocFilter] = useState<string>('');

  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  // Save chapter index to localStorage & trigger progress updates
  useEffect(() => {
    localStorage.setItem('el_sistema_invisible_chapter', currentChapterIndex.toString());
    const progress = Math.round(((currentChapterIndex + 1) / CHAPTERS.length) * 100);
    onUpdateProgress(progress);

    // Scroll to top of content
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }

    // Stop speech if playing on chapter change
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [currentChapterIndex]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('el_sistema_invisible_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle TTS Play/Pause
  const toggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta lectura de voz (Text-to-Speech).');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel(); // Reset previous
      const textToRead = `${currentChapter.title}. ${currentChapter.paragraphs.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES';
      utterance.rate = speechRate;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (paragraphIdx: number, previewText: string) => {
    const existingIdx = bookmarks.findIndex(
      (b) => b.chapterId === currentChapter.id && b.paragraphIndex === paragraphIdx
    );

    let updated: BookmarkType[];
    if (existingIdx !== -1) {
      updated = bookmarks.filter((_, i) => i !== existingIdx);
    } else {
      const newBookmark: BookmarkType = {
        id: `${currentChapter.id}-${paragraphIdx}-${Date.now()}`,
        chapterId: currentChapter.id,
        chapterTitle: currentChapter.title,
        paragraphIndex: paragraphIdx,
        previewText: previewText.substring(0, 100) + '...',
        createdAt: new Date().toLocaleDateString('es-ES')
      };
      updated = [...bookmarks, newBookmark];
    }

    setBookmarks(updated);
    localStorage.setItem('el_sistema_invisible_bookmarks', JSON.stringify(updated));
  };

  const isParagraphBookmarked = (paragraphIdx: number) => {
    return bookmarks.some(
      (b) => b.chapterId === currentChapter.id && b.paragraphIndex === paragraphIdx
    );
  };

  // Chapter Navigation
  const goToNextChapter = () => {
    if (currentChapterIndex < CHAPTERS.length - 1) {
      setCurrentChapterIndex((prev) => prev + 1);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex((prev) => prev - 1);
    }
  };

  // Theme Styles mapping
  const themeClasses = {
    dark: 'bg-[#0F0F11] text-[#E0E0E0] border-white/5',
    oled: 'bg-black text-slate-200 border-zinc-900',
    sepia: 'bg-[#fbf0d9] text-[#2b251e] border-[#e8dcb8]',
    light: 'bg-white text-slate-900 border-slate-200'
  };

  const themeHeaderClasses = {
    dark: 'bg-[#141416]/95 border-white/5 text-white',
    oled: 'bg-zinc-950/95 border-zinc-900 text-slate-100',
    sepia: 'bg-[#f3e4c3]/95 border-[#e5d2aa] text-[#2b251e]',
    light: 'bg-slate-100/95 border-slate-200 text-slate-900'
  };

  const fontFamilies = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  };

  const filteredTocChapters = CHAPTERS.filter(
    (c) =>
      c.title.toLowerCase().includes(tocFilter.toLowerCase()) ||
      c.category.toLowerCase().includes(tocFilter.toLowerCase()) ||
      (c.number && c.number.toString().includes(tocFilter))
  );

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col ${themeClasses[settings.theme]} transition-colors duration-200`}>
      {/* Reader Secondary Toolbar */}
      <div className={`sticky top-16 z-30 px-4 py-2 border-b backdrop-blur-md flex items-center justify-between gap-2 text-xs sm:text-sm ${themeHeaderClasses[settings.theme]}`}>
        {/* Table of Contents button */}
        <button
          onClick={() => setShowTocDrawer(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 font-medium transition-colors cursor-pointer"
          id="btn-reader-toc"
        >
          <Menu className="w-4 h-4 text-amber-500" />
          <span className="hidden xs:inline">Índice</span>
          <span className="text-amber-500 font-bold">({currentChapterIndex + 1}/{CHAPTERS.length})</span>
        </button>

        {/* Audio / TTS Player */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-black/10 hover:bg-black/20 border-transparent'
            }`}
            title="Escuchar audio de este capítulo"
            id="btn-reader-audio"
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'Pausar Audio' : 'Escuchar'}</span>
          </button>

          {isPlayingAudio && (
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="bg-black/20 border border-amber-500/30 rounded px-1.5 py-1 text-xs cursor-pointer"
            >
              <option value="0.8">0.8x</option>
              <option value="1.0">1.0x</option>
              <option value="1.2">1.2x</option>
              <option value="1.5">1.5x</option>
            </select>
          )}
        </div>

        {/* Reader Customization & Bookmarks */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowBookmarksModal(true)}
            className="p-2 rounded-lg bg-black/10 hover:bg-black/20 transition-colors relative cursor-pointer"
            title="Ver Marcadores"
            id="btn-reader-bookmarks"
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowSettingsDrawer(true)}
            className="p-2 rounded-lg bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
            title="Ajustes de Lectura"
            id="btn-reader-settings"
          >
            <Settings className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      </div>

      {/* Main Reading Canvas */}
      <main
        ref={contentContainerRef}
        className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full overflow-y-auto"
      >
        <div className="bg-[#1A1A1C] rounded-xl border border-white/10 shadow-inner p-6 sm:p-10 my-2">
          {/* Chapter Header */}
          <div className="mb-8 text-center border-b pb-6 border-white/5">
            <div className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2">
              {currentChapter.number ? `Capítulo ${currentChapter.number}` : currentChapter.category}
            </div>
            <h2 className={`text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3 ${fontFamilies[settings.fontFamily]}`}>
              {currentChapter.title}
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs text-white/40 uppercase tracking-wider font-mono">
              <span>Páginas {currentChapter.startPage} - {currentChapter.endPage}</span>
              <span>•</span>
              <span>~{currentChapter.estimatedMinutes} min de lectura</span>
            </div>
          </div>

          {/* Chapter Summary Callout */}
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm leading-relaxed italic opacity-90 text-amber-200">
            <span className="font-bold text-amber-500 not-italic block mb-1 uppercase tracking-wider text-[11px]">💡 Idea Clave:</span>
            "{currentChapter.summary}"
          </div>

          {/* Paragraphs List */}
          <div className="space-y-6">
            {currentChapter.paragraphs.map((paragraph, idx) => {
              const isBookmarked = isParagraphBookmarked(idx);
              const isFirstPara = idx === 0;

              if (isFirstPara && paragraph.length > 0) {
                const firstChar = paragraph.charAt(0);
                const restText = paragraph.slice(1);
                return (
                  <div key={idx} className="group relative">
                    <p
                      className={`${fontFamilies[settings.fontFamily]} ${
                        settings.textAlign === 'justify' ? 'text-justify' : 'text-left'
                      } text-white/90`}
                      style={{
                        fontSize: `${settings.fontSize}px`,
                        lineHeight: settings.lineHeight
                      }}
                    >
                      <span className="text-4xl sm:text-5xl float-left mr-3 font-serif text-amber-500 font-bold leading-none select-none">
                        {firstChar}
                      </span>
                      {restText}
                    </p>

                    {/* Inline Bookmark Action button */}
                    <button
                      onClick={() => toggleBookmark(idx, paragraph)}
                      className={`mt-2 flex items-center gap-1 text-xs opacity-40 hover:opacity-100 transition-opacity cursor-pointer ${
                        isBookmarked ? 'text-amber-500 opacity-100 font-bold' : ''
                      }`}
                      title={isBookmarked ? 'Quitar marcador' : 'Guardar marcador'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      <span>{isBookmarked ? 'Guardado en Marcadores' : 'Marcar este párrafo'}</span>
                    </button>
                  </div>
                );
              }

              return (
                <div key={idx} className="group relative">
                  <p
                    className={`${fontFamilies[settings.fontFamily]} ${
                      settings.textAlign === 'justify' ? 'text-justify' : 'text-left'
                    } text-white/90`}
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      lineHeight: settings.lineHeight
                    }}
                  >
                    {paragraph}
                  </p>

                  {/* Inline Bookmark Action button */}
                  <button
                    onClick={() => toggleBookmark(idx, paragraph)}
                    className={`mt-2 flex items-center gap-1 text-xs opacity-40 hover:opacity-100 transition-opacity cursor-pointer ${
                      isBookmarked ? 'text-amber-500 opacity-100 font-bold' : ''
                    }`}
                    title={isBookmarked ? 'Quitar marcador' : 'Guardar marcador'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                    <span>{isBookmarked ? 'Guardado en Marcadores' : 'Marcar este párrafo'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Chapter Navigation Bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={goToPrevChapter}
              disabled={currentChapterIndex === 0}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 hover:border-amber-500 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-white/80"
              id="btn-reader-prev-chapter"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            <div className="text-xs text-white/40 uppercase tracking-widest font-mono">
              Capítulo {currentChapterIndex + 1} de {CHAPTERS.length}
            </div>

            <button
              onClick={goToNextChapter}
              disabled={currentChapterIndex === CHAPTERS.length - 1}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0F0F11] font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
              id="btn-reader-next-chapter"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Drawer 1: Table of Contents (Índice) */}
      {showTocDrawer && (
        <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-slate-950 text-slate-100 h-full flex flex-col border-r border-slate-800 shadow-2xl">
            {/* TOC Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                <Menu className="w-5 h-5 text-amber-500" />
                <span>Índice del Libro</span>
              </h3>
              <button
                onClick={() => setShowTocDrawer(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TOC Search Input */}
            <div className="p-3 border-b border-slate-800/80">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  ref={tocSearchInputRef}
                  type="text"
                  placeholder="Buscar capítulo..."
                  value={tocFilter}
                  onChange={(e) => setTocFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* TOC Items List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredTocChapters.map((ch) => {
                const globalIdx = CHAPTERS.findIndex((c) => c.id === ch.id);
                const isActive = globalIdx === currentChapterIndex;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(globalIdx);
                      setShowTocDrawer(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className={`text-[10px] uppercase font-semibold ${isActive ? 'text-slate-950' : 'text-amber-400'}`}>
                        {ch.number ? `Capítulo ${ch.number}` : ch.category}
                      </div>
                      <div className="line-clamp-2 leading-snug">{ch.title}</div>
                    </div>
                    <span className={`text-xs shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                      p. {ch.startPage}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* TOC Footer Download Link */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
              <button
                onClick={() => {
                  setShowTocDrawer(false);
                  onOpenDownload();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Libro en PDF / ePub</span>
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setShowTocDrawer(false)} />
        </div>
      )}

      {/* Drawer 2: Reading Settings (Ajustes de Lectura) */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs">
          <div className="flex-1" onClick={() => setShowSettingsDrawer(false)} />
          <div className="w-full max-w-sm bg-slate-950 text-slate-100 h-full flex flex-col border-l border-slate-800 p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-500" />
                <span>Ajustes de Lectura</span>
              </h3>
              <button
                onClick={() => setShowSettingsDrawer(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Theme Mode */}
              <div>
                <label className="block font-semibold text-slate-300 mb-3">Tema Visual</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                      settings.theme === 'dark' ? 'bg-slate-900 border-amber-500 text-amber-300' : 'bg-slate-900/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Oscuro Lujo</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'oled' })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                      settings.theme === 'oled' ? 'bg-black border-amber-500 text-amber-300' : 'bg-black/50 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-black border border-amber-500" />
                    <span>Negro OLED</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                      settings.theme === 'sepia' ? 'bg-[#fbf0d9] border-amber-600 text-[#2b251e]' : 'bg-[#fbf0d9]/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-full bg-[#e8dcb8]" />
                    <span>Sepia Cálido</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                      settings.theme === 'light' ? 'bg-white border-amber-500 text-slate-950' : 'bg-white/10 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Claro Mínimo</span>
                  </button>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-slate-300">Tamaño de Letra</label>
                  <span className="text-amber-400 font-bold text-xs">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="28"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Line Height */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-slate-300">Interlineado</label>
                  <span className="text-amber-400 font-bold text-xs">{settings.lineHeight}x</span>
                </div>
                <input
                  type="range"
                  min="1.4"
                  max="2.2"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => setSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block font-semibold text-slate-300 mb-3">Tipografía</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, fontFamily: 'serif' })}
                    className={`p-2.5 rounded-lg border font-serif text-sm cursor-pointer ${
                      settings.fontFamily === 'serif' ? 'border-amber-500 text-amber-300 bg-slate-900' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Serif
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, fontFamily: 'sans' })}
                    className={`p-2.5 rounded-lg border font-sans text-sm cursor-pointer ${
                      settings.fontFamily === 'sans' ? 'border-amber-500 text-amber-300 bg-slate-900' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Sans
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, fontFamily: 'mono' })}
                    className={`p-2.5 rounded-lg border font-mono text-xs cursor-pointer ${
                      settings.fontFamily === 'mono' ? 'border-amber-500 text-amber-300 bg-slate-900' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Mono
                  </button>
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="block font-semibold text-slate-300 mb-3">Alineación</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, textAlign: 'left' })}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      settings.textAlign === 'left' ? 'border-amber-500 text-amber-300 bg-slate-900' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                    <span>Izquierda</span>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, textAlign: 'justify' })}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-center gap-2 cursor-pointer ${
                      settings.textAlign === 'justify' ? 'border-amber-500 text-amber-300 bg-slate-900' : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Justificado</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={() => setSettings(DEFAULT_SETTINGS)}
                className="text-xs text-slate-500 hover:text-slate-300 underline cursor-pointer"
              >
                Restablecer ajustes por defecto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Saved Bookmarks */}
      {showBookmarksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-amber-100 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>Mis Marcadores Guardados</span>
              </h3>
              <button
                onClick={() => setShowBookmarksModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookmarks.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                No has guardado ningún marcador todavía. Toca el icono de marcador junto a cualquier párrafo mientras lees para guardarlo aquí.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-3">
                {bookmarks.map((b) => {
                  const chIndex = CHAPTERS.findIndex((c) => c.id === b.chapterId);
                  return (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 hover:border-amber-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                        <span>{b.chapterTitle}</span>
                        <span className="text-slate-500 font-normal">{b.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 italic line-clamp-2">"{b.previewText}"</p>
                      <div className="pt-2 flex justify-between items-center text-xs">
                        <button
                          onClick={() => {
                            if (chIndex !== -1) setCurrentChapterIndex(chIndex);
                            setShowBookmarksModal(false);
                          }}
                          className="text-amber-400 font-semibold hover:underline cursor-pointer"
                        >
                          Ir a este capítulo →
                        </button>
                        <button
                          onClick={() => {
                            const updated = bookmarks.filter((item) => item.id !== b.id);
                            setBookmarks(updated);
                            localStorage.setItem('el_sistema_invisible_bookmarks', JSON.stringify(updated));
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
