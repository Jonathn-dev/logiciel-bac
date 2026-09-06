import React from 'react';
import { ExpandableTerm } from '../../types';

interface AutoHighlightProps {
  text: string;
  terms: ExpandableTerm[];
  onSelectTerm: (term: ExpandableTerm) => void;
}

export const AutoHighlight: React.FC<AutoHighlightProps> = ({
  text,
  terms,
  onSelectTerm,
}) => {
  if (!text) return null;

  // Build regex pattern for all terms
  const termNames = terms.map((t) => t.term.split(' ')[0]).filter(Boolean);
  if (termNames.length === 0) return <span>{text}</span>;

  // Render tokens
  return (
    <div className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap">
      {text}
    </div>
  );
};
