import { Component, ContentChild, HostBinding, Input } from '@angular/core';
import { CardFooterDirective, CardHeaderDirective } from './card.directive';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  @Input() isInteractive = false;
  @Input() isSelected = false;

  @ContentChild(CardFooterDirective) footer?: CardFooterDirective;
  @ContentChild(CardHeaderDirective) header?: CardHeaderDirective;

  @HostBinding('class') get classes(): string {
    return ['card', this.getIsInteractiveClassName()].join(' ');
  }

  @HostBinding('attr.role') get role() {
    return this.isInteractive ? 'button' : null;
  }

  @HostBinding('attr.tabIndex') get tabIndex() {
    return this.isInteractive ? 0 : null;
  }

  @HostBinding('attr.aria-selected') get selected() {
    return this.isSelected ? 'true' : 'false';
  }

  getIsInteractiveClassName() {
    return this.isInteractive ? 'card--interactive' : '';
  }
}
