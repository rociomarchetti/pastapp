export interface Ingredient {
  name: string;
  quantity?: number;
  unit: string;
}

export enum DifficultyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  prepTimeMinutes: number;
  difficultyLevel: DifficultyLevel;
  imgPath: string;
  ingredients: Array<Ingredient>;
  instructions: Array<string>;
}
