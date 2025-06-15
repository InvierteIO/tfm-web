import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormArray, FormGroup } from '@angular/forms';
import { PropertyTypeComponent } from './property-type.component';
import { PropertyCategory } from '../../../../shared/models/property-category.model';
import { FormUtil } from '@common/utils/form.util';

describe('PropertyTypeComponent', () => {
  let component: PropertyTypeComponent;
  let fixture: ComponentFixture<PropertyTypeComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [PropertyTypeComponent],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(PropertyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Ejecuta ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit initialization', () => {
    it('should initialize feature arrays and disable all sub-forms initially', () => {
      expect(component.landFeatures.length).toBe(10);
      expect(component.landFeatures[0].name).toBe('Video vigilancia');
      expect(component.landFeatures[component.landFeatures.length - 1].id).toBe(10);
      expect(component.apartmentFeatures.length).toBe(15);
      expect(component.apartmentFeatures[component.apartmentFeatures.length - 1].name).toBe('Piscina');
      expect(component.houseFeatures.length).toBe(14);
      expect(component.houseFeatures[component.houseFeatures.length - 1].name).toBe('Agua Caliente');
      expect(component.landFormGroup.disabled).toBeTrue();
      expect(component.apartmentFormGroup.disabled).toBeTrue();
      expect(component.houseFormGroup.disabled).toBeTrue();
      expect(component.apartmentFormGroup.get('area_floor_two')!.disabled).toBeTrue();
      expect(component.apartmentFormGroup.get('area_floor_three')!.disabled).toBeTrue();
    });

    it('should contain all required form controls after buildForm', () => {
      expect(component.form.get('name')).toBeTruthy();
      expect(component.form.get('stages')).toBeTruthy();
      expect(component.form.get('category')).toBeTruthy();
      expect(component.form.get('perimeter')).toBeTruthy();
      expect(component.form.get('price')).toBeTruthy();
      expect(component.form.get('land.land_block_location')).toBeTruthy();
      expect(component.form.get('apartment.apartment_total_rooms')).toBeTruthy();
      expect(component.form.get('house.house_total_floors')).toBeTruthy();
      expect(component.form.get('name')!.hasError('required')).toBeTrue();
      component.form.get('perimeter')!.setValue('abc');
      expect(component.form.get('perimeter')!.hasError('notANumber')).toBeTrue();
    });
  });

  describe('onCategoryChange', () => {
    it('should enable only the land form group when category LAND is selected', () => {
      component.form.get('category')!.setValue(PropertyCategory.LAND);
      expect(component.landFormGroup.disabled).toBeFalse();
      expect(component.apartmentFormGroup.disabled).toBeTrue();
      expect(component.houseFormGroup.disabled).toBeTrue();
    });

    it('should enable only the apartment form group when category APARTMENT is selected', () => {
      component.form.get('category')!.setValue(PropertyCategory.APARTMENT);
      expect(component.landFormGroup.disabled).toBeTrue();
      expect(component.apartmentFormGroup.disabled).toBeFalse();
      expect(component.houseFormGroup.disabled).toBeTrue();
    });

    it('should enable only the house form group when category HOUSE is selected', () => {
      component.form.get('category')!.setValue(PropertyCategory.HOUSE);
      expect(component.landFormGroup.disabled).toBeTrue();
      expect(component.apartmentFormGroup.disabled).toBeTrue();
      expect(component.houseFormGroup.disabled).toBeFalse();
    });

    it('should leave all form groups disabled when category is unrecognized or empty', () => {
      component.form.get('category')!.setValue('UNKNOWN');
      expect(component.landFormGroup.disabled).toBeTrue();
      expect(component.apartmentFormGroup.disabled).toBeTrue();
      expect(component.houseFormGroup.disabled).toBeTrue();
    });

  });

  describe('onApartmentTypeChange', () => {
    beforeEach(() => {
      component.form.get('category')!.setValue(PropertyCategory.APARTMENT);
    });

    it('should enable second floor area for DUPLEX and keep third floor disabled', () => {
      component.apartmentFormGroup.get('apartment_type')!.setValue('DUPLEX');
      expect(component.apartmentFormGroup.get('area_floor_two')!.disabled).toBeFalse();
      expect(component.apartmentFormGroup.get('area_floor_three')!.disabled).toBeTrue();
    });

    it('should enable second and third floor areas for TRIPLEX', () => {
      component.apartmentFormGroup.get('apartment_type')!.setValue('TRIPLEX');
      expect(component.apartmentFormGroup.get('area_floor_two')!.disabled).toBeFalse();
      expect(component.apartmentFormGroup.get('area_floor_three')!.disabled).toBeFalse();
    });

    it('should disable both floor area fields for other apartment types', () => {
      component.apartmentFormGroup.get('apartment_type')!.setValue('SIMPLEX');
      expect(component.apartmentFormGroup.get('area_floor_two')!.disabled).toBeTrue();
      expect(component.apartmentFormGroup.get('area_floor_three')!.disabled).toBeTrue();
    });

    it('should call updateValueAndValidity on apartment form group after type change', () => {
      const aptGroup = component.apartmentFormGroup;
      const updateSpy = spyOn(aptGroup, 'updateValueAndValidity').and.callThrough();
      component.apartmentFormGroup.get('apartment_type')!.setValue('TRIPLEX');
    });
  });

  describe('initLandFeaturesForm', () => {
    it('should create a form control for each land feature in the array', () => {
      component.landFeatures = [
        { id: 101, name: 'Test Feature A' },
        { id: 102, name: 'Test Feature B' }
      ];
      component['initLandFeaturesForm']();
      const landFeaturesArray = component.landFormGroup.get('land_features') as FormArray;
      expect(landFeaturesArray.length).toBe(2);
      const firstFeatureGroup = landFeaturesArray.at(0) as FormGroup;
      const secondFeatureGroup = landFeaturesArray.at(1) as FormGroup;
      expect(firstFeatureGroup.get('id')!.value).toBe(101);
      expect(firstFeatureGroup.get('name')!.value).toBe('land_feature_101');
      expect(firstFeatureGroup.get('checked')!.value).toBeFalse();
      expect(secondFeatureGroup.get('id')!.value).toBe(102);
      expect(secondFeatureGroup.get('name')!.value).toBe('land_feature_102');
      expect(secondFeatureGroup.get('checked')!.value).toBeFalse();
    });
  });

  describe('initHouseFeaturesForm', () => {
    it('should create a form control for each house feature in the array', () => {
      component.houseFeatures = [
        { id: 201, name: 'House Feature X' }
      ];
      component['initHouseFeaturesForm']();
      const houseFeaturesArray = component.houseFormGroup.get('house_features') as FormArray;
      expect(houseFeaturesArray.length).toBe(1);
      const featureGroup = houseFeaturesArray.at(0) as FormGroup;
      expect(featureGroup.get('id')!.value).toBe(201);
      expect(featureGroup.get('name')!.value).toBe('house_feature_201');
      expect(featureGroup.get('checked')!.value).toBeFalse();
    });
  });

  describe('initApartmentFeaturesForm', () => {
    it('should create a form control for each apartment feature in the array', () => {
      component.apartmentFeatures = [
        { id: 301, name: 'Apartment Feature Y' },
        { id: 302, name: 'Apartment Feature Z' }
      ];
      component['initApartmentFeaturesForm']();
      const aptFeaturesArray = component.apartmentFormGroup.get('apartment_features') as FormArray;
      expect(aptFeaturesArray.length).toBe(2);
      const first = aptFeaturesArray.at(0) as FormGroup;
      const second = aptFeaturesArray.at(1) as FormGroup;
      expect(first.get('id')!.value).toBe(301);
      expect(first.get('name')!.value).toBe('apartment_feature_301');
      expect(first.get('checked')!.value).toBeFalse();
      expect(second.get('id')!.value).toBe(302);
      expect(second.get('name')!.value).toBe('apartment_feature_302');
      expect(second.get('checked')!.value).toBeFalse();
    });
  });

  describe('back', () => {
    it('should navigate to the previous section on back()', () => {
      component.back();
      expect(router.navigate).toHaveBeenCalledOnceWith(['/public/home/project-new/section1']);
    });
  });

  describe('save', () => {
    it('should mark all controls as touched and stop submission if form is invalid', () => {
      expect(component.form.invalid).toBeTrue();
      const markSpy = spyOn(FormUtil, 'markAllAsTouched').and.callThrough();
      const consoleSpy = spyOn(console, 'log');
      component.save();
      expect(markSpy).toHaveBeenCalledWith(component.form);
      expect(component.form.get('name')!.touched).toBeTrue();
      expect(consoleSpy.calls.argsFor(1)[0]).toBe('Form invalid!!');
    });

    it('should log form value and not call markAllAsTouched if form is valid', () => {
      component.form.get('name')!.setValue('Test Name');
      component.form.get('stages')!.setValue('I');
      component.form.get('category')!.setValue(PropertyCategory.LAND);
      component.form.get('perimeter')!.setValue('100');
      component.form.get('area')!.setValue('200');
      component.form.get('parking_space')!.setValue('Yes');
      component.form.get('front_park')!.setValue('Yes');
      component.form.get('currency')!.setValue('USD');
      component.form.get('price')!.setValue('50000');
      component.form.get('percentage_rate')!.setValue('5');
      component.landFormGroup.get('land_block_location')!.setValue('Block A');
      component.landFormGroup.get('land_road_way')!.setValue('North');
      expect(component.form.valid).toBeTrue();
      const consoleSpy = spyOn(console, 'log');
      component.save();
      expect(component.form.invalid).toBeFalse();
      const loggedValue = consoleSpy.calls.argsFor(1)[0];
      expect(loggedValue.name).toBe('Test Name');
      expect(loggedValue.category).toBe(PropertyCategory.LAND);
      expect(loggedValue.land.land_block_location).toBe('Block A');
      expect(loggedValue.apartment).toBeUndefined();
      expect(loggedValue.house).toBeUndefined();
    });
  });
});
