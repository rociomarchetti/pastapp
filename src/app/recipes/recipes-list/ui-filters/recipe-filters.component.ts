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
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import {
  DifficultyLevel,
  getDifficultyLabel,
  getPrepTimeRangeLabel,
  PrepTimeRange,
  RecipeFilters,
} from '@recipes/shared/entities';
import { Button } from '@shared/ui/button/button';
import { map } from 'rxjs';

@Component({
  selector: 'app-recipe-list-filters',
  imports: [
    Button,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recipe-filters.component.html',
  styleUrl: './recipe-filters.component.scss',
})
export class RecipeListFilters {
  readonly PrepTimeRange = PrepTimeRange;
  readonly DifficultyLevel = DifficultyLevel;

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

  get difficultyLevelLabel(): string {
    return getDifficultyLabel(this.difficultyLevel() ?? undefined);
  }

  get prepTimeRangeLabel(): string {
    return getPrepTimeRangeLabel(this.prepTimeRange() ?? undefined);
  }

  onRemoveFiltersClicked(): void {
    this.filtersForm.reset();
    this.searchUpdated.emit({ filters: null });
  }

  onRemoveSearchFilter(): void {
    this.filtersForm.get('searchEntry')?.reset();
  }

  onSetDifficultyLevel(level: DifficultyLevel): void {
    const control = this.filtersForm.get('difficulty');
    control?.setValue(level);
    control?.markAsDirty();
  }
}
