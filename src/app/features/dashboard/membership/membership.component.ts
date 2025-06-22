import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Membership} from './membership.model';
import {MembershipSaveModalComponent} from './membership-save-modal.component';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {NgForOf, NgIf} from '@angular/common';
import {MembershipService} from './membership.service';
import {LoadingComponent} from '@common/components/loading.component';
import {MembershipViewModalComponent} from './membership-view-modal.component';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [
    MembershipSaveModalComponent,
    NgForOf,
    NgIf,
    LoadingComponent,
    MembershipViewModalComponent
  ],
  templateUrl: './membership.component.html',
  styleUrl: './membership.component.css'
})
export class MembershipComponent implements OnInit {
  memberships: Membership[] = [];
  membershipCurrent?: Membership;
  loading:boolean = false;

  constructor(private readonly modalService: NgbModal,
              private readonly membreshipService: MembershipService) {
  }

  create(): void {
    this.membershipCurrent = {};
    this.openModal("Registrar Membresia");
  }

  ngOnInit(): void {
    this.list();
  }

  list() {
    this.loading = true;
    this.membreshipService.readAll().subscribe(memberships => {
      this.memberships = memberships;
      this.loading = false;
    });
  }

  update(membership: Membership): void {
    this.membershipCurrent = membership;
    this.openModal("Editar Membresia");
  }

  openModal(title: string): void {
    const modalRef = this.modalService.open(MembershipSaveModalComponent, { size: 'lg'
      , backdrop: 'static' });
        modalRef.componentInstance.membership = this.membershipCurrent;
        modalRef.componentInstance.title = title;
        modalRef.result.then((result) => {
        if (result === 'OK') {
          this.list();
        }
    });
  }

  delete(id: number) : void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el registro de membresia?"))
      .then((result) => {
        if (result.isConfirmed) {
          this.membreshipService.delete(id).subscribe(() => this.list());
        }
      });
  }

  view(membership: Membership): void {
    const modalRef = this.modalService.open(MembershipViewModalComponent, { size: 'lg'
      , backdrop: 'static' });
    modalRef.componentInstance.membership = membership;
    modalRef.componentInstance.title = 'Ver membresia';
  }

  get isShowTableEmpty() {
    return !this.memberships || this.memberships.length === 0;
  }
}
