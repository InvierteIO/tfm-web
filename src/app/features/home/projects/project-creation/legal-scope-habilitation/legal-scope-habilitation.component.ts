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

  constructor(private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              protected readonly projectStore: ProjectStoreService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
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
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.parentParcelDocs);//mock
      this.parentParcelDocs.push(document);
      this.checkImageInDocument(this.parentParcelDocs, 'parent_parcel');
      this.loadingService.hide();
    }, 1000);
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

  checkImageInDocument(documents: ProjectDocumentMock[],type: string): void {
    this.ksModalGallerySvc.removeAllImages(type);
    documents.forEach(document => {
      const extension = document.filename?.toLowerCase().split('.').pop();
      if (extension !== 'pdf') {
        this.ksModalGallerySvc.addImage(type, { ...document } as Document);
      }
    })
  }

  loadFileOfficialCopy(file: File): void {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.officialCopyDocs);//mock
      this.officialCopyDocs.push(document);
      this.checkImageInDocument(this.officialCopyDocs, 'official_copy');
      this.loadingService.hide();
    }, 1000);
  }

  loadFilePublicDeed(file: File): void {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.publicDeedDocs);//mock
      this.publicDeedDocs.push(document);
      this.checkImageInDocument(this.publicDeedDocs, 'public_deed');
      this.loadingService.hide();
    }, 1000);
  }

  loadFileMunicipalLicence(file: File): void {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.municipalLicenceDocs);//mock
      this.municipalLicenceDocs.push(document);
      this.checkImageInDocument(this.municipalLicenceDocs, 'municipal_licence');
      this.loadingService.hide();
    }, 1000);
  }

  loadFileFeasibilityCertificate(file: File): void {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.feasibilityCertificateDocs);//mock
      this.feasibilityCertificateDocs.push(document);
      this.checkImageInDocument(this.feasibilityCertificateDocs, 'feasibility_certificate');
      this.loadingService.hide();
    }, 1000);
  }

  loadCertificateDevelopmentApproval(file: File): void {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      const document = this.createDocumentMock(file, this.certificateDevelopmentApprovalDocs);//mock
      this.certificateDevelopmentApprovalDocs.push(document);
      this.checkImageInDocument(this.certificateDevelopmentApprovalDocs, 'certificate_development_approval');
      this.loadingService.hide();
    }, 1000);
  }

  viewDocument(file: ProjectDocumentMock, type : 'parent_parcel' | 'official_copy'
    | 'public_deed' | 'municipal_licence' | 'feasibility_certificate'
    | 'certificate_development_approval'): void {
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

  deleteParentParcel(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de terreno matriz?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('parent_parcel', { ...file } as Document);
            this.parentParcelDocs.splice(this.parentParcelDocs.indexOf(file), 1); // backend
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  deleteOfficialCopy(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de copia literal?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('official_copy', { ...file } as Document);
            this.officialCopyDocs.splice(this.officialCopyDocs.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  deletePublicDeed(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de escritura pública?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('public_deed', { ...file } as Document);
            this.publicDeedDocs.splice(this.publicDeedDocs.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  deleteMunicipalLicence(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de licencia municipal?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('municipal_licence', { ...file } as Document);
            this.municipalLicenceDocs.splice(this.municipalLicenceDocs.indexOf(file), 1);

            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  deleteFeasibilityCertificate(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de certificado de servicios (Luz, Agua, Desague, Accesos)?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('feasibility_certificate', { ...file } as Document);
            this.feasibilityCertificateDocs.splice(this.feasibilityCertificateDocs.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  deleteCertificateDevelopmentApproval(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de certificado de habilitación (habilitación urbana)?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.ksModalGallerySvc.removeImage('certificate_development_approval', { ...file } as Document);
            this.certificateDevelopmentApprovalDocs.splice(this.certificateDevelopmentApprovalDocs.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
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
    this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/title-splits`]);
  }

  save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/projects']);
      this.loadingService.hide();
    }, 500);
  }

  get isViewPage() {
    return this.projectStore.draftStatus() == ProjectDraftStatus.VIEW;
  }
}
