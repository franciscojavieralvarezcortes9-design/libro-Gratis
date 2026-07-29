import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { CHAPTERS } from '../data/bookData';
import { SearchResult } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (chapterId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchLower = query.toLowerCase().trim();
    const matches: SearchResult[] = [];

    CHAPTERS.forEach((ch) => {
      ch.paragraphs.forEach((p, pIdx) => {
        if (p.toLowerCase().includes(searchLower)) {
          // Extract snippet around the matched word
          const matchIndex = p.toLowerCase().indexOf(searchLower);
          const start = Math.max(0, matchIndex - 40);
          const end = Math.min(p.length, matchIndex + searchLower.length + 60);
          const snippet = (start > 0 ? '...' : '') + p.substring(start, end) + (end < p.length ? '...' : '');

          matches.push({
            chapterId: ch.id,
            chapterTitle: ch.number ? `Cap. ${ch.number}: ${ch.title}` : ch.title,
            paragraphIndex: pIdx,
            snippet,
            matchCount: (p.toLowerCase().match(new RegExp(searchLower, 'g')) || []).length
          });
        }
      });
    });

    setResults(matches.slice(0, 20)); // limit top 20 results
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0F0F11] text-[#E0E0E0] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-[#141416]">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar conceptos (ej: dopamina, cortisol, hábitos, TDAH, decisiones)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 placeholder-white/30 focus:outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-white/40 hover:text-white uppercase tracking-wider font-mono cursor-pointer"
            >
              Limpiar
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            id="btn-close-search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim().length > 0 && results.length === 0 && (
            <div className="text-center py-12 text-white/50 text-sm">
              No se encontraron coincidencias para "<span className="text-amber-400 font-semibold">{query}</span>".
              <p className="text-xs text-white/30 mt-1">Prueba buscar otros términos como "estrés", "sueño", "atención" o "propósito".</p>
            </div>
          )}

          {results.map((res, i) => (
            <div
              key={i}
              onClick={() => {
                onSelectResult(res.chapterId);
                onClose();
              }}
              className="p-4 rounded-xl bg-[#141416] hover:bg-[#1A1A1C] border border-white/5 hover:border-amber-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1 uppercase tracking-wider">
                <span>{res.chapterTitle}</span>
                <span className="text-white/40 font-mono text-[10px]">Párrafo {res.paragraphIndex + 1}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-serif">
                "{res.snippet}"
              </p>
              <div className="mt-2 text-[10px] text-amber-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                <span>Ir al párrafo</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}

          {!query && (
            <div className="text-center py-8 text-white/30 text-xs uppercase tracking-widest">
              Escribe un término para buscar en los 19 capítulos del libro.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
