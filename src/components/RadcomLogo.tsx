import React from 'react';
import headerLogoDefault from '../assets/images/regenerated_image_1790668897185.jpg';

interface RadcomLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emblem' | 'full';
  src?: string;
  alt?: string;
}

/**
 * Official Logo of PT. Radcom Solusindo Informatika
 * Rendered using the user-provided authentic corporate emblem.
 */
export const RadcomLogo: React.FC<RadcomLogoProps> = ({
  className = 'w-11 h-11',
  src,
  alt = 'PT. Radcom Solusindo Informatika',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white rounded-xl shadow-xs border border-slate-200/90 p-1 shrink-0 overflow-hidden ${className}`}
      title="PT. Radcom Solusindo Informatika Logo Resmi"
    >
      <img
        src={src || headerLogoDefault}
        alt={alt}
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
