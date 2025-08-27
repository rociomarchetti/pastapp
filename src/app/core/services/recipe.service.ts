import { Injectable } from '@angular/core';
import { Recipe } from '@shared/entities/recipe.model';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { RECIPES_MOCK } from './__mocks__/recipes.mock';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly STORAGE_KEY = 'recipes';
  private recipesSubject = new BehaviorSubject<Array<Recipe>>(
    this.loadRecipes()
  );
  recipes$ = this.recipesSubject.asObservable();

  getRecipes$(): Observable<Array<Recipe>> {
    return this.recipes$;
  }

  getRecipeById$(id: string): Observable<Recipe | undefined> {
    return this.recipes$.pipe(
      map((recipes) => recipes.find((recipe) => recipe.id === id))
    );
  }

  addRecipe$(newRecipe: Recipe): Observable<Array<Recipe>> {
    const updatedList = [...this.currentList, newRecipe];
    this.updateRecipeList(updatedList);
    return of(updatedList);
  }

  deleteRecipeById$(id: string): Observable<Array<Recipe>> {
    const updatedList = this.currentList.filter((recipe) => recipe.id !== id);
    this.updateRecipeList(updatedList);
    return of(updatedList);
  }

  updateRecipe$(updatedRecipe: Recipe): Observable<Array<Recipe>> {
    const updatedList = this.currentList.map((currentRecipe) =>
      currentRecipe.id === updatedRecipe.id ? updatedRecipe : currentRecipe
    );
    this.updateRecipeList(updatedList);
    return of(updatedList);
  }

  toggleFavourite$(id: string): Observable<Array<Recipe>> {
    const updatedList = this.currentList.map((recipe) =>
      recipe.id === id
        ? { ...recipe, isFavourite: !recipe.isFavourite }
        : recipe
    );
    this.updateRecipeList(updatedList);
    return of(updatedList);
  }

  private updateRecipeList(recipes: Recipe[]): void {
    this.recipesSubject.next(recipes);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
  }

  private loadRecipes(): Recipe[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : RECIPES_MOCK;
  }

  private get currentList(): Recipe[] {
    return this.recipesSubject.getValue();
  }
}
