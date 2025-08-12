import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RecipeService } from '@core/services/recipe.service';
import { Card } from '@shared/ui/card/card';
import {
  CardFooterDirective,
  CardHeaderDirective,
} from '@shared/ui/card/card.directive';

@Component({
  selector: 'app-recipes-list',
  imports: [CommonModule, Card, CardHeaderDirective, CardFooterDirective],
  standalone: true,
  templateUrl: './recipes-list.html',
  styleUrls: ['./recipes-list.scss'],
})
export class RecipesList implements OnInit {
  private recipeService = inject(RecipeService);
  readonly recipes$ = this.recipeService.recipes$;

  ngOnInit(): void {
    this.recipeService.getRecipes$();
  }

  onSelectAction(id: string) {
    console.log('id:', id);
  }
}
