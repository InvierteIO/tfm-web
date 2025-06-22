import {Component,  OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '@core/services/loading.service';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ProjectStageMock} from '../../../projects/shared/models/project-stage.mock.model';
import {ProjectService} from '../../../projects/shared/services/project.service';
import {ProjectStageService} from '../../../projects/shared/services/project-stage.service';
import {finalize} from 'rxjs/operators';
import {NumericOnlyDirective} from '@common/directives/numeric-only.directive';
import {LocationCode} from '../../../projects/shared/models/location-code.mock.model';
import {GeographicalLocationService} from '../../../projects/shared/services/geographical-location.service';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {FormUtil} from '@common/utils/form.util';

@Component({
  selector: 'app-client-form',
  imports: [
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    IsInvalidFieldPipe,
    NgForOf,
    NgIf,
    SelectStyleDirective,
    NgSelectComponent,
    NumericOnlyDirective,
    ButtonLoadingComponent
  ],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  public form: FormGroup;
  loading:boolean = false;
  projectStages: ProjectStageMock[] = [];
  regions: LocationCode[] = [];
  provinces: LocationCode[] = [];
  districts: LocationCode[] = [];
  mode:string = 'new';

  constructor(private readonly  router: Router,
              private readonly route: ActivatedRoute,
              private readonly loadingService: LoadingService,
              private readonly fb: FormBuilder,
              private readonly locationsSvc: GeographicalLocationService,
              private readonly projectStageService: ProjectStageService) {
    this.form = this.buildForm();
    this.loadInfoFromNavigation();
  }

  ngOnInit(): void {
    this.loadData();
    if (this.mode === 'view') {
      this.form.disable({ emitEvent: false });
    }
  }

  back() {
    this.router.navigate([`/public/home/clients`]);
  }

  save() {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      return;
    }
    this.loadingService.show();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar el cliente?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.hide();
          setTimeout(() => {

          }, 200);
        }
      });
  }

  private buildForm() {
    return this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3) , Validators.maxLength(100)]],
      birthday: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      identity_document_type: ['', [Validators.required]],
      identity_document: ['', [Validators.required]],
      stages: ['', [Validators.required]],
      level_purchase_interest: ['', [Validators.required]],
      investment_capacity: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(13)]],
      alternative_phone: ['', [Validators.maxLength(13)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(3),Validators.maxLength(100)]],
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
    });
  }

  private initLocations(): void {
    this.locationsSvc.listRegions().subscribe(regions => {
      this.regions = regions;
      console.log(regions);
      this.form.get('region')!.setValue(null);
    });
    this.changeValueLocations();
  }


  private loadData(): void {
    this.initLocations();

    this.loadingService.show();

    this.projectStageService.listStage()
      .pipe(finalize(()=> this.loadingService.hide()))
      .subscribe(projects => {
        this.projectStages = projects as ProjectStageMock[];
      });
  }

  private changeValueLocations(): void {
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

  private loadInfoFromNavigation(): void {
    this.mode = this.route.snapshot.data['mode'];
  }

}
