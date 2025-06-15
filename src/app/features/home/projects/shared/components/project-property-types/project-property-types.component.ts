import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {PropertyGroupMock} from '../../models/property-group.mock.model';
import {DocumentMock} from '../../models/document.mock.model';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {ProjectPropertyTypesService} from '../../services/project-property-types.service';
import {finalize} from 'rxjs/operators';
import {FileUtil} from '@common/utils/file.util';
import {StageAssignmentModalComponent} from './stage-assignment-modal.component';
import {PropertyTypeDuplicationModalComponent} from './property-type-duplication-modal.component';

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
  public project: ProjectMock = { id : 0 };
  @Output() goPropertyTypeProcess = new EventEmitter<PropertyGroupMock | undefined>();
  stagesPropertyTypes: StagePropertyGroupDtoMock[]= [];

  constructor(private readonly router: Router,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService,
              private readonly projectPropertyTypeSvc: ProjectPropertyTypesService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  toGoPropertyType(propertyType: PropertyGroupMock | undefined):void {
    this.goPropertyTypeProcess.emit(propertyType);
  }

  get isShowTable() {
    return !this.stagesPropertyTypes || this.stagesPropertyTypes.length === 0;
  }

  duplicatePropertyType(propertyType: PropertyGroupMock):void {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea duplicar el tipo de inmueble?"))
      .then(r => {}) ;
  }

  editPropertyType(propertyType: PropertyGroupMock):void {
    Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea ir a editar el tipo de inmueble?"))
      .then(r => {
        this.goPropertyTypeProcess.emit(propertyType);
      });
  }

  deletePropertyType(propertyType: PropertyGroupMock):void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar el tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.stagesPropertyTypes = this.stagesPropertyTypes
              .filter(pt => pt.propertyGroup?.id !== propertyType.id);
            this.loadingService.hide();
          }, 2000);
        }
      });
  }

  deleteStagePropertyType(stagePropertyType: StagePropertyGroupDtoMock):void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar la asignación de la etapa al tipo de inmueble?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            this.stagesPropertyTypes.splice(this.stagesPropertyTypes.indexOf(stagePropertyType), 1);
            this.loadingService.hide();
          }, 2000);
        }
      });
  }

  deleteFile(event:Event, stagePropertyType: StagePropertyGroupDtoMock, fileType: "blueprint" | "template"):void {
    const button = event.currentTarget as HTMLButtonElement;
    let title = button?.title ?? '';
    title = title.toLocaleLowerCase();
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea "+title+"?"))
      .then(result => {
        if (result.isConfirmed) {
          this.loadingService.show();
          setTimeout(() => {
            if(fileType == "blueprint") {
              this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.architecturalBluetprint = undefined;
            } else {
              this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.formatTemplateLoaded = undefined;
            }
            this.loadingService.hide();
          }, 2000);
        }
      });
  }

  toGoProperties(propertyType: StagePropertyGroupDtoMock) : void {
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/properties'], { state:  { property_type: propertyType } });
      this.loadingService.hide();
    }, 1000);
  }

  onDropFile(event: DragEvent, stagePropertyType: StagePropertyGroupDtoMock, type: 'blueprint' | 'template'): void {
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
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected [${type}] en fila ${stagePropertyType.propertyGroup?.name}:`, file.name, file.type);
      input.value = '';
      this.loadFile(type, file, stagePropertyType);
    }
  }

  loadFile(type: string, file: File, stagePropertyType: StagePropertyGroupDtoMock) {
    switch (type) {
      case 'blueprint': this.loadBlueprint(file, stagePropertyType); break;
      case 'template': this.loadTemplate(file, stagePropertyType); break;
    }
  }

  loadTemplate(file: File, stagePropertyType: StagePropertyGroupDtoMock) {
    if(!FileUtil.validateFileExtensionMessage(file, ['xls','xlsx'])) return;
    this.loadingService.show();
    setTimeout(() => {
      this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.formatTemplateLoaded
        = this.createDocumentMock(file, 'template'); //mock
      this.loadingService.hide();
    }, 1000);
  }

  loadBlueprint(file: File, stagePropertyType: StagePropertyGroupDtoMock) {
    if(!FileUtil.validateFileExtensionMessage(file)) return;
    this.loadingService.show();
    setTimeout(() => {
      this.stagesPropertyTypes.at(this.stagesPropertyTypes.indexOf(stagePropertyType))!.architecturalBluetprint
        = this.createDocumentMock(file, 'blueprint'); //mock
      this.loadingService.hide();
    }, 1000);
  }

  createDocumentMock(file: File, fileType: 'blueprint'| 'template'): DocumentMock {
    const extension = file.name?.toLowerCase().split('.').pop();
    let path :string = "";
    let id :number = this.stagesPropertyTypes.length + (fileType == "blueprint" ? 2 : 1);
    if(fileType == "blueprint"){
      if (extension === 'pdf') path = 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/keyboard-shortcuts-windows.pdf';
      else path= 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/Calendario09-10.PNG';
    } else path= 'https://invierteio-klm.s3.eu-west-1.amazonaws.com/TemplateFormat_InvierteIO.xlsx';

    return {
      id, filename: file.name, name: file.name,
      path,
      createdAt: new Date(),
    } as DocumentMock;
  }

  get propertyTypes(): PropertyGroupMock [] {
    return this.stagesPropertyTypes
      .map(stage => stage.propertyGroup)
      .filter((group): group is PropertyGroupMock => !!group)
      .filter((group, index, groups) =>
        groups.findIndex(g => g && g.id === group.id) === index
      );
  }

  downloadFile(file: DocumentMock | undefined): void {
    if (!file || !file.path) {
      return;
    }
    this.loadingService.show();
    this.projectPropertyTypeSvc.downloadFile(file)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe();
  }

  viewDocument(file: DocumentMock): void {
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

  openStageAssigmentModal(propertyGroup: PropertyGroupMock):void {
    const modalRef = this.modalService.open(StageAssignmentModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stagesCurrent = this.readStagePropertyTypes(propertyGroup)
      .map(stagePropertyGroup => stagePropertyGroup.stage)
      .filter((stage, index, stages) =>
        stages.findIndex(g => g && g.stage=== stage?.stage) === index
      );

    modalRef.componentInstance.propertyGroup = propertyGroup;
    modalRef.result.then((result) => {
      if (result) {
        let stagesSelected = result as string[];
        stagesSelected.forEach(stage => {
          this.stagesPropertyTypes.push({
            stage: { stage, id: (this.propertyTypes.length + 1) }, propertyGroup
          });
        });
      }
    });
  }

  openDuplicationPropertyTypeModal(propertyGroup: PropertyGroupMock):void {
    const modalRef = this.modalService.open(PropertyTypeDuplicationModalComponent, { size: 'lg', backdrop: 'static' });

    modalRef.componentInstance.propertyGroup = propertyGroup;
    modalRef.result.then((result) => {
      if (result) {
        let stagePropertyGroupsSelected = result as StagePropertyGroupDtoMock[];
        stagePropertyGroupsSelected.forEach(spg => this.stagesPropertyTypes.push(spg));
      }
    });
  }

  loadData(): void {

    this.stagesPropertyTypes = [{
      stage : {
        id: 1, stage: "I"
      },
      propertyGroup: {
        id: 1,
        name: "Tipo 1 - Departamento"
      },
    },
      {
        stage : {
          id: 2, stage: "II"
        },
        propertyGroup: {
          id: 1,
          name: "Tipo 1 - Departamento"
        }
      },
      {
        stage : {
          id: 2, stage: "II"
        },
        propertyGroup: {
          id: 2,
          name: "Tipo 1 - Casa"
        },
        architecturalBluetprint: {
          id:1,
          name:"Plano 1",
          filename: "Calendario09-10.PNG",
          path: "https://invierteio-klm.s3.eu-west-1.amazonaws.com/Calendario09-10.PNG"
        }
      },
      {
        stage : {
          id: 3, stage: "III"
        },
        propertyGroup: {
          id: 2,
          name: "Tipo 1 - Casa"
        },
        architecturalBluetprint: {
          id:2,
          path: "https://invierteio-klm.s3.eu-west-1.amazonaws.com/keyboard-shortcuts-windows.pdf",
          filename: "keyboard-shortcuts-windows.pdf",
          name:"Plano 2"
        },
        formatTemplateLoaded: {
          id:3,
          path: "https://invierteio-klm.s3.eu-west-1.amazonaws.com/TemplateFormat_InvierteIO.xlsx",
          filename: "TemplateFormat_InvierteIO.xlsx",
          name:"Plantilla llenado"
        }
      }];
  }

}
