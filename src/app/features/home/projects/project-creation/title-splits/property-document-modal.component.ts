import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocumentPropertyStep} from './document-property-step.model';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {PropertyDocumentMock} from '../../shared/models/property-document.mock.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {LoadingComponent} from '@common/components/loading.component';
import {PropertyDocumentDtoMock} from '../../shared/models/property-document.dto.model.mock';
import {
GalleryModule
} from '@ks89/angular-modal-gallery';

import {FileUtil} from '@common/utils/file.util';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {Document} from '@core/models/document.model';

@Component({
  selector: 'app-property-document-modal',
  standalone: true,
  imports: [
    FileDropzoneComponent,
    DatePipe,
    NgForOf,
    NgIf,
    TypeFileIconGoogleFontsPipe,
    LoadingComponent,
    GalleryModule
  ],
  templateUrl: './property-document-modal.component.html'
})
export class PropertyDocumentModalComponent implements OnInit {
  @Input()
  step?: DocumentPropertyStep;
  @Input()
  property?: PropertyDocumentDtoMock;
  documents: PropertyDocumentMock[] = [];
  subtitle: string= '';
  loading: boolean = false;

  constructor(public readonly activeModal: NgbActiveModal,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal) {
  }

  ngOnInit(): void {

  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped :${file.name} - ${file.type}`);
      this.loadDocument(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected :${file.name} - ${file.type}`);
      input.value = '';
      this.loadDocument(file);
    }
  }

  loadDocument(file: File): void {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loading = true;
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.documents);//mock
      this.documents.push(document);
      this.checkImageInDocument(this.documents, 'property_document');
      this.loading = false;
    }, 1000);
  }

  createDocumentMock(file: File, documents: PropertyDocumentMock[]): PropertyDocumentMock {
    const extension = file.name?.toLowerCase().split('.').pop();
    let path :string = "";
    if (extension === 'pdf') path = 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/keyboard-shortcuts-windows.pdf';
    else {
      path= (documents.length + 1) % 2 == 0 ? 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/Calendario09-10.PNG' :
        (documents.length + 1) % 3 == 0 ? 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/FondoLideres.png'
          :'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg';
    }
    return {
      id: documents.length + 1, filename: file.name, name: file.name,
      path,
      createdAt: new Date(),
    } as PropertyDocumentMock;
  }

  checkImageInDocument(documents: PropertyDocumentMock[],type: string): void {
    this.ksModalGallerySvc.removeAllImages(type);
    documents.forEach(document => {
      const extension = document.filename?.toLowerCase().split('.').pop();
      if (extension !== 'pdf') {
        this.ksModalGallerySvc.addImage(type, { ...document } as Document);
      }
    })
  }

  deleteDocument(file: PropertyDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de la propiedad?"))
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
