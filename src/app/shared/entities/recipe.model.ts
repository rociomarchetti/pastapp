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

export enum PrepTimeRange {
  QUICK = 'QUICK',
  NORMAL = 'NORMAL',
  CHEFMODE = 'CHEFMODE',
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

export interface RecipeFilters {
  searchTerm: string;
  prepTime: PrepTimeRange | null;
  difficulty: DifficultyLevel | null;
}
