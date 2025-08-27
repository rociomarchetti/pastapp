export interface Ingredient {
  name: string;
  quantity?: string;
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
  isFavourite?: boolean;
}

export interface RecipeFilters {
  searchTerm: string | null;
  prepTime: PrepTimeRange | null;
  difficulty: DifficultyLevel | null;
}

export interface RecipeMatch {
  recipeId: string;
  recipeName: string;
  recipeMatch: string | null;
  ingredientsMatch: string[];
}
