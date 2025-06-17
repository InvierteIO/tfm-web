import {Component, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {LocationCode} from '../../models/location-code.mock.model';
import {GeographicalLocationService} from '../../services/geographical-location.service';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '@core/services/loading.service';
import {FileUtil} from '@common/utils/file.util';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {MapComponent} from '@common/components/map.component';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {NgSelectComponent} from '@ng-select/ng-select';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {NgForOf, NgIf} from '@angular/common';
import {NumericOnlyDirective} from '@common/directives/numeric-only.directive';
import {ProjectStageDtoMock} from '../../models/project-stage.mock.dto.model';

@Component({
  selector: 'app-location-information',
  imports: [
    IsInvalidFieldPipe,
    FormErrorMessagesPipe,
    NgSelectComponent,
    TypeFileIconGoogleFontsPipe,
    MapComponent,
    FileDropzoneComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NumericOnlyDirective
  ],
  templateUrl: './location-information.component.html'
})
export class LocationInformationComponent {
  @Input() form!: FormGroup;
  @Input() projectStageCurrent?: ProjectStageDtoMock;
  regions: LocationCode[] = [];
  provinces: LocationCode[] = [];
  districts: LocationCode[] = [];
  urlKmlKmz: string| undefined;
  @ViewChild(MapComponent)
  private mapComponent?: MapComponent;

  constructor(private readonly fb: FormBuilder,
              private readonly locationsSvc: GeographicalLocationService,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService) {}

  ngOnInit(): void {
    if (!this.form) {
      this.form = this.buildForm();
    } else {
      const group = this.buildForm();
      Object.keys(group.controls).forEach(control => {
        if (!this.form.contains(control)) {
          this.form.addControl(control, group.get(control)!);
        }
      });
    }
    this.initLocations();
    //this.urlKmlKmz = 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/example.kml';
    this.urlKmlKmz = 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/example2.kmz';
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      address_number: ['', [Validators.maxLength(20)]],
      address_reference: ['', [Validators.maxLength(200)]],
      zipcode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8),
        Validators.pattern('^\\d{6,8}$'),
      ]],
      region: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
      klm_url: [''],
    });
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

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped:${file.name} - ${file.type}`);
      this.loadFileKmlKmz(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected :${file.name} - ${file.type}`);
      input.value = '';
      this.loadFileKmlKmz(file);
    }
  }

}
