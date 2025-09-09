import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  type = input<'fill' | 'outline' | 'ghost'>('fill');
  label = input<string>();
  isDisabled = input(false);
  clickOutput = output<void>();

  onClicked(): void {
    this.clickOutput.emit();
  }

  get classes() {
    const base = 'btn';
    const variants = {
      fill: 'btn-fill',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    };
    return `${base} ${variants[this.type()]}`;
  }
}
