import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
    ZXingScannerModule
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
              private readonly loadingService: LoadingService) {
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
    if(!this.validateFileExtension(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      this.parentParcelDocs.push({ name: file.name , filename: file.name ,
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(), });
      this.loadingService.hide();
    }, 1000);
  }

  loadFileOfficialCopy(file: File): void {
    if(!this.validateFileExtension(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      this.officialCopyDocs.push({ name: file.name , filename: file.name ,
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(), });
      this.loadingService.hide();
    }, 1000);
  }

  loadFilePublicDeed(file: File): void {
    if(!this.validateFileExtension(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      this.publicDeedDocs.push({ name: file.name , filename: file.name ,
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(), });
      this.loadingService.hide();
    }, 1000);
  }

  loadFileMunicipalLicence(file: File): void {
    if(!this.validateFileExtension(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      this.municipalLicenceDocs.push({ name: file.name , filename: file.name ,
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(), });
      this.loadingService.hide();
    }, 1000);
  }

  loadFileFeasibilityCertificate(file: File): void {
    if(!this.validateFileExtension(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      this.feasibilityCertificateDocs.push({ name: file.name , filename: file.name ,
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(), });
      this.loadingService.hide();
    }, 1000);
  }

  loadCertificateDevelopmentApproval(file: File): void {
    if(!this.validateFileExtension(file)) return;

    this.loadingService.show();
    setTimeout(() => {
      this.certificateDevelopmentApprovalDocs.push({ name: file.name , filename: file.name ,
        path: 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/new_pancho.jpg',
        createdAt: new Date(), });
      this.loadingService.hide();
    }, 1000);
  }

  validateFileExtension(file: File):boolean {
    const lowerName = file.name.toLowerCase();
    const isFileBlueprint =
      lowerName.endsWith('.png') || lowerName.endsWith('.jpg')
      || lowerName.endsWith('.jpeg')|| lowerName.endsWith('.pdf');
    if(isFileBlueprint) {
      return true;
    }

    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR]("Debes seleccionar archivos PDF o imagenes (PNG o JPG)"))
      .then(r => {}) ;
    return false;
  }

  deleteParentParcel(file: ProjectDocumentMock) {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el archivo de terreno matriz?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.parentParcelDocs.splice(this.parentParcelDocs.indexOf(file), 1);
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
            this.certificateDevelopmentApprovalDocs.splice(this.certificateDevelopmentApprovalDocs.indexOf(file), 1);
            this.loadingService.hide();
          }, 1000);
        }
      });
  }

  back(): void {
    this.router.navigate(['/public/home/project-new/complementary']);
  }

  toGoSection1(): void {
    this.router.navigate(['/public/home/project-new/section1']);
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

}
