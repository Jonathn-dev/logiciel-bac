import { useState, useCallback, useMemo } from 'react';
import { ComprehensiveGapReport, MissingConceptItem } from '../types';
import { defaultGapAnalyzer } from '../services/gapAnalyzer';

export function useGapAnalysis(initialReport?: ComprehensiveGapReport | null) {
  const [report, setReport] = useState<ComprehensiveGapReport | null>(initialReport || null);
  const [resolvedItemIds, setResolvedItemIds] = useState<Set<string>>(new Set());

  const analyzeText = useCallback((text: string) => {
    const res = defaultGapAnalyzer.analyze(text);
    setReport(res);
    setResolvedItemIds(new Set());
    return res;
  }, []);

  const toggleResolved = useCallback((id: string) => {
    setResolvedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const remainingMissing = useMemo(() => {
    if (!report) return [];
    return report.missingItems.filter((item) => !resolvedItemIds.has(item.id));
  }, [report, resolvedItemIds]);

  const effectiveScore = useMemo(() => {
    if (!report) return 0;
    const total = report.matchedCount + report.missingCount;
    if (total === 0) return 100;
    const resolvedCount = resolvedItemIds.size;
    const effectiveFound = report.matchedCount + resolvedCount;
    return Math.min(100, Math.round((effectiveFound / total) * 100));
  }, [report, resolvedItemIds]);

  return {
    report,
    setReport,
    analyzeText,
    resolvedItemIds,
    toggleResolved,
    remainingMissing,
    effectiveScore,
  };
}
