import React from 'react';

interface LogoProps {
  variant?: 'full' | 'iconOnly';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 26, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 34, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 42, text: 'text-2xl', gap: 'gap-3' },
    xl: { icon: 54, text: 'text-3xl', gap: 'gap-3.5' },
  };

  const dim = sizeMap[size];
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <div className={`inline-flex items-center ${dim.gap} ${className}`}>
      {/* Símbolo do Alvo Vermelho com Flecha Azul Escuro (Fundo Transparente) */}
      <svg
        width={dim.icon}
        height={dim.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
      >
        <defs>
          {/* Anel Externo Vermelho Gradiente */}
          <radialGradient id="targetRedGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>

          {/* Sombra da Flecha */}
          <filter id="arrowDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1.5" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Anel Externo do Alvo (Vermelho Vivido) */}
        <circle cx="50" cy="50" r="44" stroke="#dc2626" strokeWidth="8" fill="none" />
        
        {/* Anel Branco Intermediário */}
        <circle cx="50" cy="50" r="32" stroke="#ffffff" strokeWidth="5.5" fill="none" opacity="0.95" />
        
        {/* Anel Vermelho Interno */}
        <circle cx="50" cy="50" r="21" stroke="#dc2626" strokeWidth="5.5" fill="none" />
        <circle cx="50" cy="50" r="13" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.9" />

        {/* Centro Bullseye Vermelho */}
        <circle cx="50" cy="50" r="8" fill="#dc2626" />
        <circle cx="50" cy="50" r="2.5" fill="#ffffff" />

        {/* Flecha Azul Escuro Atingindo o Centro */}
        <g filter="url(#arrowDropShadow)">
          {/* Haste da Flecha (diagonal da ponta superior direita até 50,50) */}
          <path
            d="M 82 18 L 51 49"
            stroke="#0f172a"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M 82 18 L 51 49"
            stroke="#1e293b"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Ponta da Flecha no Centro */}
          <path
            d="M 48 52 L 62 42 L 58 58 Z"
            fill="#0f172a"
          />

          {/* Penas da Flecha na Rabeira */}
          <path
            d="M 84 16 L 76 10 M 86 18 L 92 12 M 78 22 L 86 14"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Texto da Logo ITMATCHER em uma única linha horizontal */}
      {variant === 'full' && (
        <span className={`font-black tracking-tight ${dim.text} ${textColor} select-none`}>
          IT<span className="text-red-500">MATCHER</span>
        </span>
      )}
    </div>
  );
};
