import {Component, OnInit} from '@angular/core';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {LowerCasePipe, NgForOf, NgIf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ClientDtoMock} from '../../shared/models/client.mock.dto.model';
import {FirstLetterCircleDirective} from '@common/directives/first-letter-circle.directive';

@Component({
  selector: 'app-project-stage-clients',
  imports: [
    DropdownSearchComponent,
    LowerCasePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    FirstLetterCircleDirective,
  ],
  templateUrl: './project-stage-clients.component.html'
})
export class ProjectStageClientsComponent implements OnInit {
  selectedFilter: string = 'Clientes potenciales';
  clients?: ClientDtoMock[] = [];

  ngOnInit(): void {
    this.search();
  }


  search(): void {
    this.clients = [{
      id: 1,
      identityDocument: "47123450",
      fullName: "Juan Perez",
      email: "juan_perez@gmail.com",
      identityDocumentType: "DNI",
      phoneNumber: "971234567"
    },
      {
        id: 2,
        identityDocument: "47123451",
        fullName: "Luz Dary Ramirez",
        email: "luz@gmail.com",
        identityDocumentType: "DNI",
        phoneNumber: "971234568"
      },
      {
        id: 3,
        identityDocument: "47123453",
        fullName: "Santiago Gomez",
        email: "santiago@gmail.com",
        identityDocumentType: "DNI",
        phoneNumber: "971234569"
      },
      {
        id: 3,
        identityDocument: "47123454",
        fullName: "Franco Herrera",
        email: "franco@gmail.com",
        identityDocumentType: "DNI",
        phoneNumber: "971234560"
      }];
  }

  get isShowTableEmpty() {
    return !this.clients || this.clients.length === 0;
  }

}
