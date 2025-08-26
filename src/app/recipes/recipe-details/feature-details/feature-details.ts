import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '@core/services/recipe.service';
import {
  DifficultyLevel,
  Ingredient,
  Recipe,
} from '@shared/entities/recipe.model';
import { UiDetails } from '../ui-details/ui-details';

@Component({
  selector: 'app-feature-details',
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatIconModule,
    MatInput,
    MatInputModule,
    MatOption,
    MatSelect,
    MatSlideToggle,
    ReactiveFormsModule,
    UiDetails,
  ],
  templateUrl: './feature-details.html',
  styleUrl: './feature-details.scss',
})
export class FeatureDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  recipeId = this.route.snapshot.paramMap.get('id')!;
  recipe = toSignal(this.recipeService.getRecipeById$(this.recipeId));
  editMode = signal(false);
  originalIngredients = signal<Ingredient[]>([]);
  originalInstructions = signal<string[]>([]);

  DifficultyLevel = DifficultyLevel;
  previewUrl: string | ArrayBuffer | null = null;

  recipeForm: FormGroup = new FormGroup({
    name: new FormControl<string | null>(null),
    prepTime: new FormControl<number | null>(null),
    servings: new FormControl<number | null>(null),
    difficulty: new FormControl<DifficultyLevel | null>(null),
    img: new FormControl<File | null>(null),
    ingredients: new FormArray<FormGroup>([]),
    instructions: new FormArray<FormControl<string | null>>([
      new FormControl(''),
    ]),
  });

  recipeBg = computed(() =>
    this.previewUrl
      ? `url("${this.previewUrl}")`
      : this.recipe()?.imgPath
      ? `url("${this.recipe()?.imgPath}")`
      : 'none'
  );

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray<FormGroup>;
  }

  get instructions() {
    return this.recipeForm.get('instructions') as FormArray<
      FormControl<string>
    >;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  toggleEditMode() {
    this.editMode.update((v) => !v);
  }

  onAddIngredient(ingredient?: {
    name: string;
    quantity?: number;
    unit: string;
  }) {
    const group = new FormGroup({
      name: new FormControl(ingredient?.name || '', Validators.required),
      quantity: new FormControl(ingredient?.quantity || null),
      unit: new FormControl(ingredient?.unit || '', Validators.required),
    });

    this.ingredients.push(group);
  }

  onRemoveIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSaveIngredient(index: number) {
    const ingredientGroup = this.ingredients.at(index) as FormGroup;
    if (ingredientGroup.valid) {
      const updatedIngredient: Ingredient = ingredientGroup.value;

      this.originalIngredients.update((ingredients) => {
        const clone = [...ingredients];
        clone[index] = updatedIngredient;
        return clone;
      });
    }
  }

  onAddInstruction() {
    this.instructions.push(new FormControl());
  }

  onRemoveInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  onSaveInstruction(index: number) {
    const instruction = this.instructions.at(index);
    if (instruction.valid) {
      const updatedInstruction: string = instruction.value;

      this.originalInstructions.update((instruction) => {
        const clone = [...instruction];
        clone[index] = updatedInstruction;
        return clone;
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.recipeForm.patchValue({ img: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveRecipe(): void {
    if (this.recipeForm.valid) {
      const updatedRecipe: Recipe = {
        ...this.recipe()!,
        name: this.recipeForm.value.name!,
        prepTimeMinutes: this.recipeForm.value.prepTime!,
        servings: this.recipeForm.value.servings!,
        difficultyLevel: this.recipeForm.value.difficulty!,
        imgPath: this.previewUrl
          ? this.previewUrl.toString()
          : this.recipe()?.imgPath!,
        ingredients: this.ingredients.value,
        instructions: this.instructions.value,
      };

      this.recipeService.updateRecipe$(updatedRecipe).subscribe(() => {
        this.editMode.set(false);
      });
    }
  }

  hasIngredientChanged(index: number): boolean {
    const ingredientGroup = this.ingredients.at(index) as FormGroup;
    const original = this.originalIngredients()[index];

    return (
      (ingredientGroup.get('name')?.value &&
        ingredientGroup.get('name')?.value !== original.name) ||
      (ingredientGroup.get('quantity')?.value &&
        ingredientGroup.get('quantity')?.value !== original.quantity) ||
      (ingredientGroup.get('unit')?.value &&
        ingredientGroup.get('unit')?.value !== original.unit)
    );
  }

  hasInstructionChanged(index: number): boolean {
    const instruction = this.instructions.at(index);
    const original = this.originalInstructions()[index];

    return instruction.value !== original;
  }

  private initializeForm(): void {
    const data = this.recipe();
    if (data) {
      this.recipeForm.patchValue({
        name: data.name,
        prepTime: data.prepTimeMinutes,
        servings: data.servings,
        difficulty: data.difficultyLevel,
      });

      const ingredientsArray = this.ingredients;
      ingredientsArray.clear();
      this.originalIngredients.set(data.ingredients);
      data.ingredients.forEach((ingredient) => {
        this.onAddIngredient(ingredient);
      });

      const instructionsArray = this.recipeForm.get(
        'instructions'
      ) as FormArray;
      instructionsArray.clear();
      this.originalInstructions.set(data.instructions);
      data.instructions.forEach((instruction: string) => {
        instructionsArray.push(new FormControl(instruction));
      });
    }
  }
}
