import {Component, Input, OnInit} from '@angular/core';
import {ProjectDocumentMock} from '../../models/project-document.mock.model';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '@core/services/loading.service';
import {FileUtil} from '@common/utils/file.util';
import {Document} from '@core/models/document.model';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {FormsModule} from '@angular/forms';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-project-multimedia',
  imports: [
    FileDropzoneComponent,
    FormsModule,
    TypeFileIconGoogleFontsPipe,
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './project-multimedia.component.html'
})
export class ProjectMultimediaComponent  implements OnInit {
  @Input() isView:boolean = false;
  photographicRecords: ProjectDocumentMock[] = [];
  brochures: ProjectDocumentMock[] = [];
  multimediaDescription: string = '';
  multimediaDescriptionError: boolean = false;

  constructor(private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  onDropFile(event: DragEvent, type: 'photographic_record' | 'brochure'): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped [${type}] :${file.name} - ${file.type}`);
      this.loadFile(type, file);
    }
  }

  onFileSelected(event: Event, type:
    'photographic_record' | 'brochure'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected [${type}] :${file.name} - ${file.type}`);
      input.value = '';
      this.loadFile(type, file);
    }
  }

  loadFile(type: string, file: File) {
    switch (type) {
      case 'photographic_record': this.loadPhotographicRecord(file); break;
      case 'brochure': this.loadBrochure(file); break;
    }
  }


  loadPhotographicRecord(file: File) {
    this.multimediaDescriptionError = false;
    if(this.multimediaDescription && this.multimediaDescription.trim().length > 200) {
      this.multimediaDescriptionError = true;
      return;
    }
    if(!FileUtil.validateFileExtensionMessage(file, ['.png','.jpg','.jpeg'],
      'Debes seleccionar imagenes PNG o JPG')) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.photographicRecords);//mock
      document.description = this.multimediaDescription;
      this.photographicRecords.push(document);
      this.checkImageInDocument(this.photographicRecords, 'photographic_record');
      this.loadingService.hide();
      this.multimediaDescription = '';
    }, 1000);
  }

  checkImageInDocument(documents: ProjectDocumentMock[],type: string): void {
    this.ksModalGallerySvc.removeAllImages(type);
    documents.forEach(document => {
      const extension = document.filename?.toLowerCase().split('.').pop();
      if (extension !== 'pdf') {
        this.ksModalGallerySvc.addImage(type, { ...document } as Document);
      }
    })
  }

  createDocumentMock(file: File, documents: ProjectDocumentMock[]): ProjectDocumentMock {
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
    } as ProjectDocumentMock;
  }

  viewDocument(file: ProjectDocumentMock, type: 'photographic_record' | 'brochure'): void {
    const extension = file.filename?.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      this.viewPdf(file);
    } else {
      this.ksModalGallerySvc.viewImage(type, { ...file } as Document);
    }
  }

  viewPdf(file: ProjectDocumentMock): void {
    const modalRef = this.modalService.open(PdfViewerModalComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'pdf-viewer-modal'
    });

    modalRef.componentInstance.title = file.filename ?? '';
    modalRef.componentInstance.pdfUrl = file.path ?? '';
    return;
  }


  loadBrochure(file: File) {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.brochures);//mock
      this.brochures.push(document);
      this.checkImageInDocument(this.brochures, 'parent_parcel');
      this.loadingService.hide();
    }, 1000);

  }

  onMultimediaDescriptionChange(name: string): void {
    if (name && (name.trim().length > 0 && name.trim().length <= 200)) {
      this.multimediaDescriptionError = false;
    }
  }


  deletePhotographicRecord(file: ProjectDocumentMock) {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el registro fotográfico?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('photographic_record', { ...file } as Document);
            this.photographicRecords.splice(this.photographicRecords.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  deleteBrochure(file: ProjectDocumentMock) {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo brochure?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('brochure', { ...file } as Document);
            this.brochures.splice(this.brochures.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  private loadData(): void {
    this.photographicRecords = [
      {
        id: 1,
        name: 'Image.png',
        filename: 'Image.png',
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(),
        catalogDetail: {
          name: "Registro fotografico",
          code: "00050001",
          catalog: {
            code:"0005",
            name: "Archivos multimedia del proyecto",
          }
        }
      }
    ];
  }
}
