import React, { useRef, useState, useEffect } from 'react';
import './ProperNoun.css';

/**
 * ProperNoun component handles names and places.
 * It renders as "English(Korean)" by default.
 * If the screen narrows and a line wrap is detected, it switches layout to "English/Korean" (no parentheses) dynamically.
 * 
 * @param {string} en - English name/place
 * @param {string} ko - Korean name/place
 */
export default function ProperNoun({ en, ko }) {
  const containerRef = useRef(null);
  const enRef = useRef(null);
  const koRef = useRef(null);
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const checkWrap = () => {
      if (enRef.current && koRef.current) {
        const enRect = enRef.current.getBoundingClientRect();
        const koRect = koRef.current.getBoundingClientRect();
        
        // If the vertical difference between English and Korean spans is > 4px, it wrapped!
        const verticalDiff = Math.abs(enRect.top - koRect.top);
        setIsWrapped(verticalDiff > 4);
      }
    };

    // Run immediately and on resize
    checkWrap();
    
    const observer = new ResizeObserver(() => {
      checkWrap();
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    window.addEventListener('resize', checkWrap);
    
    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkWrap);
    };
  }, [en, ko]);

  return (
    <span ref={containerRef} className="proper-noun">
      <span ref={enRef} className="proper-noun-en">{en}</span>
      {isWrapped ? (
        <span className="proper-noun-wrap-container">
          <span className="proper-noun-slash">/</span>
          <span ref={koRef} className="proper-noun-ko">{ko}</span>
        </span>
      ) : (
        <span className="proper-noun-inline-container">
          <span className="proper-noun-bracket-open">(</span>
          <span ref={koRef} className="proper-noun-ko">{ko}</span>
          <span className="proper-noun-bracket-close">)</span>
        </span>
      )}
    </span>
  );
}
