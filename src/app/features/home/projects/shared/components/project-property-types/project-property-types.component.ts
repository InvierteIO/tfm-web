import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {StagePropertyGroupDtoMock} from '../../models/stage-property-group.dto.mock.model';
import {Router} from '@angular/router';
import {ProjectMock} from '../../models/project.mock.model';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {
  NgbAccordionBody,
  NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {LoadingService} from '@core/services/loading.service';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {PropertyGroupMock} from '../../models/property-group.mock.model';
import {DocumentMock} from '../../models/document.mock.model';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {ProjectPropertyTypesService} from '../../services/project-property-types.service';
import {Observable, throwError, of} from "rxjs";
import { catchError, concatMap, finalize, map, tap, switchMap} from 'rxjs/operators';
import {FileUtil} from '@common/utils/file.util';
import {StageAssignmentModalComponent} from './stage-assignment-modal.component';
import {PropertyTypeDuplicationModalComponent} from './property-type-duplication-modal.component';
import {ProjectStoreService} from '../../services/project-store.service';
import {ProjectDraftStatus} from '../../models/project-draft-status';
import {ProjectActionStatus} from '../../models/project-action-status';
import {TypeFileIconGoogleFontsPipe} from '@common/pipes/typefile-icon-googlefonts.pipe';
import {CatalogDetailCodes} from '../../models/catalog-detail-code-data.type';
import {CatalogDetailMock} from '../../../../shared/models/catalog-detail.mock.model';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-project-property-types',
  imports: [
    FileDropzoneComponent,
    NgForOf,
    NgIf,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    NgbAccordionDirective
  ],
  templateUrl: './project-property-types.component.html'
})
export class ProjectPropertyTypesComponent implements OnInit {
  @Input()
  public project!: ProjectMock;
  @Input()
  isView: boolean = false;
  stagesPropertyTypes: StagePropertyGroupDtoMock[]= [];
  pathBase?: string;
  public taxIdentificationNumber? : string = "";

  constructor(private readonly router: Router,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService,
              private readonly authService: AuthService,
              private readonly projectPropertyTypeSvc: ProjectPropertyTypesService,
              protected readonly projectStore: ProjectStoreService) {
    this.taxIdentificationNumber = this.authService.getTexIdentificationNumber();
  }

  ngOnInit(): void {
    if(this.projectStore.status() !== ProjectActionStatus.NEW) {
      this.pathBase = `/public/home/project-info/`
    } else {
      this.pathBase = `/public/home/${this.projectStore.draftPathCurrent()}/`;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.taxIdentificationNumber = this.authService.getTexIdentificationNumber();
    console.log('ngOnChanges');
    if (changes['project'] && this.project && this.project.id! > 0) {
      console.log('project init ppt', this.project);
      this.loadData();
    }
  }

  toGoPropertyType(propertyType: PropertyGroupMock |
    undefined, view: boolean | undefined = undefined):void {
    console.log('toGoPropertyType');
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate([`${this.pathBase}property-type`],
        { state: { view, propertyType, project: this.project } });
      this.loadingService.hide();
    }, 500);
  }

  viewPropertyType(propertyType: PropertyGroupMock):void {
    console.log('viewPropertyType');
    this.loadingService.show();
    this.projectPropertyTypeSvc.readStagePropertyGroupByPropertyType(propertyType!, this.taxIdentificationNumber!)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(spgs => {
        propertyType.stagePropertyGroups = spgs;
        this.toGoPropertyType(propertyType, true);
      });
  }

  editPropertyType(propertyType: PropertyGroupMock):void {
    console.log('editPropertyType');
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea ir a editar el tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectPropertyTypeSvc.readStagePropertyGroupByPropertyType(propertyType!, this.taxIdentificationNumber!)
            .pipe(finalize(() => this.loadingService.hide()))
            .subscribe(spgs => {
              propertyType.stagePropertyGroups = spgs;
              this.toGoPropertyType(propertyType);
            });
        }
      });
  }

  deletePropertyType(propertyType: PropertyGroupMock):void {
    console.log('deletePropertyType');
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar el tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectPropertyTypeSvc.removePropertyGroup(propertyType, this.project, this.taxIdentificationNumber!)
          .subscribe(()=>{
            this.loadData();
          })
        }
      });
  }

  deleteStagePropertyType(stagePropertyType: StagePropertyGroupDtoMock):void {
    console.log('deleteStagePropertyType');
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar la asignación de la etapa al tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectPropertyTypeSvc.remove(stagePropertyType, this.project, this.taxIdentificationNumber!)
            .subscribe(()=>{
              this.loadData();
            })
        }
      });
  }

  deleteFile(event:Event, stagePropertyType: StagePropertyGroupDtoMock, fileType: "blueprint" | "template"):void {
    console.log('deleteFile');

    const button = event.currentTarget as HTMLButtonElement;
    let title = button?.title ?? '';
    title = title.toLocaleLowerCase();
    let stagePropertyGroupId : number = stagePropertyType.id ?? 0;
    let documentId: number = (fileType === 'blueprint') ?
      stagePropertyType.architecturalBluetprint?.id ?? 0 :
      stagePropertyType.formatTemplateLoaded?.id ?? 0;

    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea "+title+"?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          this.projectPropertyTypeSvc.removeDocument(this.taxIdentificationNumber!, stagePropertyGroupId, documentId).subscribe({
            next: () => {
              if(fileType == "blueprint") {
                this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.architecturalBluetprint = undefined;
              } else {
                this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.formatTemplateLoaded = undefined;
              }
              this.loadingService.hide();
            },
            error: (err) => {
              console.error('Failed to remove document', err);
              this.loadingService.hide();
            }
          });

        }
      });
  }

  toGoProperties(stagePropertyType: StagePropertyGroupDtoMock) : void {
    console.log('toGoProperties');
    this.loadingService.show();

    this.projectPropertyTypeSvc.readStagePropertyGroupByPropertyType(stagePropertyType?.propertyGroup!, this.taxIdentificationNumber!)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(spgs => {
        stagePropertyType!.propertyGroup!.stagePropertyGroups = spgs ?? [];
        console.log('spgs', spgs);
        this.router.navigate([`${this.pathBase}properties`],
          { state: {  project: this.project,stagePropertyType, projectStages: this.project.projectStages ?? [], originFlow: "PROJECT"} });
      });
  }

  onDropFile(event: DragEvent, stagePropertyType: StagePropertyGroupDtoMock, type: 'blueprint' | 'template'): void {
    console.log('onDropFile');
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped [${type}] en fila ${stagePropertyType.propertyGroup?.name}:`,
        file.name, file.type);

      this.loadFile(type, file, stagePropertyType);
    }
  }

  onFileSelected(event: Event, stagePropertyType: StagePropertyGroupDtoMock , type: 'blueprint' | 'template'): void {
    console.log('onFileSelected');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected [${type}] en fila ${stagePropertyType.propertyGroup?.name}:`, file.name, file.type);
      input.value = '';
      this.loadFile(type, file, stagePropertyType);
    }
  }

  loadFile(type: string, file: File, stagePropertyType: StagePropertyGroupDtoMock) {
    console.log('loadFile');
    switch (type) {
      case 'blueprint': this.loadBlueprint(file, stagePropertyType); break;
      case 'template': this.loadTemplate(file, stagePropertyType); break;
    }
  }

  loadTemplate(file: File, stagePropertyType: StagePropertyGroupDtoMock) {
    console.log('loadTemplate');
    if(!FileUtil.validateFileExtensionMessage(file, ['xls','xlsx'])) return;
    this.loadingService.show();
    this.createDocumentMock(file,'template', stagePropertyType).subscribe({
      next: (document : DocumentMock) => {
        this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.formatTemplateLoaded = document;
        this.loadingService.hide();
      },
      error: (err: any) => {
        console.error('Upload failed', err);
        this.loadingService.hide();
      }
    });

  }

  loadBlueprint(file: File, stagePropertyType: StagePropertyGroupDtoMock) {
    console.log('loadBlueprint');
    if(!FileUtil.validateFileExtensionMessage(file)) return;
    this.loadingService.show();
    this.createDocumentMock(file,'blueprint', stagePropertyType).subscribe({
      next: (document : DocumentMock) => {
        this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.architecturalBluetprint = document;
        this.loadingService.hide();
      },
      error: (err: any) => {
        console.error('Upload failed', err);
        this.loadingService.hide();
      }
    });

  }

  createDocumentMock(file: File, fileType: 'blueprint'| 'template', stagePropertyType: StagePropertyGroupDtoMock): Observable<DocumentMock> {
    console.log('createDocumentMock');
    if(stagePropertyType.id == undefined){
      return of();
    }

    const catalogCode = (fileType === 'blueprint') ? CatalogDetailCodes.BLUEPRINT : CatalogDetailCodes.TEMPLATE;
    const documentBase: DocumentMock = {
      description: 'None',
      catalogDetail: {
        code: catalogCode
      } as CatalogDetailMock
    } as DocumentMock;
    return this.projectPropertyTypeSvc.uploadDocument(this.taxIdentificationNumber!, stagePropertyType.id, file, documentBase)
    .pipe(
      map((uploadedDoc: DocumentMock) => uploadedDoc)
    );
  }

  downloadFile(file: DocumentMock | undefined): void {
    console.log('downloadFile');
    if (!file || !file.path) {
      return;
    }
    this.loadingService.show();
    this.projectPropertyTypeSvc.downloadFile(file)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe();
  }

  viewDocument(file: DocumentMock): void {
    console.log('viewDocument');
    const extension = file.filename?.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      this.viewPdf(file);
    } else {
      this.ksModalGallerySvc
        .removeAllImages("blueprint")
        .addImage("blueprint", file)
        .viewImage("blueprint", file);
    }
  }

  viewPdf(file: DocumentMock): void {
    console.log('viewPdf');
    const modalRef = this.modalService.open(PdfViewerModalComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'pdf-viewer-modal'
    });

    modalRef.componentInstance.title = file.filename ?? '';
    modalRef.componentInstance.pdfUrl = file.path ?? '';
  }

  readStagePropertyTypes(propertyGroup: PropertyGroupMock): StagePropertyGroupDtoMock[] {
    return this.stagesPropertyTypes
      .filter(spg => spg.propertyGroup?.id === propertyGroup.id);
  }

  openStageAssignmentModal(propertyGroup: PropertyGroupMock):void {
    console.log('openStageAssignmentModal');
    const modalRef = this.modalService.open(StageAssignmentModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stagesCurrent = this.readStagePropertyTypes(propertyGroup)
      .map(stagePropertyGroup => stagePropertyGroup.stage!)
      .filter((stage, index, stages) =>
        stages.findIndex(g => g && g.id=== stage?.id) === index
      );
    modalRef.componentInstance.projectStages = this.project.projectStages;
    modalRef.componentInstance.propertyGroup = propertyGroup;
    modalRef.result.then((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  openDuplicationPropertyTypeModal(propertyGroup: PropertyGroupMock):void {
    console.log('openDuplicationPropertyTypeModal');
    const modalRef = this.modalService.open(PropertyTypeDuplicationModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.projectStages = this.project.projectStages;
    modalRef.componentInstance.propertyGroup = propertyGroup;
    modalRef.result.then((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    console.log('loadData');
    this.loadingService.show();
    this.projectPropertyTypeSvc.readStagePropertyGroupByProject(this.project, this.taxIdentificationNumber!)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe(spg => {
          console.log('stagesPropertyTypes : ', spg);
          spg.forEach(item => {
            if (!item.propertyGroupDocuments) return;

            item.architecturalBluetprint = item.propertyGroupDocuments.find(
              doc => doc.catalogDetail?.code === CatalogDetailCodes.BLUEPRINT
            );

            item.formatTemplateLoaded = item.propertyGroupDocuments.find(
              doc => doc.catalogDetail?.code === CatalogDetailCodes.TEMPLATE
            );
          });
          this.stagesPropertyTypes = spg;
        });
  }

  get propertyTypes(): PropertyGroupMock [] {
    return this.stagesPropertyTypes
      .map(stage => stage.propertyGroup)
      .filter((group): group is PropertyGroupMock => !!group)
      .filter((group, index, groups) =>
        groups.findIndex(g => g && g.id === group.id) === index
      );
  }

  get isShowTableEmpty() {
    return !this.stagesPropertyTypes || this.stagesPropertyTypes.length === 0;
  }

  get isViewPage() {
    if(this.projectStore.status() === ProjectActionStatus.EDIT) {
      return false;
    }
    if(this.isView) return true;
    return this.projectStore.draftStatus() == ProjectDraftStatus.VIEW;
  }
}
