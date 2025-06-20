import {Component} from '@angular/core';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {ProjectService} from '../../shared/services/project.service';
import {LoadingService} from '@core/services/loading.service';
import {ProjectMock} from "../../shared/models/project.mock.model";
import {ProjectStageDtoMock} from "../../shared/models/project-stage.mock.dto.model";
import {StagePropertyTypeComponent} from "./stage-property-type.component";
import {ProjectStageDetailsComponent} from "./project-stage-details/project-stage-details.component";
import {ProjectStoreService} from '../../shared/services/project-store.service';
import {ProjectActionStatus} from '../../shared/models/project-action-status';
import {ProjectStageDocumentsComponent} from './project-stage-documents/project-stage-documents.component';
import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';
import {ProjectStageClientsComponent} from './project-stage-clients.component';

@Component({
  selector: 'app-project-stage',
  standalone: true,
  imports: [
    NgbNavModule,
    StagePropertyTypeComponent,
    ProjectStageDetailsComponent,
    ProjectStageDocumentsComponent,
    ProjectStageClientsComponent
  ],
  templateUrl: './project-stage.component.html'
})
export class ProjectStageComponent {
  project?: ProjectMock;
  projectStage?: ProjectStageDtoMock;
  private isView = false;
  activeId: string = 'detail';
  documentBluePrintTypes: CatalogDetailMock[] = [];
  documentLegalTypes: CatalogDetailMock[] = [];

  constructor(private readonly router: Router,
              private readonly projectStore: ProjectStoreService) {
    this.loadInfoFromNavigation();

    if((this.project?.id ?? 0) === 0) {
      this.router.navigate(['/public/home/projects']);
    }
    this.loadData();
  }

  private loadInfoFromNavigation(): void {
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
    this.projectStage = nav?.extras.state?.['stage'];
    this.isView = nav?.extras.state?.['view'];
    this.activeId = nav?.extras.state?.['activeId'] ?? 'detail';
  }

  private loadData() {
    this.documentBluePrintTypes = [{
      id: 1,
      code: '00010001',
      name: 'Plano general del proyecto',
    },
      {
        id: 2,
        code: '00010002',
        name: 'Plano de la etapa del proyecto',
      }];
    this.documentLegalTypes= [{
      id: 3,
      code: '00020001',
      name: 'Copia Literal',
    },
      {
        id: 4,
        code: '00020002',
        name: 'Certificado registral inmobiliario',
      },
      {
        id: 5,
        code: '00020003',
        name: 'Licencia de edificacion',
      },{
        id: 6,
        code: '00020004',
        name: 'Partida electronica inmmobiliaria',
      },
      {
        id: 7,
        code: '00020004',
        name: 'Contrato',
      }];
  }
  toProjects(): void {
    this.router.navigate(['/public/home/projects']);
  }

  toProjectInfo() {
    this.router.navigate(['/public/home/project-info'], { state: { project: this.project} });
  }

  get isViewPage() {
    return this.projectStore.status() === ProjectActionStatus.VIEW || this.isView;
  }
}
