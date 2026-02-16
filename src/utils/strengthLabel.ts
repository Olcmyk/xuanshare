const STRENGTH_LABELS: Record<number, string> = {
  1: '极弱',
  2: '偏弱',
  3: '中等',
  4: '偏强',
  5: '极强'
};

export function getStrengthLabel(strength: number): string {
  return STRENGTH_LABELS[Math.max(1, Math.min(5, strength))] || '中等';
}
