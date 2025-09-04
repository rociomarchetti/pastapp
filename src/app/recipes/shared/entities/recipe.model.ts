import { DifficultyLevel } from './difficulty-level.enum';
import { Ingredient } from './ingredient.model';
import { PrepTimeRange } from './prep-time-range.enum';

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
