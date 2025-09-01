import { CommonModule } from '@angular/common';
import { Component, effect, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  DifficultyLevel,
  PrepTimeRange,
  RecipeFilters,
} from '@shared/entities/recipe.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-ui-recipes-filters',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatOption,
    MatRadioButton,
    MatRadioGroup,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './ui-recipes-filters.html',
  styleUrl: './ui-recipes-filters.scss',
})
export class UiRecipesFilters {
  PrepTimeRange = PrepTimeRange;
  DifficultyLevel = DifficultyLevel;

  searchUpdated = output<{ filters: RecipeFilters | null }>();

  filtersForm: FormGroup = new FormGroup({
    searchEntry: new FormControl<string | null>(null),
    prepTimeRange: new FormControl<PrepTimeRange | null>(null),
    difficulty: new FormControl<DifficultyLevel | null>(null),
  });

  searchEntry = toSignal(
    this.filtersForm
      .get('searchEntry')!
      .valueChanges.pipe(
        map((value: string) => (value?.trim() === '' ? null : value))
      ),
    { initialValue: null }
  );

  prepTimeRange = toSignal<PrepTimeRange | null>(
    this.filtersForm.get('prepTimeRange')!.valueChanges,
    {
      initialValue: null,
    }
  );

  difficultyLevel = toSignal<DifficultyLevel | null>(
    this.filtersForm.get('difficulty')!.valueChanges,
    {
      initialValue: null,
    }
  );

  filterEffect = effect(() => {
    const search = this.searchEntry();
    const prep = this.prepTimeRange();
    const difficulty = this.difficultyLevel();

    this.searchUpdated.emit({
      filters: { searchTerm: search, prepTime: prep, difficulty: difficulty },
    });
  });

  onRemoveFiltersClicked(): void {
    this.filtersForm.reset();
    this.searchUpdated.emit({ filters: null });
  }
}
