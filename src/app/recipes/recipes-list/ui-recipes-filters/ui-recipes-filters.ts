import { CommonModule } from '@angular/common';
import { Component, computed, effect, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { PrepTimeRange, RecipeFilters } from '@shared/entities/recipe.model';

@Component({
  selector: 'app-ui-recipes-filters',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
  ],
  templateUrl: './ui-recipes-filters.html',
  styleUrl: './ui-recipes-filters.scss',
})
export class UiRecipesFilters {
  PrepTimeRange = PrepTimeRange;

  searchUpdated = output<{ filters: RecipeFilters }>();

  searchForm: FormGroup = new FormGroup({
    searchEntry: new FormControl(''),
  });

  filtersForm: FormGroup = new FormGroup({
    prepTimeRange: new FormControl<PrepTimeRange | null>(null),
  });

  searchEntry = toSignal(this.searchForm.get('searchEntry')!.valueChanges, {
    initialValue: '',
  });

  prepTimeRange = toSignal<PrepTimeRange | null>(
    this.filtersForm.get('prepTimeRange')!.valueChanges,
    {
      initialValue: null,
    }
  );

  filterEffect = effect(() => {
    const search = this.searchEntry();
    const prep = this.prepTimeRange();

    if (!!search || !!prep) {
      this.searchUpdated.emit({
        filters: { searchTerm: search, prepTime: prep },
      });
    }
  });
}
