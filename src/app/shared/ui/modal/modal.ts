import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, MatDialogModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  private readonly dialog = inject(MatDialog);

  @Input() isOpen = false;
  @Input() isCloseable = true;
  @Input() imgPath?: string;
  @Output() closeModal = new EventEmitter<boolean>();

  @ViewChild('content') content!: TemplateRef<unknown>;

  private dialogRef?: MatDialogRef<unknown>;

  @Input() set backgroundImage(value: string | undefined) {
    if (value) {
      document.documentElement.style.setProperty(
        '--modal-bg-image',
        `url("${value}")`
      );
    } else {
      document.documentElement.style.removeProperty('--modal-bg-image');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['imgPath']?.currentValue) {
      this.backgroundImage = this.imgPath;
    }
    if (changes['isOpen']) {
      this.handleIsOpenChange();
    }
  }

  ngAfterViewInit() {
    this.handleIsOpenChange();
  }

  ngOnDestroy(): void {
    this.close();
  }

  get classes() {
    return ['modal', this.isCloseable ? 'modal--is-closable' : ''];
  }

  handleIsOpenChange() {
    if (!this.content) return;
    if (this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  open(): void {
    if (this.content) {
      this.dialogRef = this.dialog.open(this.content, {
        disableClose: !this.isCloseable,
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
