import { Component } from '@angular/core';
import {DocumentMock} from '../../../shared/models/document.mock.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {LoadingComponent} from '@common/components/loading.component';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PropertyDocumentMock} from '../../../shared/models/property-document.mock.model';
import {Document} from '@core/models/document.model';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';

@Component({
  selector: 'app-stage-document-list-modal',
  imports: [
    DatePipe,
    LoadingComponent,
    NgForOf,
    NgIf,
    TypeFileIconGoogleFontsPipe
  ],
  templateUrl: './stage-document-list-modal.component.html'
})
export class StageDocumentListModalComponent {
  documents: DocumentMock[] = [];
  loading:boolean = false;
  isView: boolean = false;
  constructor(public readonly activeModal: NgbActiveModal,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal) {
  }

  deleteDocument(file: PropertyDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el documento?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loading = true;
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('property_document', { ...file } as Document);
            this.documents.splice(this.documents.indexOf(file), 1);
            this.loading = false;
          }, 1000);
        }
      });
  }

  viewDocument(file: PropertyDocumentMock): void {
    const extension = file.filename?.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      this.viewPdf(file);
    } else this.ksModalGallerySvc.viewImage('property_document', { ...file } as Document);
  }

  viewPdf(file: PropertyDocumentMock): void {
    const modalRef = this.modalService.open(PdfViewerModalComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'pdf-viewer-modal'
    });
    modalRef.componentInstance.title = file.filename ?? '';
    modalRef.componentInstance.pdfUrl = file.path ?? '';
    return;
  }
}
