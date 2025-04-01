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
  open(component: any, options?: NgbModalOptions) {
    this.openCalledWith = { component, options };
    return {
      componentInstance: {},
      result: Promise.resolve('')
    };
  }
}

describe('MembershipComponent', () => {
  let component: MembershipComponent;
  let modalService: NgbModalStub;
  let membershipService: jasmine.SpyObj<MembershipService>;

  beforeEach(() => {
    membershipService = jasmine.createSpyObj('MembershipService', ['readAll', 'create', 'update', 'delete']);
    membershipService.readAll.and.returnValue(of([]));
    membershipService.delete.and.returnValue(of({}));
    modalService = new NgbModalStub();
    component = new MembershipComponent(modalService as unknown as NgbModal, membershipService);
  });

  it('should call list() on init (ngOnInit) and load memberships', () => {
    const mockMemberships = [
      { id: 1, levelName: 'Gold' },
      { id: 2, levelName: 'Platinum' }
    ];
    membershipService.readAll.and.returnValue(of(mockMemberships));
    component.ngOnInit();
    expect(membershipService.readAll).toHaveBeenCalled();
    expect(component.memberships).toEqual(mockMemberships);
    expect(component.loading).toBeFalse();
  });

  it('should reset membershipCurrent and open create modal when create() is called', () => {
    spyOn(component, 'openModal');
    component.membershipCurrent = { id: 5, levelName: 'Silver' };
    component.create();
    expect(component.membershipCurrent).toEqual({});
    expect(component.openModal).toHaveBeenCalledWith('Registrar Membresia');
  });

  it('should set membershipCurrent and open edit modal when update(membership) is called', () => {
    spyOn(component, 'openModal');
    const existingMembership = { id: 10, levelName: 'Gold' };
    component.memberships = [existingMembership];
    component.update(existingMembership);
    expect(component.membershipCurrent).toBe(existingMembership);
    expect(component.openModal).toHaveBeenCalledWith('Editar Membresia');
  });

  it('should open MembershipViewModalComponent with correct data in view(membership)', () => {
    const modalRefSpy = { componentInstance: {} } as any;
    spyOn(modalService, 'open').and.returnValue(modalRefSpy);
    const member = { id: 3, levelName: 'Bronze' };
    component.view(member);
    expect(modalService.open).toHaveBeenCalledWith(MembershipViewModalComponent, { size: 'lg', backdrop: 'static' });
    expect(modalRefSpy.componentInstance.membership).toEqual(member);
    expect(modalRefSpy.componentInstance.title).toBe('Ver membresia');
  });

  describe('openModal(title)', () => {
    it('should open MembershipSaveModalComponent and set instance data and title', () => {
      const fakeModalRef: any = {
        componentInstance: {},
        result: Promise.resolve('OK')
      };
      spyOn(modalService, 'open').and.returnValue(fakeModalRef);
      component.membershipCurrent = { id: 99, levelName: 'Test Level' };
      const modalTitle = 'Editar Membresia';
      spyOn(component, 'list');
      component.openModal(modalTitle);
      expect(modalService.open).toHaveBeenCalledWith(MembershipSaveModalComponent, { size: 'lg', backdrop: 'static' });
      expect(fakeModalRef.componentInstance.membership).toEqual(component.membershipCurrent);
      expect(fakeModalRef.componentInstance.title).toBe(modalTitle);
      fakeModalRef.result.then((result: string) => {
        expect(result).toBe('OK');
        expect(component.list).toHaveBeenCalled();
      });
    });

    it('should not reload list if the modal closes with a non-OK result', async () => {
      const fakeModalRef: any = {
        componentInstance: {},
        result: Promise.resolve('CANCEL')
      };
      spyOn(modalService, 'open').and.returnValue(fakeModalRef);
      spyOn(component, 'list');
      component.openModal('Registrar Membresia');
      await fakeModalRef.result;
      expect(component.list).not.toHaveBeenCalled();
    });
  });

  describe('delete(id)', () => {
    it('should invoke SweetAlert confirmation and delete membership if confirmed', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: true, isDismissed: false, isDenied: false } as SweetAlertResult<any>)
      );
      membershipService.delete.and.returnValue(of({}));
      spyOn(component, 'list');
      component.delete(42);
      tick();
      expect(Swal.fire).toHaveBeenCalled();
      expect(membershipService.delete).toHaveBeenCalledWith(42);
      expect(component.list).toHaveBeenCalled();
    }));

    it('should not delete membership if the user cancels confirmation', fakeAsync(() => {
      spyOn(Swal, 'fire').and.returnValue(
        Promise.resolve({ isConfirmed: false, isDismissed: true, isDenied: false } as SweetAlertResult<any>)
      );
      spyOn(component, 'list');
      component.delete(100);
      tick();
      expect(membershipService.delete).not.toHaveBeenCalled();
      expect(component.list).not.toHaveBeenCalled();
    }));
  });
});
