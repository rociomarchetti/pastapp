export interface Ingredient {
  name: string;
  quantity?: number;
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  prepTimeMinutes: number;
  ingredients: Array<Ingredient>;
  instructions: Array<string>;
}
