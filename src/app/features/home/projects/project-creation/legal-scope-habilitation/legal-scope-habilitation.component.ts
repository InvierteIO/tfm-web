import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '@core/services/loading.service';
import {ProjectDocumentMock} from '../../shared/models/project-document.mock.model';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormUtil} from '@common/utils/form.util';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BrowserQRCodeSvgWriter} from '@zxing/browser';
import {FileUtil} from '@common/utils/file.util';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import { Document } from '@core/models/document.model';
import {ProjectStoreService} from '../../shared/services/project-store.service';
import {ProjectDraftStatus} from '../../shared/models/project-draft-status';
import {finalize, map} from 'rxjs/operators';
import {Observable, throwError, of, tap, forkJoin} from "rxjs";
import {ProjectMock} from '../../shared/models/project.mock.model';
import {ProjectService} from '../../shared/services/project.service';
import {CatalogDetailCodes} from '../../shared/models/catalog-detail-code-data.type';
import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';
import {ProjectStatus} from '../../shared/models/project-status.model';

@Component({
  selector: 'app-legal-scope-habilitation',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    FileDropzoneComponent,
    NgForOf,
    NgIf,
    TypeFileIconGoogleFontsPipe,
    ButtonLoadingComponent,
    ZXingScannerModule,
    GalleryModule
  ],
  templateUrl: './legal-scope-habilitation.component.html',
  styleUrl: './legal-scope-habilitation.component.css'
})
export class LegalScopeHabilitationComponent implements OnInit {
  protected form: FormGroup;
  parentParcelDocs: ProjectDocumentMock[] = [];
  officialCopyDocs: ProjectDocumentMock[] = [];
  publicDeedDocs: ProjectDocumentMock[] = [];
  municipalLicenceDocs: ProjectDocumentMock[] = [];
  feasibilityCertificateDocs: ProjectDocumentMock[] = [];
  certificateDevelopmentApprovalDocs: ProjectDocumentMock[] = [];
  loading:boolean = false;
  codeQr?: string;
  scanning:boolean = false;
  qrDataUrl?: string;
  public project: ProjectMock = { id : 0 };

  constructor(private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService,
              private readonly projectService: ProjectService,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              protected readonly projectStore: ProjectStoreService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.loadData().subscribe(() => {
      if (this.isViewPage) {
        this.form.disable({ emitEvent: false });
      }
    });
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      qr : ['']
    });
  }

  startScanning(): void {
    this.scanning = true;
    this.qrDataUrl = undefined;
  }

  onScanSuccess(result: string): void {
    this.codeQr = result;
    this.form.get('qr')?.setValue(result);
    this.scanning = false;
    const writer = new BrowserQRCodeSvgWriter();
    const svg = writer.write(result, 150, 150);
    const svgStr = new XMLSerializer().serializeToString(svg);
    this.qrDataUrl = 'data:image/svg+xml;base64,' + btoa(svgStr);
  }

  onDropFile(event: DragEvent, type: 'parent_parcel' | 'official_copy'
    | 'public_deed' | 'municipal_licence' | 'feasibility_certificate'
  | 'certificate_development_approval'): void {
    console.log('onDropFile');
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped [${type}] :${file.name} - ${file.type}`);
      this.loadFileLegalScope(type, file);
    }
  }

  onFileSelected(event: Event, type: 'parent_parcel' | 'official_copy'
    | 'public_deed' | 'municipal_licence' | 'feasibility_certificate'
    | 'certificate_development_approval'): void {
    console.log('onFileSelected');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected [${type}] :${file.name} - ${file.type}`);
      input.value = '';
      this.loadFileLegalScope(type, file);
    }
  }

  loadFileLegalScope(type: string, file: File) {
    switch (type) {
      case 'parent_parcel': this.loadFileParentParcel(file); break;
      case 'official_copy': this.loadFileOfficialCopy(file); break;
      case 'public_deed': this.loadFilePublicDeed(file); break;
      case 'municipal_licence': this.loadFileMunicipalLicence(file); break;
      case 'feasibility_certificate': this.loadFileFeasibilityCertificate(file); break;
      case 'certificate_development_approval': this.loadCertificateDevelopmentApproval(file); break;
    }
  }

  loadFileParentParcel(file: File): void {
    console.log('loadFileParentParcel-Step 1');
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    this.createDocumentMock(file, this.parentParcelDocs,CatalogDetailCodes.STEP_ONE_CODE).subscribe({
      next: (document) => {
        this.parentParcelDocs.push(document);
        this.checkImageInDocument(this.parentParcelDocs, 'parent_parcel');
        this.loadingService.hide();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  createDocumentMock(file: File, documents: ProjectDocumentMock[], catalogCode: string): Observable<ProjectDocumentMock> {
    console.log('createDocumentMock');
    const projectDocumentBase: ProjectDocumentMock = {
      description: 'None',
      catalogDetail: {
        code: catalogCode
      } as CatalogDetailMock
    } as ProjectDocumentMock;

    return this.projectService.uploadDocument('10449080004', this.project.id, file, projectDocumentBase).pipe(
      map((uploadedDoc: ProjectDocumentMock) => uploadedDoc)
    );
  }

  checkImageInDocument(documents: ProjectDocumentMock[],type: string): void {
    console.log('checkImageInDocument');
    this.ksModalGallerySvc.removeAllImages(type);
    documents.forEach(document => {
      const extension = document.filename?.toLowerCase().split('.').pop();
      if (extension !== 'pdf') {
        this.ksModalGallerySvc.addImage(type, { ...document } as Document);
      }
    })
  }

  loadFileOfficialCopy(file: File): void {
    console.log('loadFileOfficialCopy');
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    this.createDocumentMock(file, this.officialCopyDocs, CatalogDetailCodes.STEP_TWO_CODE).subscribe({
      next: (document) => {
        this.officialCopyDocs.push(document);
        this.checkImageInDocument(this.officialCopyDocs, 'official_copy');
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Upload failed', err);
      }
    });
  }

  loadFilePublicDeed(file: File): void {
    console.log('loadFilePublicDeed');
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    this.createDocumentMock(file, this.publicDeedDocs, CatalogDetailCodes.STEP_THREE_CODE).subscribe({
      next: (document) => {
        this.publicDeedDocs.push(document);
        this.checkImageInDocument(this.publicDeedDocs, 'public_deed');
        this.loadingService.hide();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  loadFileMunicipalLicence(file: File): void {
    console.log('loadFileMunicipalLicence');
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    this.createDocumentMock(file, this.municipalLicenceDocs, CatalogDetailCodes.STEP_FOUR_CODE).subscribe({
      next: (document) => {
        this.municipalLicenceDocs.push(document);
        this.checkImageInDocument(this.municipalLicenceDocs, 'municipal_licence');
        this.loadingService.hide();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  loadFileFeasibilityCertificate(file: File): void {
    console.log('loadFileFeasibilityCertificate');
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    this.createDocumentMock(file, this.feasibilityCertificateDocs, CatalogDetailCodes.STEP_FIVE_CODE).subscribe({
      next: (document) => {
        this.feasibilityCertificateDocs.push(document);
        this.checkImageInDocument(this.feasibilityCertificateDocs, 'feasibility_certificate');
        this.loadingService.hide();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  loadCertificateDevelopmentApproval(file: File): void {
    console.log('loadCertificateDevelopmentApproval');
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    this.createDocumentMock(file, this.certificateDevelopmentApprovalDocs, CatalogDetailCodes.STEP_SIX_CODE).subscribe({
      next: (document) => {
        this.certificateDevelopmentApprovalDocs.push(document);
        this.checkImageInDocument(this.certificateDevelopmentApprovalDocs, 'parent_parcel');
        this.loadingService.hide();
      },
      error: (err) => console.error('Upload failed', err)
    });
  }

  viewDocument(file: ProjectDocumentMock, type : 'parent_parcel' | 'official_copy'
    | 'public_deed' | 'municipal_licence' | 'feasibility_certificate'
    | 'certificate_development_approval'): void {
    console.log('viewDocument');
    const extension = file.filename?.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      this.viewPdf(file);
    } else {
      this.ksModalGallerySvc.viewImage(type, { ...file } as Document);
    }
  }

  viewPdf(file: ProjectDocumentMock): void {
    console.log('viewPdf');
    const modalRef = this.modalService.open(PdfViewerModalComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'pdf-viewer-modal'
    });
    console.log('vide pdf:', file);
    modalRef.componentInstance.title = file.filename ?? '';
    modalRef.componentInstance.pdfUrl = file.path ?? '';
    return;
  }

  deleteParentParcel(file: ProjectDocumentMock) {
    console.log('deleteParentParcel: ', file);
    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }

    const documentId: number = file.id;

    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de terreno matriz?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', this.project.id, documentId).subscribe({
            next: () => {
              this.ksModalGallerySvc.removeImage('parent_parcel', { ...file } as Document);
              this.parentParcelDocs.splice(this.parentParcelDocs.indexOf(file), 1);
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

  deleteOfficialCopy(file: ProjectDocumentMock) {
    console.log('deleteOfficialCopy');

    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }
    const documentId: number = file.id;

    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de copia literal?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', this.project.id, documentId).subscribe({
            next: () => {
              this.ksModalGallerySvc.removeImage('official_copy', { ...file } as Document);
              this.officialCopyDocs.splice(this.officialCopyDocs.indexOf(file), 1);
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

  deletePublicDeed(file: ProjectDocumentMock) {
    console.log('deletePublicDeed');
    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }
    const documentId: number = file.id;
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de escritura pública?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', this.project.id, documentId).subscribe({
            next: () => {
            this.ksModalGallerySvc.removeImage('public_deed', { ...file } as Document);
            this.publicDeedDocs.splice(this.publicDeedDocs.indexOf(file), 1);
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

  deleteMunicipalLicence(file: ProjectDocumentMock) {
    console.log('deleteMunicipalLicence');
    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }
    const documentId: number = file.id;
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de licencia municipal?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', this.project.id, documentId).subscribe({
            next: () => {
            this.ksModalGallerySvc.removeImage('municipal_licence', { ...file } as Document);
            this.municipalLicenceDocs.splice(this.municipalLicenceDocs.indexOf(file), 1);
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

  deleteFeasibilityCertificate(file: ProjectDocumentMock) {
    console.log('deleteFeasibilityCertificate');
    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }
    const documentId: number = file.id;
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de certificado de servicios (Luz, Agua, Desague, Accesos)?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', this.project.id, documentId).subscribe({
            next: () => {
            this.ksModalGallerySvc.removeImage('feasibility_certificate', { ...file } as Document);
            this.feasibilityCertificateDocs.splice(this.feasibilityCertificateDocs.indexOf(file), 1);
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

  deleteCertificateDevelopmentApproval(file: ProjectDocumentMock) {
    console.log('deleteCertificateDevelopmentApproval');
    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }
    const documentId: number = file.id;
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de certificado de habilitación (habilitación urbana)?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectService.removeDocument('10449080004', this.project.id, documentId).subscribe({
            next: () => {
            this.ksModalGallerySvc.removeImage('certificate_development_approval', { ...file } as Document);
            this.certificateDevelopmentApprovalDocs.splice(this.certificateDevelopmentApprovalDocs.indexOf(file), 1);
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

  back(): void {
    this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/complementary`]);
  }

  toGoSection1(): void {
    this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section1`]);
  }

  toGoTitleSplits(): void {
    this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/title-splits`],{ state: { project: this.project } });
  }

  save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);
    this.loadingService.show();
    this.project.status = ProjectStatus.NOPUBLISHED;
    this.projectService.updateDraft(this.project, '10449080004')
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (project: ProjectMock) => {
          this.project = project;
          console.log('Project changed to no_publicado:', this.project);
          this.router.navigate(['/public/home/projects']);
          this.loadingService.hide();
        },
        error: (err : string) => {
          console.error('Error during project creation - section two :', err);
        }
      });

  }

  private loadData(): Observable<void> {
    this.loadingService.show();

    return this.projectService.readDraft('10449080004').pipe(
      tap((project) => {
        this.project = project as ProjectMock;
        this.handleLoadProjectDocuments(this.project)
      }),
      finalize(() => this.loadingService.hide()),
      map(() => void 0)
    );
  }

  private handleLoadProjectDocuments(project: ProjectMock): void {
    this.project = project;

    for (const doc of project.projectDocuments || []) {
      const code = doc.catalogDetail?.code;

      switch (code) {
        case CatalogDetailCodes.STEP_ONE_CODE:
          this.parentParcelDocs.push(doc);
          this.checkImageInDocument(this.parentParcelDocs, 'parent_parcel');
          break;
        case CatalogDetailCodes.STEP_TWO_CODE:
          this.officialCopyDocs.push(doc);
          this.checkImageInDocument(this.officialCopyDocs, 'official_copy');
          break;
        case CatalogDetailCodes.STEP_THREE_CODE:
          this.publicDeedDocs.push(doc);
          this.checkImageInDocument(this.publicDeedDocs, 'public_deed');
          break;
        case CatalogDetailCodes.STEP_FOUR_CODE:
          this.municipalLicenceDocs.push(doc);
          this.checkImageInDocument(this.municipalLicenceDocs, 'municipal_licence');
          break;
        case CatalogDetailCodes.STEP_FIVE_CODE:
          this.feasibilityCertificateDocs.push(doc);
          this.checkImageInDocument(this.feasibilityCertificateDocs, 'feasibility_certificate');
          break;
        case CatalogDetailCodes.STEP_SIX_CODE:
          this.certificateDevelopmentApprovalDocs.push(doc);
          this.checkImageInDocument(this.certificateDevelopmentApprovalDocs, 'certificate_development_approval');
          break;
      }
    }
  }


  get isViewPage() {
    return this.projectStore.draftStatus() == ProjectDraftStatus.VIEW;
  }
}
