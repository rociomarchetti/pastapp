import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DifficultyLevel, Ingredient, Recipe } from '@recipes/shared/entities';
import { Button } from '@shared/ui/button/button';

@Component({
  selector: 'app-recipe-form',
  imports: [
    Button,
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatIconModule,
    MatInput,
    MatInputModule,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.scss',
})
export class RecipeForm implements OnInit {
  private snackBar = inject(MatSnackBar);

  recipe = input<Recipe>();
  mode = input<'edit' | 'create'>();
  recipeSaved = input<boolean>();
  recipeUpdated = output<Recipe>();

  originalIngredients = signal<Ingredient[]>([]);
  originalInstructions = signal<string[]>([]);

  DifficultyLevel = DifficultyLevel;
  previewUrl = signal<string | ArrayBuffer | null>(null);

  recipeForm: FormGroup = new FormGroup({
    name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    prepTime: new FormControl<number | null>(null, Validators.required),
    servings: new FormControl<number | null>(null, Validators.required),
    difficulty: new FormControl<DifficultyLevel | null>(
      null,
      Validators.required
    ),
    img: new FormControl<File | null>(null),
    ingredients: new FormArray<FormGroup>([
      new FormGroup({
        name: new FormControl(null, Validators.required),
        quantity: new FormControl(null, Validators.required),
      }),
    ]),
    instructions: new FormArray<FormControl<string | null>>([
      new FormControl(null, Validators.required),
    ]),
  });

  recipeBg = computed(() =>
    this.previewUrl()
      ? `url("${this.previewUrl()}")`
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

  get isEditingMode(): boolean {
    return this.mode() === 'edit';
  }

  get imgActionMsg(): string {
    if (this.previewUrl() || this.recipe()?.imgPath) {
      return 'Cambiar imagen';
    } else {
      return 'Subir imagen';
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onAddIngredient(ingredient?: Ingredient) {
    const group = new FormGroup({
      name: new FormControl(ingredient?.name || '', Validators.required),
      quantity: new FormControl(
        ingredient?.quantity || '',
        Validators.required
      ),
    });

    this.ingredients.push(group);
  }

  onRemoveIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onAddInstruction() {
    this.instructions.push(new FormControl());
  }

  onRemoveInstruction(index: number) {
    this.instructions.removeAt(index);
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.recipeForm.patchValue({ img: file });

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result);
    };
    reader.readAsDataURL(file);
  }

  onImageUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value.trim();

    if (url) {
      this.previewUrl.set(url);
    }
  }

  onSaveRecipe(): void {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      this.snackBar.open(
        '¡Ups! Parece que faltan algunos datos o hay errores en el formulario. Por favor, complete los campos requeridos antes de guardar la receta.',
        'Reintentar',
        {
          duration: 3000,
        }
      );
      return;
    }

    const updatedRecipe: Recipe = {
      ...this.recipe()!,
      name: this.recipeForm.value.name!,
      prepTimeMinutes: this.recipeForm.value.prepTime!,
      servings: this.recipeForm.value.servings!,
      difficultyLevel: this.recipeForm.value.difficulty!,
      imgPath: this.previewUrl()
        ? this.previewUrl()!.toString()
        : this.recipe()?.imgPath!,
      ingredients: this.ingredients.value,
      instructions: this.instructions.value,
    };

    this.recipeUpdated.emit(updatedRecipe);

    if (this.recipeSaved()) {
      this.snackBar.open('Receta guardada con éxito 🎉', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  hasIngredientChanged(index: number): boolean {
    const ingredientGroup = this.ingredients.at(index) as FormGroup;
    const original = this.originalIngredients()[index];

    if (!original) {
      return true;
    }

    return (
      (ingredientGroup.get('name')?.value &&
        ingredientGroup.get('name')?.value !== original.name) ||
      (ingredientGroup.get('quantity')?.value &&
        ingredientGroup.get('quantity')?.value !== original.quantity)
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
