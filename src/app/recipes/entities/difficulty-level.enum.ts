export enum DifficultyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const DIFFICULTY_LEVELS: Record<DifficultyLevel, string> = {
  [DifficultyLevel.HIGH]: 'Alta',
  [DifficultyLevel.MEDIUM]: 'Media',
  [DifficultyLevel.LOW]: 'Baja',
};
