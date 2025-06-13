import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {stageRomanValidator} from '@common/validators/stage.validator';
import {Router} from '@angular/router';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormUtil} from '@common/utils/form.util';
import {positiveNumberValidator} from '@common/validators/positive-number.validator';
import {FeatureMock} from '../../shared/models/feature.mock.model';
import {LandPropertyFeaturesComponent} from './land-property-features.component';
import {PropertyCategory} from '../../../../shared/models/property-category.model';
import {ApartmentPropertyFeaturesComponent} from './apartment-property-features.component';
import {HousePropertyFeaturesComponent} from './house-property-features.component';
import {LoadingService} from '@core/services/loading.service';
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
    imports: [
        FormErrorMessagesPipe,
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        SelectStyleDirective,
        IsInvalidFieldPipe,
        ButtonLoadingComponent,
        LandPropertyFeaturesComponent,
        ApartmentPropertyFeaturesComponent,
        HousePropertyFeaturesComponent,
        NgSelectComponent
    ],
  selector: 'app-property-type',
  templateUrl: './property-type.component.html'
})
export class PropertyTypeComponent  implements OnInit  {
  protected readonly PROPERTY_CATEGORY = PropertyCategory;
  public form: FormGroup;
  landFeatures: FeatureMock[] = [];
  apartmentFeatures: FeatureMock[] = [];
  houseFeatures: FeatureMock[] = [];
  features: FeatureMock[] = [];
  loading:boolean = false;
  stages: string[] = ['I','II','III','IV','V'];

  constructor(private router: Router, private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService) {
    this.form = this.buildForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.initLandFeaturesForm();
    this.initHouseFeaturesForm();
    this.initApartmentFeaturesForm();

    this.form.get('category')!
      .valueChanges
      .subscribe((cat: PropertyCategory) => this.onCategoryChange(cat));

    this.onCategoryChange(this.form.get('category')!.value);

    this.apartmentFormGroup.get('apartment_type')!
      .valueChanges
      .subscribe(type => this.onApartmentTypeChange(type));
    this.onApartmentTypeChange(this.apartmentFormGroup.get('apartment_type')!.value);
  }

  private onCategoryChange(cat: PropertyCategory) {
    const land = this.landFormGroup;
    const apt  = this.apartmentFormGroup;
    const house= this.houseFormGroup;

    land.disable({ emitEvent: false, onlySelf: true });
    apt .disable({ emitEvent: false, onlySelf: true });
    house.disable({ emitEvent: false, onlySelf: true });

    if (cat === PropertyCategory.LAND) {
      land.enable({ emitEvent: false, onlySelf: true });
    } else if (cat === PropertyCategory.APARTMENT) {
      apt.enable({ emitEvent: false, onlySelf: true });
    } else if (cat === PropertyCategory.HOUSE) {
      house.enable({ emitEvent: false, onlySelf: true });
    }

    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false });
  }


  private onApartmentTypeChange(type: string|null) {
    const apt = this.apartmentFormGroup;
    apt.get('area_floor_two')!.disable({ emitEvent: false });
    apt.get('area_floor_three')!.disable({ emitEvent: false });
    if (type === 'DUPLEX') {
      apt.get('area_floor_two')!.enable({ emitEvent: false });
    } else if (type === 'TRIPLEX') {
      apt.get('area_floor_two')!.enable({ emitEvent: false });
      apt.get('area_floor_three')!.enable({ emitEvent: false });
    }
    apt.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      stages: ['', [Validators.required, stageRomanValidator]],
      category: ['', [Validators.required]],
      perimeter: ['', [Validators.required, positiveNumberValidator(false)]],
      area: ['', [Validators.required, positiveNumberValidator(false)]],
      parking_space: ['', [Validators.required]],
      front_park: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      price: ['', [Validators.required, positiveNumberValidator(true)]],
      percentage_rate: ['', [Validators.required, positiveNumberValidator(true)]],
      land: this.fb.group({
        land_block_location: ['', [Validators.required]],
        land_road_way: ['', [Validators.required]],
        land_features: this.fb.array([])
      }),
      apartment: this.fb.group({
        apartment_total_bathrooms: ['', [Validators.required, positiveNumberValidator(true)]],
        apartment_total_rooms : ['', [Validators.required, positiveNumberValidator(true)]],
        area_floor_two : ['', [Validators.required, positiveNumberValidator(true)]],
        area_floor_three : ['', [Validators.required, positiveNumberValidator(true)]],
        apartment_type : ['', [Validators.required]],
        apartment_tower_location : ['', [Validators.required]],
        apartment_features: this.fb.array([]),
      }),
      house: this.fb.group({
        house_total_bathrooms: ['', [Validators.required, positiveNumberValidator(true)]],
        house_total_rooms : ['', [Validators.required, positiveNumberValidator(true)]],
        house_roofed_area:  ['', [Validators.required, positiveNumberValidator(true)]],
        house_total_floors: ['', [Validators.required,Validators.max(10), positiveNumberValidator(true)]],
        house_block_location: ['', [Validators.required]],
        house_road_way: ['', [Validators.required]],
        house_features: this.fb.array([]),
        house_floor_areas: this.fb.array([])
      })
    });
  }

  private initLandFeaturesForm(): void {
    const landFeaturesFormArray = this.landFormGroup.get('land_features') as FormArray;
    landFeaturesFormArray.clear();

    this.landFeatures.forEach(features => {
      landFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          name:    [`land_feature_${features.id}`],
          checked: [false],
        })
      );
    });
  }

  private initHouseFeaturesForm(): void {
    const houseFeaturesFormArray = this.houseFormGroup.get('house_features') as FormArray;
    houseFeaturesFormArray.clear();

    this.houseFeatures.forEach(features => {
      houseFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          name:    [`house_feature_${features.id}`],
          checked: [false],
        })
      );
    });
  }

  private initApartmentFeaturesForm(): void {
    const apartmentFeaturesFormArray = this.apartmentFormGroup.get('apartment_features') as FormArray;
    apartmentFeaturesFormArray.clear();

    this.apartmentFeatures.forEach(features => {
      apartmentFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          name:    [`apartment_feature_${features.id}`],
          checked: [false],
        })
      );
    });
  }

  get landFormGroup(): FormGroup {
    return this.form.controls["land"] as FormGroup;
  }

  get apartmentFormGroup(): FormGroup {
    return this.form.controls["apartment"] as FormGroup;
  }

  get houseFormGroup(): FormGroup {
    return this.form.controls["house"] as FormGroup;
  }

  back(): void {
    this.router.navigate(['/public/home/project-new/section1']);
  }

  save(): void {
    console.log(this.form);

    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);

    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/section1']);
      this.loadingService.hide();
      }, 1000);
  }

  loadData(): void {
    this.landFeatures = [
      {id: 1, name : "Video vigilancia"},
      {id: 2, name : "Control de Acceso"},
      {id: 3, name : "Parrillas"},
      {id: 4, name : "Areas verdes"},
      {id: 5, name : "Canchas Deportivas"},
      {id: 6, name : "Espacio Co - Work"},
      {id: 7, name : "Gimnasio"},
      {id: 8, name : "Mantenimiento"},
      {id: 9, name : "Seguridad externa (Portico)"},
      {id: 10, name : "Control de acceso al portico"},
    ];

    this.apartmentFeatures = [
      {id: 1, name : "Video vigilancia"},
      {id: 2, name : "Control de Acceso"},
      {id: 3, name : "Parrillas"},
      {id: 4, name : "Areas verdes"},
      {id: 5, name : "Canchas Deportivas"},
      {id: 6, name : "Espacio Co - Work"},
      {id: 7, name : "Gimnasio"},
      {id: 8, name : "Mantenimiento"},
      {id: 9, name : "Seguridad externa (Portico)"},
      {id: 10, name : "Control de acceso al portico"},
      {id: 11, name : "Area de lavanderia"},
      {id: 12, name : "Red Wifi"},
      {id: 13, name : "Calefaccion"},
      {id: 14, name : "Agua Caliente"},
      {id: 15, name : "Piscina"},
    ];

    this.houseFeatures = [
      {id: 1, name : "Video vigilancia"},
      {id: 2, name : "Control de Acceso"},
      {id: 3, name : "Parrillas"},
      {id: 4, name : "Areas verdes"},
      {id: 5, name : "Canchas Deportivas"},
      {id: 6, name : "Espacio Co - Work"},
      {id: 7, name : "Gimnasio"},
      {id: 8, name : "Mantenimiento"},
      {id: 9, name : "Seguridad externa (Portico)"},
      {id: 10, name : "Control de acceso al portico"},
      {id: 11, name : "Area de lavanderia"},
      {id: 12, name : "Red Wifi"},
      {id: 13, name : "Calefaccion"},
      {id: 14, name : "Agua Caliente"}
    ];
  }
}
