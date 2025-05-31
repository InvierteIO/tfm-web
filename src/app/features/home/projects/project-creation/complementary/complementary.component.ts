import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NumericOnlyDirective} from '@common/directives/numeric-only.directive';
import {GeographicalLocationService} from '../../shared/services/geographical-location.service';
import {LocationCode} from '../../shared/models/location-code.mock.model';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {MapComponent} from "@common/components/map.component";
import {FileDropzoneComponent} from "@common/components/file-dropzone.component";
import Swal from "sweetalert2";
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from "@common/dialogs/dialogs-swal.constants";
import {ProjectDocumentMock} from "../../shared/models/project-document.mock.model";
import {TypeFileIconGoogleFontsPipe} from "@common/pipes/typefile-icon-googlefonts.pipe";
import {LoadingService} from "@core/services/loading.service";
import {FormUtil} from '@common/utils/form.util';
import {FileUtil} from '@common/utils/file.util';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {Document} from '@core/models/document.model';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-complementary',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    IsInvalidFieldPipe,
    NgForOf,
    NgIf,
    NumericOnlyDirective,
    NgSelectComponent,
    ButtonLoadingComponent,
    MapComponent,
    FileDropzoneComponent,
    DatePipe,
    TypeFileIconGoogleFontsPipe,
    GalleryModule
  ],
  templateUrl: './complementary.component.html'
})
export class ComplementaryComponent implements OnInit {
  @ViewChild(MapComponent)
  private mapComponent?: MapComponent;

  protected form: FormGroup;
  loading:boolean = false;
  regions: LocationCode[] = [];
  provinces: LocationCode[] = [];
  districts: LocationCode[] = [];
  photographicRecords: ProjectDocumentMock[] = [];
  brochures: ProjectDocumentMock[] = [];
  blueprints: ProjectDocumentMock[] = [];
  blueprintName: string = '';
  multimediaDescription: string = '';
  blueprintNameError: boolean = false;
  multimediaDescriptionError: boolean = false;
  urlKmlKmz: string| undefined;

  constructor(private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly locationsSvc: GeographicalLocationService,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.initLocations();
    //this.urlKmlKmz = 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/example.kml';
    this.urlKmlKmz = 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/example2.kmz';
    this.loadData();
  }

  initLocations(): void {
    this.locationsSvc.listRegions().subscribe(regions => {
      this.regions = regions;
      console.log(regions);
      this.form.get('region')!.setValue(null);
    });
    this.changeValueLocations();
  }

  changeValueLocations(): void {
    this.form.get('region')!.valueChanges.subscribe(regionCode => {
      if (regionCode) {
        this.locationsSvc.listProvinces(regionCode).subscribe(provinces => {
          this.provinces = provinces;
        });
      } else {
        this.provinces = [];
      }
      this.form.get('province')!.setValue(null);
      this.form.get('district')!.setValue(null);
      this.districts = [];
    });

    this.form.get('province')!.valueChanges.subscribe(provinceCode => {
      if (provinceCode) {
        this.locationsSvc.listDistricts(provinceCode).subscribe(districts => {
          this.districts = districts;
        });
      } else {
        this.districts = [];
      }
      this.form.get('district')!.setValue(null);
    });
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      address: ['', [Validators.required, Validators.minLength(2) , Validators.maxLength(200)]],
      address_number: ['', [Validators.maxLength(20)]],
      address_reference: ['', [Validators.maxLength(200)]],
      zipcode: ['', [Validators.required,
        Validators.minLength(6) , Validators.maxLength(8), Validators.pattern('^\\d{6,8}$')]],
      region: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      klm_url: [''],
    });
  }

  onDropFile(event: DragEvent, type: 'kml_kmz' | 'blueprint'
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

  onFileSelected(event: Event, type: 'kml_kmz' | 'blueprint'
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
      case 'kml_kmz': this.loadFileKmlKmz(file); break;
      case 'photographic_record': this.loadPhotographicRecord(file); break;
      case 'brochure': this.loadBrochure(file); break;
      case 'blueprint': this.loadBlueprint(file); break;
    }
  }

  loadFileKmlKmz(file: File) {
    if(!FileUtil.validateFileExtensionMessage(file, ['.kml', 'kmz'],
      'Debes seleccionar archivos KML o KMZ')) return;

    const pathsKmlKmz = [
      'https://invierteio-klm.s3.eu-west-1.amazonaws.com/example.kml',
      'https://invierteio-klm.s3.eu-west-1.amazonaws.com/example2.kmz'
    ];
    this.loadingService.show();
    setTimeout(() => {
      this.urlKmlKmz = pathsKmlKmz[(Math.floor(Math.random() * 10) % 2 === 0) ? 0 : 1];
      console.log("Path: "+this.urlKmlKmz);

      this.loadingService.hide();
      }, 1000);

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

  toGoSection1(): void {
    this.router.navigate(['/public/home/project-new/section1']);
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

  refreshMap(): void {
    this.mapComponent?.refresh();
  }

  deleteKmlKmz() {
    Swal.fire(
        DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar la referencia geográfica?"))
        .then((result) => {
          if (result.isConfirmed) {
            this.loadingService.show();
            setTimeout(() => {
              this.urlKmlKmz = undefined;
              this.loadingService.hide();
              }, 1000);

          }
    });
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
    return;
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

  back():void {
    this.router.navigate(['/public/home/project-new/infrastructure-installation']);
  }

  next(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['public/home/project-new/legal-scope']);
      this.loadingService.hide();
    }, 50);
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
