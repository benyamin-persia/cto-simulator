/**
 * TextWithTooltips: turns a string into React nodes with glossary terms wrapped in KeywordTooltip.
 * Matches whole words (case-insensitive). Click a highlighted term to show its definition (no hover).
 */

import type { ReactNode } from 'react';
import { GLOSSARY, GLOSSARY_KEYS_SORTED } from '../data/glossary';
import { KeywordTooltip } from './KeywordTooltip';

/** Escape special regex characters in a string. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build a regex that matches any glossary term as a whole word (case-insensitive). */
function buildGlossaryRegex(): RegExp {
  const pattern = GLOSSARY_KEYS_SORTED.map((k) => escapeRegex(k)).join('|');
  return new RegExp(`\\b(${pattern})\\b`, 'gi');
}

let cachedRegex: RegExp | null = null;
function getGlossaryRegex(): RegExp {
  if (!cachedRegex) cachedRegex = buildGlossaryRegex();
  return cachedRegex;
}

/**
 * Splits text and wraps any glossary term in KeywordTooltip.
 * Returns a React node (string or array of strings and KeywordTooltip elements).
 */
export function textWithTooltips(text: string): ReactNode {
  const regex = getGlossaryRegex();
  const parts = text.split(regex);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const key = part.toLowerCase().replace(/[\u2010\u2011]/g, '-');
    const definition = GLOSSARY[key];
    if (definition) {
      return (
        <KeywordTooltip
          key={`${i}-${part}`}
          term={part}
          definition={definition}
        />
      );
    }
    return part;
  });
}
