import { Component, ContentChild, HostBinding, input } from '@angular/core';
import { CardFooterDirective, CardHeaderDirective } from './card.directive';

@Component({
  selector: 'app-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  isInteractive = input(false);
  isSelected = input(false);
  imgPath = input<string>();

  @ContentChild(CardFooterDirective) footer?: CardFooterDirective;
  @ContentChild(CardHeaderDirective) header?: CardHeaderDirective;

  @HostBinding('attr.role') get role() {
    return this.isInteractive() ? 'button' : null;
  }

  @HostBinding('attr.tabIndex') get tabIndex() {
    return this.isInteractive() ? 0 : null;
  }

  @HostBinding('attr.aria-selected') get selected() {
    return this.isSelected() ? 'true' : 'false';
  }

  @HostBinding('style.--card-bg-image')
  get bgImage() {
    return this.imgPath()
      ? `url("${this.imgPath()}")`
      : 'url(/assets/empty-recipe-img.png)';
  }

  @HostBinding('class')
  get classes() {
    return {
      card: true,
      'card--interactive': this.isInteractive(),
    };
  }
}
