export enum PrepTimeRange {
  QUICK = 'QUICK',
  NORMAL = 'NORMAL',
  CHEFMODE = 'CHEFMODE',
}

export const TIME_RANGES: Record<PrepTimeRange, string> = {
  [PrepTimeRange.QUICK]: 'Rápido',
  [PrepTimeRange.NORMAL]: '30-40 minutos',
  [PrepTimeRange.CHEFMODE]: 'Modo chef',
};

export function getPrepTimeRangeLabel(
  range: PrepTimeRange | undefined
): string {
  return range ? TIME_RANGES[range].toUpperCase() : '';
}
