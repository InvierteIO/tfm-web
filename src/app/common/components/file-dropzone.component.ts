import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-file-dropzone',
  standalone: true,
  templateUrl: './file-dropzone.component.html',
  imports: [
    NgClass
  ],
  styleUrl: './file-dropzone.component.css'
})
export class FileDropzoneComponent {
  @Input() text: string = '';
  @Input() accept: string = '';
  @Input() dropzoneClass: string = '';

  @Output() dropFile = new EventEmitter<DragEvent>();
  @Output() fileSelected = new EventEmitter<Event>();

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const el = event.currentTarget as HTMLElement;
    el.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const el = event.currentTarget as HTMLElement;
    el.classList.remove('dragover');
  }

  handleDrop(event: DragEvent): void {
    this.onDragLeave(event);
    this.dropFile.emit(event);
  }

  handleFileSelected(event: Event): void {
    this.fileSelected.emit(event);
  }
}
