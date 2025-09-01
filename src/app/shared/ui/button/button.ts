import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  label = input<string>();
  isDisabled = input(true);
  clickOutput = output<void>();

  onClicked(): void {
    this.clickOutput.emit();
  }
}
