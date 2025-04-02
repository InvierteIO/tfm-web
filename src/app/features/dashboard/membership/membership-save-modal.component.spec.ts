import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MembershipSaveModalComponent } from './membership-save-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MembershipService } from './membership.service';
import { FormUtil } from '@common/utils/form.util';

describe('MembershipSaveModalComponent', () => {
  let component: MembershipSaveModalComponent;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let membershipService: jasmine.SpyObj<MembershipService>;
  let fb: FormBuilder;

  beforeEach(() => {
    activeModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    membershipService = jasmine.createSpyObj('MembershipService', ['create', 'update']);
    fb = new FormBuilder();
    component = new MembershipSaveModalComponent(activeModal, fb, membershipService);
  });

  it('should initialize and load membership data into form on ngOnInit', () => {
    component['membership'] = {
      id: 1,
      levelName: 'Gold',
      shortDescription: 'Short desc',
      longDescription: 'Long desc',
      monthlyCost: 100,
      annualCost: 1000,
      maxRealtors: 5,
      maxProjects: 10
    };
    component.ngOnInit();
    expect(component.form.value).toEqual({
      levelname: 'Gold',
      shortdescription: 'Short desc',
      longdescription: 'Long desc',
      monthlycost: 100,
      annualcost: 1000,
      maxrealtors: 5,
      maxprojects: 10
    });
  });

  it('should mark form as touched and not save if form is invalid', () => {
    spyOn(FormUtil, 'markAllAsTouched');
    component.form.get('levelname')!.setValue('');
    component.save();
    expect(FormUtil.markAllAsTouched).toHaveBeenCalledWith(component.form);
    expect(membershipService.create).not.toHaveBeenCalled();
    expect(membershipService.update).not.toHaveBeenCalled();
  });

  describe('when saving in create mode', () => {
    beforeEach(() => {
      component['membership'] = {};
      component.form.setValue({
        levelname: 'Silver',
        shortdescription: 'Desc',
        longdescription: 'Long Desc',
        monthlycost: 50,
        annualcost: 500,
        maxrealtors: 3,
        maxprojects: 6
      });
      expect(component.form.valid).toBeTrue();
    });

    it('should call create and close modal on success', () => {
      membershipService.create.and.returnValue(of({ id: 123 }));
      component.save();
      expect(membershipService.create).toHaveBeenCalledWith(jasmine.objectContaining({
        levelName: 'Silver',
        shortDescription: 'Desc',
        longDescription: 'Long Desc',
        monthlyCost: 50,
        annualCost: 500,
        maxRealtors: 3,
        maxProjects: 6
      }));
      expect(activeModal.close).toHaveBeenCalledWith("OK");
      expect(component.loading).toBeFalse();
      expect(component['membership']).toEqual({});
    });

    it('should set loading to false on create error', () => {
      membershipService.create.and.returnValue(throwError(() => new Error('Error')));
      component.save();
      expect(membershipService.create).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(activeModal.close).not.toHaveBeenCalled();
    });
  });

  describe('when saving in update mode', () => {
    beforeEach(() => {
      component['membership'] = { id: 10, levelName: 'Old' };
      component.form.setValue({
        levelname: 'Updated',
        shortdescription: 'Updated Short',
        longdescription: 'Updated Long',
        monthlycost: 75,
        annualcost: 750,
        maxrealtors: 4,
        maxprojects: 8
      });
      expect(component.form.valid).toBeTrue();
    });

    it('should call update and close modal on success', () => {
      membershipService.update.and.returnValue(of({ id: 10, levelName: 'Updated' }));
      component.save();
      expect(membershipService.update).toHaveBeenCalledWith(10, jasmine.objectContaining({
        levelName: 'Updated',
        shortDescription: 'Updated Short',
        longDescription: 'Updated Long',
        monthlyCost: 75,
        annualCost: 750,
        maxRealtors: 4,
        maxProjects: 8
      }));
      expect(activeModal.close).toHaveBeenCalledWith("OK");
      expect(component.loading).toBeFalse();
      expect(component['membership']).toEqual({});
    });

    it('should set loading to false on update error', () => {
      membershipService.update.and.returnValue(throwError(() => new Error('Error')));
      component.save();
      expect(membershipService.update).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(activeModal.close).not.toHaveBeenCalled();
    });
  });

  it('should capture data correctly from form into membership', () => {
    component.form.setValue({
      levelname: 'Bronze',
      shortdescription: 'Desc Bronze',
      longdescription: 'Long Bronze',
      monthlycost: 30,
      annualcost: 300,
      maxrealtors: 2,
      maxprojects: 4
    });
    component['membership'] = {};
    component['captureData']();
    expect(component['membership']).toEqual({
      levelName: 'Bronze',
      shortDescription: 'Desc Bronze',
      longDescription: 'Long Bronze',
      monthlyCost: 30,
      annualCost: 300,
      maxRealtors: 2,
      maxProjects: 4
    });
  });

  it('should clean data correctly', () => {
    component.loading = true;
    component['membership'] = { levelName: 'Test' };
    component.form.setValue({
      levelname: 'Test',
      shortdescription: 'Test',
      longdescription: 'Test',
      monthlycost: 1,
      annualcost: 10,
      maxrealtors: 1,
      maxprojects: 1
    });
    component['cleanData']();
    expect(component.loading).toBeFalse();
    expect(component['membership']).toEqual({});
    expect(component.form.get('levelname')!.value).toBeNull();
  });

  it('should return correct validation getter values', () => {
    const form = component.form;
    form.get('levelname')!.setValue('');
    form.get('levelname')!.markAsTouched();
    expect(component.isLevelNameNotValid).toBeTrue();

    form.get('shortdescription')!.setValue('');
    form.get('shortdescription')!.markAsTouched();
    expect(component.isShortDescriptionNotValid).toBeTrue();

    form.get('longdescription')!.setValue('');
    form.get('longdescription')!.markAsTouched();
    expect(component.isLongDescriptionNotValid).toBeFalse();

    form.get('monthlycost')!.setValue('abc');
    form.get('monthlycost')!.markAsTouched();
    expect(component.isMonthlyCostNotValid).toBeTrue();

    form.get('annualcost')!.setValue('def');
    form.get('annualcost')!.markAsTouched();
    expect(component.isAnnualCostNotValid).toBeTrue();

    form.get('maxrealtors')!.setValue('xyz');
    form.get('maxrealtors')!.markAsTouched();
    expect(component.isMaxRealtorsNotValid).toBeTrue();

    form.get('maxprojects')!.setValue('uvw');
    form.get('maxprojects')!.markAsTouched();
    expect(component.isMaxpPojectsNotValid).toBeTrue();
  });
});
