import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  input,
  output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, MatDialogModule, MatIconModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  private readonly dialog = inject(MatDialog);

  isOpen = input(false);
  isCloseable = input(true);
  closeModal = output();

  @ViewChild('content') content!: TemplateRef<unknown>;

  private dialogRef?: MatDialogRef<unknown>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      this.handleIsOpenChange();
    }
  }

  ngOnDestroy(): void {
    this.close();
  }

  get classes() {
    return ['modal', this.isCloseable() ? 'modal--is-closable' : ''];
  }

  handleIsOpenChange() {
    if (!this.content) return;
    if (this.isOpen()) {
      this.open();
    } else {
      this.close();
    }
  }

  open(): void {
    if (this.content) {
      this.dialogRef = this.dialog.open(this.content, {
        disableClose: !this.isCloseable(),
        backdropClass: 'modal__backdrop',
        panelClass: this.classes,
        maxHeight: '85vh',
        autoFocus: false,
      });
      this.dialogRef.afterClosed().subscribe((result) => {
        this.closeModal.emit(result);
      });
    }
  }

  close(): void {
    this.dialogRef?.close();
  }
}
