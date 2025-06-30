import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
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
import {ProjectService} from '../../services/project.service';
import {finalize, map} from 'rxjs/operators';
import {Observable, throwError, of, tap, forkJoin} from "rxjs";
import {CatalogDetailCodes} from '../../models/catalog-detail-code-data.type';
import {CatalogDetailMock} from '../../../../shared/models/catalog-detail.mock.model';
import {ProjectMock} from '../../models/project.mock.model';

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
  @Input() project?: ProjectMock;
  photographicRecords: ProjectDocumentMock[] = [];
  brochures: ProjectDocumentMock[] = [];
  multimediaDescription: string = '';
  multimediaDescriptionError: boolean = false;

  constructor(private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly projectService: ProjectService,
              private readonly loadingService: LoadingService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    if (changes['project'] && this.project && this.project.id > 0) {
      console.log('project init ppt', this.project);
      this.loadingService.show();
      this.loadData();
      this.loadingService.hide();
    }
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
    console.log('type:', type);
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
    this.createDocumentMock(file, this.photographicRecords, CatalogDetailCodes.PHOTOGRAPHIC_RECORD, this.multimediaDescription).subscribe({
      next: (document) => {
        document.description = this.multimediaDescription;
        this.photographicRecords.push(document);
        this.checkImageInDocument(this.photographicRecords, 'photographic_record');
        this.loadingService.hide();
        this.multimediaDescription = '';
      },
      error: (err) => console.error('Upload failed', err)
    });
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

  createDocumentMock(file: File, documents: ProjectDocumentMock[], catalogCode: string, description: string): Observable<ProjectDocumentMock> {
    let projectId : number;
    if (this.project && this.project.id !== undefined) {
      projectId = this.project.id;
    } else {
      throw new Error('Project or project ID is undefined');
    }

    console.log('createDocumentMock');
    const projectDocumentBase: ProjectDocumentMock = {
      description: description,
      catalogDetail: {
        code: catalogCode
      } as CatalogDetailMock
    } as ProjectDocumentMock;

    return this.projectService.uploadDocument('10449080004', projectId, file, projectDocumentBase).pipe(
      map((uploadedDoc: ProjectDocumentMock) => uploadedDoc)
    );
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
    this.createDocumentMock(file, this.brochures, CatalogDetailCodes.BROCHURE, 'BROCHURE').subscribe({
      next: (document) => {
        this.brochures.push(document);
        this.checkImageInDocument(this.brochures, 'parent_parcel');
        this.loadingService.hide();
      },
      error: (err) => console.error('Upload failed', err)
    });

  }

  onMultimediaDescriptionChange(name: string): void {
    if (name && (name.trim().length > 0 && name.trim().length <= 200)) {
      this.multimediaDescriptionError = false;
    }
  }


  deletePhotographicRecord(file: ProjectDocumentMock) {

    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }

    if (this.project == undefined || this.project.id == undefined) {
      console.error('Project ID is missing, cannot delete');
      return;
    }

    const documentId: number = file.id;
    const projectId: number = this.project.id;

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el registro fotográfico?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', projectId, documentId).subscribe({
            next: () => {
              this.ksModalGallerySvc.removeImage('photographic_record', { ...file } as Document);
              this.photographicRecords.splice(this.photographicRecords.indexOf(file), 1);
              this.loadingService.hide();
            },
            error: (err) => {
              console.error('Failed to remove document', err);
              this.loadingService.hide();
            }
          });
        }
      });
  }

  deleteBrochure(file: ProjectDocumentMock) {

    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }

    if (this.project == undefined || this.project.id == undefined) {
      console.error('Project ID is missing, cannot delete');
      return;
    }

    const documentId: number = file.id;
    const projectId: number = this.project.id;

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo brochure?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', projectId, documentId).subscribe({
            next: () => {
              this.ksModalGallerySvc.removeImage('brochure', { ...file } as Document);
              this.brochures.splice(this.brochures.indexOf(file), 1);
              this.loadingService.hide();
            },
            error: (err) => {
              console.error('Failed to remove document', err);
              this.loadingService.hide();
            }
          });
        }
      });
  }

  private loadData(): void {
    this.handleLoadProjectDocuments(this.project as ProjectMock);
  }

  private handleLoadProjectDocuments(project: ProjectMock): void {
    console.log('project-handle:', project);
    for (const doc of project.projectDocuments || []) {
      const code = doc.catalogDetail?.code;
      console.log('code-doc:', doc);
      switch (code) {
        case CatalogDetailCodes.BROCHURE:
          this.brochures.push(doc);
          this.checkImageInDocument(this.brochures, 'parent_parcel');
          break;
        case CatalogDetailCodes.PHOTOGRAPHIC_RECORD:
          this.photographicRecords.push(doc);
          this.checkImageInDocument(this.photographicRecords, 'photographic_record');
          break;
      }
    }
  }
}
