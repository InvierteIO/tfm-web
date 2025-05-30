import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgIf} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-pdf-viewer-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './pdf-viewer-modal.component.html',
  styleUrl: './pdf-viewer-modal.component.css'
})
export class PdfViewerModalComponent implements OnInit {
  @Input() title: string = '';
  @Input() pdfUrl: string | null = null;
  safeUrl: SafeResourceUrl | null = null;

  constructor(public readonly activeModal: NgbActiveModal,
              private readonly sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.pdfUrl) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    }
  }
}
