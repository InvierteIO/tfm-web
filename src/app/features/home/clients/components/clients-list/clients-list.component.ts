import {Component, OnInit} from '@angular/core';
import {LowerCasePipe, NgForOf, NgIf} from "@angular/common";
import {ClientMock} from '../../models/client.mock.model';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';
import {LoadingService} from '@core/services/loading.service';
import {finalize} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';


@Component({
  selector: 'app-clients-list',
  imports: [
    NgForOf,
    NgIf,
    DropdownSearchComponent,
    LowerCasePipe
  ],
  templateUrl: './clients-list.component.html'
})
export class ClientsListComponent implements OnInit {
  clients: ClientMock[] = [];
  selectedFilter: string = 'Clientes potenciales';
  constructor(private clientsService: ClientService,
              private router: Router,
              private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loadingService.show();
    this.clientsService.getAll()
      .pipe(finalize(()=> this.loadingService.hide()))
      .subscribe((clients: ClientMock[]) => this.clients = clients);
  }

  create(): void {
    this.router.navigate([`/public/home/clients/new`]);
  }

  update(client: ClientMock) {
    this.router.navigate([`/public/home/clients/edit/${client.id}`]);
  }

  view(client: ClientMock) {
    this.router.navigate([`/public/home/clients/view/${client.id}`]);
  }

  delete(number: number) {
    this.loadingService.show();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el cliente?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.hide();
          setTimeout(() => {

          }, 200);
        }
      });
  }

  get isShowTableEmpty() {
    return this.clients.length == 0;
  }
}
