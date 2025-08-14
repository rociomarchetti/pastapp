import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RecipeService } from '@core/services/recipe.service';
import { Recipe } from '@shared/entities/recipe.model';
import { Card } from '@shared/ui/card/card';
import {
  CardFooterDirective,
  CardHeaderDirective,
} from '@shared/ui/card/card.directive';
import { Modal } from '@shared/ui/modal/modal';

@Component({
  selector: 'app-recipes-list',
  imports: [
    CommonModule,
    Card,
    CardHeaderDirective,
    CardFooterDirective,
    Modal,
  ],
  standalone: true,
  templateUrl: './recipes-list.html',
  styleUrls: ['./recipes-list.scss'],
})
export class RecipesList implements OnInit {
  private recipeService = inject(RecipeService);
  readonly recipes$ = this.recipeService.recipes$;

  isModalOpen = false;
  selectedRecipe?: Recipe;

  ngOnInit(): void {
    this.recipeService.getRecipes$();
  }

  onSelectRecipe(recipe: Recipe): void {
    this.isModalOpen = true;
    this.selectedRecipe = recipe;
  }

  onCloseModal(): void {
    console.log('close modal');
    this.isModalOpen = false;
  }

  goToRecipe(): void {
    console.log(this.selectedRecipe);
  }
}
