import React, { useState } from 'react';
import { Download, FileText, BookOpen, CheckCircle, Sparkles, X, Check, Globe, ExternalLink } from 'lucide-react';
import { BOOK_INFO } from '../data/bookData';
import { downloadBookInFormat } from '../utils/downloadBook';
import { DownloadFormat } from '../types';
import { DIRECT_AD_LINK } from './AdBanner';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('pdf');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(10);
    setIsCompleted(false);

    try {
      await downloadBookInFormat(selectedFormat, (percent) => {
        setDownloadProgress(percent);
      });
      setIsCompleted(true);
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
    } catch (err) {
      console.error('Download error:', err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#0F0F11] text-[#E0E0E0] rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-[#141416] rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          id="btn-close-download-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <img
            src={BOOK_INFO.coverImage}
            alt={BOOK_INFO.title}
            className="w-16 h-24 object-cover rounded-lg border border-amber-500/40 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3" />
              <span>100% Gratuito</span>
            </div>
            <h3 className="font-serif font-bold text-xl text-white leading-tight">
              {BOOK_INFO.title}
            </h3>
            <p className="text-xs text-amber-300 font-serif italic mt-0.5">
              {BOOK_INFO.subtitle}
            </p>
            <p className="text-[11px] text-white/40 uppercase tracking-wider font-mono mt-2">
              58 Páginas • 19 Capítulos • Texto Completo
            </p>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-3 mb-6">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-500">
            Selecciona el Formato de Descarga:
          </label>

          {/* PDF Format Option */}
          <div
            onClick={() => setSelectedFormat('pdf')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              selectedFormat === 'pdf'
                ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                : 'bg-[#141416] border-white/5 hover:border-white/15 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-xs">
                PDF
              </div>
              <div>
                <div className="font-bold text-sm">Documento PDF Formateado</div>
                <div className="text-xs text-white/50">Ideal para imprimir, tablets o PC</div>
              </div>
            </div>
            {selectedFormat === 'pdf' && <Check className="w-5 h-5 text-amber-400" />}
          </div>

          {/* ePub Format Option */}
          <div
            onClick={() => setSelectedFormat('epub')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              selectedFormat === 'epub'
                ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                : 'bg-[#141416] border-white/5 hover:border-white/15 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                EPUB
              </div>
              <div>
                <div className="font-bold text-sm">eBook EPUB Universal</div>
                <div className="text-xs text-white/50">Para Kindle, Apple Books, Kobo, Lithium</div>
              </div>
            </div>
            {selectedFormat === 'epub' && <Check className="w-5 h-5 text-amber-400" />}
          </div>

          {/* Plain Text Format Option */}
          <div
            onClick={() => setSelectedFormat('txt')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              selectedFormat === 'txt'
                ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                : 'bg-[#141416] border-white/5 hover:border-white/15 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                TXT
              </div>
              <div>
                <div className="font-bold text-sm">Texto Plano (.txt)</div>
                <div className="text-xs text-white/50">Ultra liviano, lectura directa en bloc de notas</div>
              </div>
            </div>
            {selectedFormat === 'txt' && <Check className="w-5 h-5 text-amber-400" />}
          </div>

          {/* Offline HTML Reader Option */}
          <div
            onClick={() => setSelectedFormat('html')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
              selectedFormat === 'html'
                ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                : 'bg-[#141416] border-white/5 hover:border-white/15 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                HTML
              </div>
              <div>
                <div className="font-bold text-sm">Lector Web Offline Independiente</div>
                <div className="text-xs text-white/50">Archivo único con lector interactivo sin internet</div>
              </div>
            </div>
            {selectedFormat === 'html' && <Check className="w-5 h-5 text-amber-400" />}
          </div>
        </div>

        {/* Download Progress Bar if downloading */}
        {isDownloading && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-amber-400">
              <span>Generando archivo {selectedFormat.toUpperCase()}...</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-[#141416] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Start Download Button */}
        <button
          onClick={handleStartDownload}
          disabled={isDownloading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0F0F11] font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          id="btn-confirm-download"
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-5 h-5 text-[#0F0F11]" />
              <span>¡Descarga Iniciada!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Descargar {selectedFormat.toUpperCase()} Gratis</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-3">
          Libre de marcas de agua • Acceso inmediato e ilimitado
        </p>

        <div className="mt-4 pt-3 border-t border-white/5 text-center">
          <a
            href={DIRECT_AD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold uppercase tracking-wider transition-colors"
          >
            <span>Ver enlace patrocinado del patrocinador</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
