import React from 'react';
import { Download, BookOpen, Smartphone, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Brain, HeartPulse, Compass, Zap, Flame, Eye } from 'lucide-react';
import { BOOK_INFO, CHAPTERS } from '../data/bookData';
import { Chapter } from '../types';
import { AdBanner } from './AdBanner';

interface HeroLandingProps {
  onStartReading: (chapterId?: string) => void;
  onOpenDownload: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartReading,
  onOpenDownload
}) => {
  return (
    <div className="min-h-screen bg-[#0F0F11] text-[#E0E0E0] selection:bg-amber-500 selection:text-[#0F0F11]">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-900/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Libro Gratis • Lector Integrado</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                {BOOK_INFO.title}
              </h1>
              <div className="h-1 w-16 bg-amber-500 mt-4 mx-auto lg:mx-0"></div>
            </div>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-serif text-amber-400 font-medium italic">
              "{BOOK_INFO.subtitle}"
            </p>

            {/* Description */}
            <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {BOOK_INFO.description}
            </p>

            {/* Core Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#141416] border border-white/5 text-white/80">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>100% Gratis Sin Registro</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#141416] border border-white/5 text-white/80">
                <Smartphone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Lectura Fluida Móvil</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#141416] border border-white/5 text-white/80 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>PDF, ePub & Online</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-center lg:justify-start">
              {/* Cover click trigger / Download CTA */}
              <button
                onClick={onOpenDownload}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0F0F11] font-bold text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
                id="btn-hero-download"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>Descargar Libro Gratis</span>
              </button>

              {/* Online Reader CTA */}
              <button
                onClick={() => onStartReading()}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#141416] hover:bg-[#1A1A1C] text-white border border-white/10 font-semibold text-sm uppercase tracking-wider transition-all hover:border-amber-500/50 cursor-pointer group"
                id="btn-hero-read"
              >
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Leer en Lector Integrado</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-xs text-white/40 text-center lg:text-left flex items-center justify-center lg:justify-start gap-1.5">
              <span>💡</span>
              <span><strong>Tip:</strong> Puedes tocar la portada del libro a la derecha para descargarlo en 1 segundo.</span>
            </p>
          </div>

          {/* Right Column: Book Cover Presentation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer" onClick={onOpenDownload} id="book-cover-trigger">
              {/* Cover Glow effect */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-500/30 to-amber-700/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Main Cover Image Container */}
              <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black max-w-[280px] sm:max-w-[320px] transition-transform duration-300 group-hover:scale-[1.02] group-hover:rotate-1">
                <img
                  src={BOOK_INFO.coverImage}
                  alt={BOOK_INFO.title}
                  className="w-full h-auto object-cover block"
                  referrerPolicy="no-referrer"
                />

                {/* Download Overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-6 text-center backdrop-blur-[2px]">
                  <Download className="w-16 h-16 text-amber-500 mb-4" />
                  <span className="text-white font-bold tracking-widest uppercase text-sm">Descargar Gratis</span>
                  <span className="text-white/40 text-[10px] mt-2">FORMATO EPUB / PDF / TXT / HTML</span>
                </div>
              </div>

              {/* Download Indicator pill below cover */}
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#141416] border border-white/10 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-lg group-hover:bg-amber-500 group-hover:text-[#0F0F11] transition-colors">
                <Download className="w-3.5 h-3.5" />
                <span>Toca la portada para descargar</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Topic Highlights Grid */}
      <section className="py-12 bg-[#141416] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Resumen de Contenidos</h2>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-white">
              ¿Qué aprenderás en este libro?
            </p>
            <p className="text-white/60 text-sm sm:text-base mt-2">
              19 capítulos breves fundamentados en ciencia que redefinen cómo entiendes tu mente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Dopamina & Búsqueda</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Descubre por qué la dopamina no es la molécula del placer, sino la chispa de la anticipación y la búsqueda continua.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Parálisis & Hiperfoco</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Comprende por qué cuesta tanto empezar una tarea aburrida y por qué a veces no puedes parar en lo que te apasiona.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Cortisol & Carga Alostática</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                El estrés no es un defecto: es tu cuerpo activándose. Aprende cómo la incertidumbre abstracta desgasta tu energía.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">El Dolor del Rechazo</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                La neurociencia demuestra que el rechazo social activa los mismos circuitos neuronales del dolor físico real.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Neuroplasticidad</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                "Las neuronas que se activan juntas, se conectan". Tu cerebro adulto conserva la habilidad de reescribirse día a día.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#0F0F11] border border-white/5 hover:border-amber-500/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white mb-2">Propósito & Disciplina</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Diseña un entorno que le gane a la fuerza de voluntad efímera. Construye tu propósito paso a paso en lugar de esperarlo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <AdBanner />
      </div>

      {/* Chapters Directory Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-1">Índice General</h2>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Capítulos del Libro
            </h3>
            <p className="text-white/50 text-sm mt-1">
              Haz clic en cualquier capítulo para comenzar a leerlo inmediatamente en tu dispositivo.
            </p>
          </div>
          <button
            onClick={() => onStartReading()}
            className="mt-4 md:mt-0 text-amber-400 hover:text-amber-300 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ver Lector Integrado</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              onClick={() => onStartReading(ch.id)}
              className="group p-5 rounded-xl bg-[#141416] hover:bg-[#1A1A1C] border border-white/5 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between"
              id={`chapter-card-${ch.id}`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                    {ch.number ? `Capítulo ${ch.number}` : ch.category}
                  </span>
                  <span className="text-white/40 text-[10px] uppercase font-mono">Pág. {ch.startPage} • ~{ch.estimatedMinutes} min</span>
                </div>
                <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition-colors leading-snug">
                  {ch.title}
                </h3>
                <p className="text-white/60 text-xs line-clamp-2 mt-2 leading-relaxed">
                  {ch.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-500 font-medium group-hover:translate-x-1 transition-transform uppercase tracking-wider text-[11px]">
                <span>Leer capítulo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Download Banner */}
      <section className="py-12 bg-gradient-to-br from-amber-950/20 via-[#141416] to-[#0F0F11] border-t border-white/5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Descarga "El Sistema Invisible" Gratis
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
            Disfruta de la lectura en tu e-reader favorito (Kindle, Kobo, Apple Books), en formato PDF imprimible, o léelo de forma fluida directamente desde tu navegador móvil.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0F0F11] font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-footer-download"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Gratis (PDF / ePub)</span>
            </button>
            <button
              onClick={() => onStartReading()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#141416] hover:bg-[#1A1A1C] text-white border border-white/10 font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-footer-read"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Abrir Lector Online Móvil</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
