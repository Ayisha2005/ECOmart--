import React from 'react';

export const EcoMartLogo = ({ variant = 'default', size = 'md', showTagline = true, className = '' }) => {
  const heightMap = {
    sm: 'h-10 md:h-12',
    md: 'h-14 md:h-16',
    lg: 'h-20 md:h-24'
  };

  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <img
        src="/ecomart-logo.jpg"
        alt="ECO MART - Smart Shop • Green Deliver • Better Tomorrow"
        className={`${heightMap[size] || 'h-14'} object-contain drop-shadow-md rounded-lg transition-transform hover:scale-105`}
      />
    </div>
  );
};

export default EcoMartLogo;
