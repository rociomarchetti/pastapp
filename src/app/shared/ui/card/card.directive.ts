import { Directive } from '@angular/core';

@Directive({
  selector: 'card-header',
  standalone: true,
})
export class CardHeaderDirective {}

@Directive({
  selector: 'card-body',
  standalone: true,
})
export class CardBodyDirective {}

@Directive({
  selector: 'card-footer',
  standalone: true,
})
export class CardFooterDirective {}
