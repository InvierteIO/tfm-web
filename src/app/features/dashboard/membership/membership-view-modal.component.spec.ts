import { FormBuilder } from '@angular/forms';
import { MembershipViewModalComponent } from './membership-view-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('MembershipViewModalComponent', () => {
  let component: MembershipViewModalComponent;
  let activeModal: jasmine.SpyObj<NgbActiveModal>;
  let fb: FormBuilder;

  beforeEach(() => {
    activeModal = jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']);
    fb = new FormBuilder();
    component = new MembershipViewModalComponent(activeModal, fb);
  });

  it('should build the form with proper controls', () => {
    const form = component.form;
    expect(form.get('levelname')).toBeTruthy();
    expect(form.get('shortdescription')).toBeTruthy();
    expect(form.get('longdescription')).toBeTruthy();
    expect(form.get('monthlycost')).toBeTruthy();
    expect(form.get('annualcost')).toBeTruthy();
    expect(form.get('maxrealtors')).toBeTruthy();
    expect(form.get('maxprojects')).toBeTruthy();
  });

  it('should reset form with membership data on ngOnInit', () => {
    (component as any).membership = {
      id: 1,
      levelName: 'Gold',
      shortDescription: 'Short',
      longDescription: 'Long',
      monthlyCost: 100,
      annualCost: 1000,
      maxRealtors: 5,
      maxProjects: 10
    };
    component.ngOnInit();
    expect(component.form.value).toEqual({
      levelname: 'Gold',
      shortdescription: 'Short',
      longdescription: 'Long',
      monthlycost: 100,
      annualcost: 1000,
      maxrealtors: 5,
      maxprojects: 10
    });
  });
});
