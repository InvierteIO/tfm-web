import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '@core/services/loading.service';
import {BooleanLabelPipe} from '@common/pipes/boolean-label.pipe';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {LowerCasePipe, NgForOf, NgIf} from '@angular/common';
import {CommercializationCycle} from '../../../shared/models/commercialization-cycle.mock.model';
import {PropertyDocumentDtoMock} from '../../shared/models/property-document.dto.model.mock';
import {PropertyCategory} from '../../../../shared/models/property-category.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PropertyDocumentModalComponent} from './property-document-modal.component';
import {DocumentPropertyStep} from './document-property-step.model';

@Component({
  selector: 'app-title-splits',
  imports: [
    BooleanLabelPipe,
    DropdownSearchComponent,
    FormsModule,
    LowerCasePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './title-splits.component.html'
})
export class TitleSplitsComponent  implements OnInit {
  protected  readonly DOCUMENT_PROPERTY_STEP = DocumentPropertyStep;
  properties: PropertyDocumentDtoMock[] = [];
  selectedFilter: string = 'Nombre';

  constructor(private readonly  router: Router,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService) {

  }

  openModalDocumentsModal(event:Event, property: PropertyDocumentDtoMock, step: DocumentPropertyStep): void {
    const button = event.currentTarget as HTMLButtonElement;
    const title = button?.title ?? '';
    const modalRef = this.modalService.open(PropertyDocumentModalComponent, { size: 'lg'
      , backdrop: 'static' });
    modalRef.componentInstance.subtitle = title;
    modalRef.componentInstance.property = property;
    modalRef.componentInstance.step = step;
  }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loadingService.show();
    setTimeout(() => {
      this.properties = [
        {
          id: 1,
          codeSystem: '00000001',
          codeEnterprise: 'T1000001',
          name: 'Casa 1',
          isParkingSpace: false,
          isAvailableSale: true,
          price: 120000,
          address: 'Calle ABC',
          commercializationCycle: CommercializationCycle.PRE_SALES,
          stagePropertyGroup: {
            stage: {
              id: 1,
              stage: "I",
            },
            propertyGroup: {
              id: 1,
              name: "Tipo 1 - Casa",
              propertyCategory: PropertyCategory.HOUSE
            }
          }
        }
      ];
      this.loadingService.hide();
    }, 1000);
  }

  back(): void {
    this.router.navigate(['/public/home/project-new/legal-scope']);
  }

  toGoSection1(): void {
    this.router.navigate(['/public/home/project-new/section1']);
  }

  get isShowTable() {
    return !this.properties || this.properties.length === 0;
  }

}
