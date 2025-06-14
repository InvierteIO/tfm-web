import {Component, Input, OnInit} from '@angular/core';
import {ProjectMock} from '../shared/models/project.mock.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {FormsModule} from '@angular/forms';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import {ProjectDocumentMock} from '../shared/models/project-document.mock.model';
import {FileUtil} from '@common/utils/file.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {Document} from '@core/models/document.model';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '@core/services/loading.service';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';

@Component({
  selector: 'app-project-documents',
  imports: [
    DatePipe,
    FileDropzoneComponent,
    FormsModule,
    NgForOf,
    NgIf,
    TypeFileIconGoogleFontsPipe
  ],
  templateUrl: './project-documents.component.html'
})
export class ProjectDocumentsComponent implements OnInit {
  @Input()
  public project: ProjectMock = { id : 0 };

  photographicRecords: ProjectDocumentMock[] = [];
  brochures: ProjectDocumentMock[] = [];
  blueprints: ProjectDocumentMock[] = [];
  blueprintName: string = '';
  multimediaDescription: string = '';
  blueprintNameError: boolean = false;
  multimediaDescriptionError: boolean = false;

  constructor(private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadData();
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

  onDropFile(event: DragEvent, type: 'blueprint'
    | 'photographic_record' | 'brochure'): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped [${type}] :${file.name} - ${file.type}`);
      this.loadFile(type, file);
    }
  }

  onFileSelected(event: Event, type: 'blueprint'
    | 'photographic_record' | 'brochure'): void {
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
      case 'blueprint': this.loadBlueprint(file); break;
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

  loadBlueprint(file: File) {
    this.blueprintNameError = false;
    if(!this.blueprintName || this.blueprintName.trim().length === 0) {
      this.blueprintNameError = true;
      Swal.fire(
        DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR]("Debe definir el nombre del plano")).then(r => {}) ;
      return;
    }
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.blueprints);//mock
      document.name = this.blueprintName;
      this.blueprints.push(document);
      this.checkImageInDocument(this.blueprints, 'blueprint');
      this.loadingService.hide();
      this.blueprintName = '';
    }, 1000);
  }

  onBlueprintNameChange(name: string): void {
    if (name && name.trim().length > 0) {
      this.blueprintNameError = false;
    }
  }

  onMultimediaDescriptionChange(name: string): void {
    if (name && (name.trim().length > 0 && name.trim().length <= 200)) {
      this.multimediaDescriptionError = false;
    }
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

  viewDocument(file: ProjectDocumentMock, type: 'blueprint'
    | 'photographic_record' | 'brochure'): void {
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

  deleteBlueprint(file: ProjectDocumentMock) {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el plano?"))
      .then((result) => {
        if (result.isConfirmed) {

          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('blueprint', { ...file } as Document);
            this.blueprints.splice(this.blueprints.indexOf(file), 1);
            this.blueprintNameError = false;
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  loadData(): void {
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
