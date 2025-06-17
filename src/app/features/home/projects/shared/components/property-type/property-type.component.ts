import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {stageRomanValidator} from '@common/validators/stage.validator';
import {Router} from '@angular/router';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {NgForOf, NgIf} from '@angular/common';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {ButtonLoadingComponent} from '@common/components/button-loading.component';
import {FormUtil} from '@common/utils/form.util';
import {positiveNumberValidator} from '@common/validators/positive-number.validator';
import {FeatureMock} from '../../models/feature.mock.model';
import {LandPropertyFeaturesComponent} from './land-property-features.component';
import {PropertyCategory} from '../../../../../shared/models/property-category.model';
import {ApartmentPropertyFeaturesComponent} from './apartment-property-features.component';
import {HousePropertyFeaturesComponent} from './house-property-features.component';
import {LoadingService} from '@core/services/loading.service';
import {NgSelectComponent} from "@ng-select/ng-select";
import {ProjectStageMock} from '../../models/project-stage.mock.model';
import {StagePropertyGroupMock} from '../../models/stage-property-group.mock.model';
import {PropertyGroupMock} from '../../models/property-group.mock.model';
import {StagePropertyGroupDtoMock} from '../../models/stage-property-group.dto.mock.model';
import {PropertyGroupApartmentMock} from '../../models/property-group-apartment.mock.model';
import {PropertyGroupHouseMock} from '../../models/property-group-house.mock.model';
import {PropertyGroupLandMock} from '../../models/property-group-land.mock.model';
import {PropertyFeatureMock} from '../../models/property-feature.mock.model';
import {ProjectPropertyTypesService} from '../../services/project-property-types.service';
import {finalize} from 'rxjs/operators';
import {HouseFloorAreaMock} from '../../models/house-floor-area.mock.model';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {zip} from 'rxjs';

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
  projectStages: ProjectStageMock[] = [];
  propertyGroupCurrent?: PropertyGroupMock;
  titleBreadcrumbPage: string = "Agregar tipo de inmueble";
  isView: boolean = false;

  constructor(private readonly router: Router, private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService,
              private readonly projectPropertyTypesSvc: ProjectPropertyTypesService) {
    this.form = this.buildForm();
    this.loadInfoFromNavigation();
  }

  ngOnInit(): void {
    this.loadDataAsync();
    this.initLandFeaturesForm(
      this.propertyGroupCurrent?.propertyCategory === PropertyCategory.LAND
        ? this.propertyGroupCurrent.propertyFeatures ?? []
        : []
    );
    this.initHouseFeaturesForm(
      this.propertyGroupCurrent?.propertyCategory === PropertyCategory.HOUSE
        ? this.propertyGroupCurrent.propertyFeatures ?? []
        : []
    );
    this.initApartmentFeaturesForm(
      this.propertyGroupCurrent?.propertyCategory === PropertyCategory.APARTMENT
        ? this.propertyGroupCurrent.propertyFeatures ?? []
        : []
    );

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

    if (this.isView) {
      this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      return;
    }

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

    if (this.isView) {
      apt.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      return;
    }
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

  private initLandFeaturesForm(selected: PropertyFeatureMock[] = []): void {
    const landFeaturesFormArray = this.landFormGroup.get('land_features') as FormArray;
    landFeaturesFormArray.clear();

    this.landFeatures.forEach(features => {
      const checked = selected.some(s => s.feature?.id === features.id && s.featureValue === 'SI');
      landFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          checked: [checked],
        })
      );
    });
  }

  private initHouseFeaturesForm(selected: PropertyFeatureMock[] = []): void {
    const houseFeaturesFormArray = this.houseFormGroup.get('house_features') as FormArray;
    houseFeaturesFormArray.clear();

    this.houseFeatures.forEach(features => {
      const checked = selected.some(s => s.feature?.id === features.id && s.featureValue === 'SI');
      houseFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          checked: [checked],
        })
      );
    });
  }

  private initApartmentFeaturesForm(selected: PropertyFeatureMock[] = []): void {
    const apartmentFeaturesFormArray = this.apartmentFormGroup.get('apartment_features') as FormArray;
    apartmentFeaturesFormArray.clear();

    this.apartmentFeatures.forEach(features => {
      const checked = selected.some(s => s.feature?.id === features.id && s.featureValue === 'SI');
      apartmentFeaturesFormArray.push(
        this.fb.group({
          id:      [features.id],
          checked: [checked],
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
    this.router.navigate(['/public/home/project-new/section2']);
  }

  save(): void {
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    console.log(this.form.value);

    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea guardar el tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            if(!this.propertyGroupCurrent) {
              this.projectPropertyTypesSvc.create(this.captureData())
                .pipe(finalize(() => {
                  this.router.navigate(['/public/home/project-new/section2']);
                  this.loadingService.hide();
                })).subscribe();
            } else {
              zip(this.projectPropertyTypesSvc.removePropertyGroup(this.propertyGroupCurrent),
                this.projectPropertyTypesSvc.create(this.captureData()))
                .pipe(finalize(() => {
                  this.router.navigate(['/public/home/project-new/section2']);
                  this.loadingService.hide();
                })).subscribe();
            }
          }, 500);
        }
      });
  }

  private captureData():StagePropertyGroupDtoMock[] {
    let stagePropertyGroups: StagePropertyGroupMock[] = [];
    if(this.form.get('category')?.value === "APARTMENT" && this.form.get('apartment')?.value) {
      return this.buildStagePropertyGroups(this.capturePropertyGroupApartment());
    }
    if(this.form.get('category')?.value === "HOUSE" && this.form.get('house')?.value) {
      return this.buildStagePropertyGroups(this.capturePropertyGroupHouse());
    }
    if(this.form.get('category')?.value === "LAND" && this.form.get('land')?.value) {
      return this.buildStagePropertyGroups(this.capturePropertyGroupLand());
    }
    return stagePropertyGroups;
  }

  private capturePropertyGroupGeneral(): PropertyGroupMock {
    return {
      name: this.form.get('name')?.value,
      propertyCategory: this.form.get('category')?.value,
      perimeter: this.form.get('perimeter')?.value,
      area: this.form.get('area')?.value,
      parkingSpace: this.form.get('parking_space')?.value,
      frontPark: this.form.get('front_park')?.value,
      price: this.form.get('price')?.value,
      currency: this.form.get('currency')?.value,
      annualInterestRate: this.form.get('percentage_rate')?.value,
    };
  }
  private capturePropertyGroupApartment(): PropertyGroupApartmentMock {
    let propertyGroup: PropertyGroupApartmentMock = this.capturePropertyGroupGeneral();
    propertyGroup.propertyCategory = PropertyCategory.APARTMENT;
    propertyGroup.totalBathrooms = this.form.get('apartment')?.value['apartment_total_bathrooms'];
    propertyGroup.totalRooms = this.form.get('apartment')?.value['apartment_total_rooms'];
    propertyGroup.towerLocation = this.form.get('apartment')?.value['apartment_tower_location'];
    propertyGroup.type = this.form.get('apartment')?.value['apartment_type'];
    propertyGroup.areaFloorTwo = this.form.get('apartment')?.value['area_floor_two'];
    propertyGroup.areaFloorThree = this.form.get('apartment')?.value['area_floor_three'];
    let propertyFeatures: PropertyFeatureMock[] = [];
    this.form.get('apartment')?.value['apartment_features'].forEach((feature: any) => {
      if(feature.checked === true) {
        propertyFeatures.push({
           featureValue: "SI",
           feature: { id: feature.id }
        });
      }
    });
    propertyGroup.propertyFeatures = propertyFeatures;
    return propertyGroup;
  }

  private capturePropertyGroupHouse(): PropertyGroupHouseMock {
    let propertyGroup: PropertyGroupHouseMock = this.capturePropertyGroupGeneral();
    propertyGroup.propertyCategory = PropertyCategory.HOUSE;
    propertyGroup.totalBathrooms = this.form.get('house')?.value['house_total_bathrooms'];
    propertyGroup.totalRooms = this.form.get('house')?.value['house_total_rooms'];
    propertyGroup.roofedArea = this.form.get('house')?.value['house_roofed_area'];
    propertyGroup.totalFloors = this.form.get('house')?.value['house_total_floors'];
    propertyGroup.blockLocation = this.form.get('house')?.value['house_block_location'];
    propertyGroup.roadWay = this.form.get('house')?.value['house_road_way'];
    let propertyFeatures: PropertyFeatureMock[] = [];
    this.form.get('house')?.value['house_features'].forEach((feature: any) => {
      if(feature.checked === true) {
        propertyFeatures.push({
          featureValue: "SI",
          feature: { id: feature.id }
        });
      }
    });
    propertyGroup.propertyFeatures = propertyFeatures;
    let houseFloorAreas: HouseFloorAreaMock[] = [];
    this.form.get('house')?.value['house_floor_areas'].forEach((houseFloorArea: any) => {
      houseFloorAreas.push({
        number: houseFloorArea.number,
        area: houseFloorArea.value,
      });
    });
    propertyGroup.houseFloorAreas = houseFloorAreas;
    return propertyGroup;
  }

  private capturePropertyGroupLand(): PropertyGroupLandMock {
    let propertyGroup: PropertyGroupLandMock = this.capturePropertyGroupGeneral();
    propertyGroup.propertyCategory = PropertyCategory.LAND;
    propertyGroup.blockLocation = this.form.get('land')?.value['land_block_location'];
    propertyGroup.roadWay = this.form.get('land')?.value['land_road_way'];
    let propertyFeatures: PropertyFeatureMock[] = [];
    this.form.get('land')?.value['land_features'].forEach((feature: any) => {
      if(feature.checked === true) {
        propertyFeatures.push({
          featureValue: "SI",
          feature: { id: feature.id }
        });
      }
    });
    propertyGroup.propertyFeatures = propertyFeatures;
    return propertyGroup;
  }

  private buildStagePropertyGroups(propertyGroup: (PropertyGroupApartmentMock
    | PropertyGroupHouseMock | PropertyGroupLandMock)): StagePropertyGroupDtoMock[] {
    let stagePropertyGroups: StagePropertyGroupMock[] = [];
    let stages: PropertyGroupMock[] = this.form.get('stages')?.value as PropertyGroupMock[] ;
    stages.forEach((stage: any) => {
      stagePropertyGroups.push({ stage, propertyGroup });
    });
    return stagePropertyGroups;
  }

  private loadDataAsync(): void {
    if(this.propertyGroupCurrent) {
      this.loadInfoForUpdateOrView();
    }

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

  private loadInfoFromNavigation(): void {
    const nav = this.router.getCurrentNavigation();
    this.projectStages = nav?.extras.state?.['project_stages'] ?? [];
    this.propertyGroupCurrent = nav?.extras.state?.['property_type'];
    this.isView = nav?.extras.state?.['view'];
  }

  private loadInfoForUpdateOrView() {
    this.resetForm();
    if(this.isView) {
      this.titleBreadcrumbPage = "Ver tipo de inmueble";
      this.form.disable({ emitEvent: false });
      this.landFormGroup.disable({ emitEvent: false });
      this.apartmentFormGroup.disable({ emitEvent: false });
      this.houseFormGroup.disable({ emitEvent: false });
    } else {
      this.titleBreadcrumbPage = "Editar tipo de inmueble";
    }
  }

  private resetForm(): void {
    this.form.reset({
      name: this.propertyGroupCurrent?.name,
      stages: this.projectStages.filter(stage => this.propertyGroupCurrent?.stagePropertyGroups
          ?.some(spg => spg.stage?.id === stage.id)),
      category: this.propertyGroupCurrent?.propertyCategory,
      perimeter: this.propertyGroupCurrent?.perimeter,
      area: this.propertyGroupCurrent?.area,
      parking_space: this.propertyGroupCurrent?.parkingSpace,
      front_park: this.propertyGroupCurrent?.parkingSpace ? "SI": "NO",
      currency: this.propertyGroupCurrent?.currency,
      price: this.propertyGroupCurrent?.price,
      percentage_rate: this.propertyGroupCurrent?.annualInterestRate,
      land: {
        land_block_location: (this.propertyGroupCurrent as PropertyGroupLandMock).blockLocation,
        land_road_way: (this.propertyGroupCurrent as PropertyGroupLandMock).roadWay
      },
      apartment: {
        apartment_total_bathrooms: (this.propertyGroupCurrent as PropertyGroupApartmentMock).totalBathrooms,
        apartment_total_rooms: (this.propertyGroupCurrent as PropertyGroupApartmentMock).totalRooms,
        area_floor_two: (this.propertyGroupCurrent as PropertyGroupApartmentMock).areaFloorTwo,
        area_floor_three: (this.propertyGroupCurrent as PropertyGroupApartmentMock).areaFloorThree,
        apartment_type: (this.propertyGroupCurrent as PropertyGroupApartmentMock).type,
        apartment_tower_location: (this.propertyGroupCurrent as PropertyGroupApartmentMock).towerLocation
      },
      house: {
        house_total_bathrooms: (this.propertyGroupCurrent as PropertyGroupHouseMock).totalBathrooms,
        house_total_rooms: (this.propertyGroupCurrent as PropertyGroupHouseMock).totalRooms,
        house_roofed_area: (this.propertyGroupCurrent as PropertyGroupHouseMock).roofedArea,
        house_total_floors: (this.propertyGroupCurrent as PropertyGroupHouseMock).totalFloors,
        house_block_location: (this.propertyGroupCurrent as PropertyGroupHouseMock).blockLocation,
        house_road_way: (this.propertyGroupCurrent as PropertyGroupHouseMock).roadWay
      }
    });
  }

  getHouseFloorAreas(propertyGroup: PropertyGroupHouseMock | undefined):HouseFloorAreaMock[]{
    return propertyGroup?.houseFloorAreas ?? [];
  }

}
