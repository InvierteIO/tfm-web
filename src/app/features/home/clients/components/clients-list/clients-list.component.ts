import {Component, OnInit} from '@angular/core';
import {LowerCasePipe, NgForOf, NgIf} from "@angular/common";
import {ClientMock} from '../../models/client.mock.model';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {ClientService} from '../../services/client.service';
import {Router} from '@angular/router';
import {LoadingService} from '@core/services/loading.service';
import {finalize} from 'rxjs/operators';


@Component({
  selector: 'app-clients-list',
  imports: [
    NgForOf,
    NgIf,
    DropdownSearchComponent,
    LowerCasePipe
  ],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
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

  }

  update(client: ClientMock) {

  }

  view(client: ClientMock) {

  }

  delete(number: number) {

  }

  get isShowTableEmpty() {
    return this.clients.length == 0;
  }
}
