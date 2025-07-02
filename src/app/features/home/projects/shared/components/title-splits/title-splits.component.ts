import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingService} from '@core/services/loading.service';
import {BooleanLabelPipe} from '@common/pipes/boolean-label.pipe';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {LowerCasePipe, NgForOf, NgIf} from '@angular/common';
import {CommercializationCycle} from '../../../../shared/models/commercialization-cycle.mock.model';
import {PropertyDocumentDtoMock} from '../../models/property-document.dto.model.mock';
import {PropertyCategory} from '../../../../../shared/models/property-category.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PropertyDocumentModalComponent} from './property-document-modal.component';
import {DocumentPropertyStep} from './document-property-step.model';
import {ProjectStoreService} from '../../services/project-store.service';
import {ProjectPropertyTypesService} from '../../services/project-property-types.service';
import {StagePropertyGroupDtoMock} from '../../models/stage-property-group.dto.mock.model';
import {ProjectMock} from '../../models/project.mock.model';
import {finalize, map} from 'rxjs/operators';
import {AuthService} from '@core/services/auth.service';

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
  public project: ProjectMock = { id : 0 };
  public taxIdentificationNumber? : string = "";

  constructor(private readonly  router: Router,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService,
              private readonly  projectPropertyTypeSvc: ProjectPropertyTypesService,
              private readonly authService: AuthService,
              protected readonly draftStore: ProjectStoreService) {
    this.taxIdentificationNumber = this.authService.getTexIdentificationNumber();
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
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
    this.loadingService.show();
    this.search();

  }

  search(): void {
    this.loadingService.show();
    this.properties = [];

    this.projectPropertyTypeSvc.readStagePropertyGroupByProject(this.project, this.taxIdentificationNumber!)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(spg => {
          console.log('stagesPropertyTypes : ', spg);
          spg.forEach(item => {
            const propertyDocumentDtoMockList : PropertyDocumentDtoMock[] = this.transformProjectData(item);
            propertyDocumentDtoMockList.forEach(property => {
              console.log('property : ', property);
              this.properties.push(property);
            });
          });
          this.loadingService.hide();
        });
  }

  transformProjectData(stagesPropertyType: any): PropertyDocumentDtoMock[] {
    return stagesPropertyType?.properties.map((property: any) => {
      return {
        id: property.id,
        codeSystem: property.codeSystem,
        codeEnterprise: property.codeEnterprise,
        name: property.name,
        isParkingSpace: property.isParkingSpace,
        isAvailableSale: property.isAvailableSale,
        price: property.price,
        address: property.address,
        commercializationCycle: property.commercializationCycle as CommercializationCycle,
        stagePropertyGroup: {
          stage: {
            id: stagesPropertyType.stage.id,
            stage: stagesPropertyType.stage.stage
          },
          propertyGroup: {
            id: stagesPropertyType.propertyGroup.id,
            name: stagesPropertyType.propertyGroup.name,
            propertyCategory: stagesPropertyType.propertyGroup.propertyCategory as PropertyCategory
          }
        }
      };
    });
  }

  back(): void {
    this.router.navigate([`/public/home/${this.draftStore.draftPathCurrent()}/legal-scope`], { state: { project: this.project } });
  }

  toGoSection1(): void {
    this.router.navigate([`/public/home/${this.draftStore.draftPathCurrent()}/section1`]);
  }

  get isShowTable() {
    return !this.properties || this.properties.length === 0;
  }

}
