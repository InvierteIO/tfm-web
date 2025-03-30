import { of } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { MembershipComponent } from './membership.component';
import { MembershipService } from './membership.service';
import { MembershipSaveModalComponent } from './membership-save-modal.component';
import { MembershipViewModalComponent } from './membership-view-modal.component';
import { NgbModal, NgbModalOptions, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fakeAsync, tick } from '@angular/core/testing';

class NgbModalStub {
  openCalledWith: any;
  // Simulate the open method to return a fake modalRef
  open(component: any, options?: NgbModalOptions) {
    this.openCalledWith = { component, options };
    // Return a fake modalRef with componentInstance and result (promise)
    return {
      componentInstance: {},
      result: Promise.resolve('') // Test will adjust this result as needed
    };
  }
}

describe('MembershipComponent', () => {
  let component: MembershipComponent;
  let modalService: NgbModalStub;
  let membershipService: jasmine.SpyObj<MembershipService>;

  beforeEach(() => {
    // Create a stub of MembershipService with spies for its methods
    membershipService = jasmine.createSpyObj('MembershipService', ['readAll', 'create', 'update', 'delete']);
    // By default, configure readAll to return an empty Observable array
    membershipService.readAll.and.returnValue(of([]));
    // Configure delete to return an empty Observable by default
    membershipService.delete.and.returnValue(of({}));
    // Instantiate the NgbModal stub
    modalService = new NgbModalStub();
    // Instantiate the component injecting the mocks
    component = new MembershipComponent(modalService as unknown as NgbModal, membershipService);
  });

  it('should call list() on init (ngOnInit) and load memberships', () => {
    const mockMemberships = [
      { id: 1, levelName: 'Gold' },
      { id: 2, levelName: 'Platinum' }
    ];
    membershipService.readAll.and.returnValue(of(mockMemberships));
    component.ngOnInit(); // internally calls list()
    expect(membershipService.readAll).toHaveBeenCalled();
    // After subscription, the membership list should be updated
    expect(component.memberships).toEqual(mockMemberships);
    expect(component.loading).toBeFalse();
  });

  it('should reset membershipCurrent and open create modal when create() is called', () => {
    spyOn(component, 'openModal'); // spy on openModal to verify call
    component.membershipCurrent = { id: 5, levelName: 'Silver' }; // previous value
    component.create();
    expect(component.membershipCurrent).toEqual({}); // should be reset to empty object
    expect(component.openModal).toHaveBeenCalledWith('Registrar Membresia');
  });

  it('should set membershipCurrent and open edit modal when update(membership) is called', () => {
    spyOn(component, 'openModal');
    const existingMembership = { id: 10, levelName: 'Gold' };
    component.memberships = [existingMembership];
    component.update(existingMembership);
    // membershipCurrent should point to the provided membership object
    expect(component.membershipCurrent).toBe(existingMembership);
    expect(component.openModal).toHaveBeenCalledWith('Editar Membresia');
  });

  it('should open MembershipViewModalComponent with correct data in view(membership)', () => {
    const modalRefSpy = { componentInstance: {} } as any;
    spyOn(modalService, 'open').and.returnValue(modalRefSpy);
    const member = { id: 3, levelName: 'Bronze' };
    component.view(member);
    // Verify that the modal is opened with the correct component and options
    expect(modalService.open).toHaveBeenCalledWith(MembershipViewModalComponent, { size: 'lg', backdrop: 'static' });
    // Verify that the data is correctly passed to the modal instance
    expect(modalRefSpy.componentInstance.membership).toEqual(member);
    expect(modalRefSpy.componentInstance.title).toBe('Ver membresia');
  });

  describe('openModal(title)', () => {
    it('should open MembershipSaveModalComponent and set instance data and title', () => {
      // Prepare a fake modalRef object
      const fakeModalRef: any = {
        componentInstance: {},
        result: Promise.resolve('OK')
      };
      spyOn(modalService, 'open').and.returnValue(fakeModalRef);
      component.membershipCurrent = { id: 99, levelName: 'Test Level' };
      const modalTitle = 'Editar Membresia';
      // Spy on component.list to verify it gets called on OK result
      spyOn(component, 'list');
      // Call openModal
      component.openModal(modalTitle);
      // Verify that modalService.open was called with the correct component and options
      expect(modalService.open).toHaveBeenCalledWith(MembershipSaveModalComponent, { size: 'lg', backdrop: 'static' });
      // The modal's componentInstance should receive the current membership and title
      expect(fakeModalRef.componentInstance.membership).toEqual(component.membershipCurrent);
      expect(fakeModalRef.componentInstance.title).toBe(modalTitle);
      // Simulate the modal closing with result "OK"
      fakeModalRef.result.then((result: string) => {
        // If the result is OK, list() should have been called
        expect(result).toBe('OK');
        expect(component.list).toHaveBeenCalled();
      });
    });

    it('should not reload list if the modal closes with a non-OK result', async () => {
      // Simulate a modalRef whose promise resolves with a value different than "OK"
      const fakeModalRef: any = {
        componentInstance: {},
        result: Promise.resolve('CANCEL')
      };
      spyOn(modalService, 'open').and.returnValue(fakeModalRef);
      spyOn(component, 'list');
      component.openModal('Registrar Membresia');
      // Wait for promise resolution
      await fakeModalRef.result;
      // Since the result is not "OK", list() should not be called
      expect(component.list).not.toHaveBeenCalled();
    });
  });

  describe('delete(id)', () => {
    it('should invoke SweetAlert confirmation and delete membership if confirmed', fakeAsync(() => {
      // Configure Swal.fire to simulate user confirmation
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true, isDismissed: false, isDenied: false } as SweetAlertResult<any>)
      );
      // Ensure membershipService.delete returns an Observable and spy on list()
      membershipService.delete.and.returnValue(of({}));
      spyOn(component, 'list');
      // Call the delete method
      component.delete(42);
      // Advance microtask queue to resolve Swal.fire promise
      tick();
      // Verify that Swal.fire was called (with question options, though we're not checking the exact object)
      expect(Swal.fire).toHaveBeenCalled();
      // After confirmation, membershipService.delete should be called with the correct ID
      expect(membershipService.delete).toHaveBeenCalledWith(42);
      // And after successful deletion, list() should be called to reload data
      expect(component.list).toHaveBeenCalled();
    }));

    it('should not delete membership if the user cancels confirmation', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: false, isDismissed: true, isDenied: false } as SweetAlertResult<any>)
      );
      spyOn(component, 'list');
      component.delete(100);
      tick();
      // If isConfirmed is false, membershipService.delete should not be called
      expect(membershipService.delete).not.toHaveBeenCalled();
      // And the list should not be reloaded
      expect(component.list).not.toHaveBeenCalled();
    }));
  });
});
