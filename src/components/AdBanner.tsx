import React, { useEffect, useRef } from 'react';
import { ExternalLink, Megaphone } from 'lucide-react';

export const DIRECT_AD_LINK = "https://ruffianattorneymargarine.com/nsypg6m64?key=c9ed7529ff708c7e247592ed1f6dcd3b";

interface AdBannerProps {
  className?: string;
  showDirectLink?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = "", showDirectLink = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://ruffianattorneymargarine.com/a88e0668edd1ccf4fda93e0aea91d66c/invoke.js';

      const divContainer = document.createElement('div');
      divContainer.id = 'container-a88e0668edd1ccf4fda93e0aea91d66c';

      containerRef.current.appendChild(script);
      containerRef.current.appendChild(divContainer);
    }
  }, []);

  return (
    <div className={`w-full my-6 p-4 rounded-xl bg-[#141416] border border-white/5 text-center flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-500/80 font-semibold">
        <Megaphone className="w-3.5 h-3.5" />
        <span>Publicidad / Contenido Patrocinado</span>
      </div>

      {/* Native Widget Banner Container */}
      <div ref={containerRef} className="w-full flex justify-center items-center min-h-[60px]" />

      {/* Direct Link Banner */}
      {showDirectLink && (
        <a
          href={DIRECT_AD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider transition-all border border-amber-500/20 hover:border-amber-500/40"
        >
          <span>Enlace Patrocinado Recomendado</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
