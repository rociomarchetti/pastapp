import { Injectable } from '@angular/core';
import { Recipe } from '@shared/entities/recipe.model';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { RECIPES_MOCK } from './__mocks__/recipes.mock';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipesSubject = new BehaviorSubject<Array<Recipe>>(RECIPES_MOCK);
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
    this.updateRecipes(updatedList);
    return of(updatedList);
  }

  deleteRecipeById$(id: string): Observable<Array<Recipe>> {
    const updatedList = this.currentList.filter((recipe) => recipe.id !== id);
    this.updateRecipes(updatedList);
    return of(updatedList);
  }

  updateRecipe$(updatedRecipe: Recipe): Observable<Array<Recipe>> {
    const updatedList = this.currentList.map((currentRecipe) =>
      currentRecipe.name === updatedRecipe.name ? updatedRecipe : currentRecipe
    );
    this.updateRecipes(updatedList);
    return of(updatedList);
  }

  private updateRecipes(recipes: Recipe[]): void {
    this.recipesSubject.next(recipes);
  }

  private get currentList(): Recipe[] {
    return this.recipesSubject.getValue();
  }
}
