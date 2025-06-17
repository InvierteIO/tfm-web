import {Component, Input, OnInit} from '@angular/core';
import {StagePropertyGroupDtoMock} from '../../shared/models/stage-property-group.dto.mock.model';
import {LoadingService} from '@core/services/loading.service';
import {Router} from '@angular/router';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {FileUtil} from '@common/utils/file.util';
import {DocumentMock} from '../../shared/models/document.mock.model';
import {finalize} from 'rxjs/operators';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectPropertyTypesService} from '../../shared/services/project-property-types.service';
import {ProjectMock} from '../../shared/models/project.mock.model';
import {ProjectStageDtoMock} from '../../shared/models/project-stage.mock.dto.model';

@Component({
  selector: 'app-stage-property-type',
  imports: [
    FileDropzoneComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './stage-property-types.component.html'
})
export class StagePropertyTypeComponent implements OnInit  {
  @Input()
  project?: ProjectMock;
  @Input()
  projectStage?: ProjectStageDtoMock;
  stagesPropertyTypes: StagePropertyGroupDtoMock[]= [];

  constructor(private readonly  router: Router,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService,
              private readonly projectPropertyTypeSvc: ProjectPropertyTypesService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loadData();
    }, 500);
  }
  toGoGeneralPropertyType(): void {
    this.router.navigate(['/public/home/project-info/'], {
      state: { project: this.project, stage: this.projectStage, activeId: 'propertytypes' }
    });
  }

  toGoProperties(propertyType: StagePropertyGroupDtoMock) : void {
    this.loadingService.show();
    setTimeout(() => {
      this.router.navigate(['/public/home/project-new/properties'], { state:  { property_type: propertyType } });
      this.loadingService.hide();
    }, 1000);
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

  get isShowTableEmpty() {
    return !this.stagesPropertyTypes || this.stagesPropertyTypes.length === 0;
  }

  private loadData(): void {
    this.stagesPropertyTypes = [
      {
      stage : {
        id: 1, stage: "I"
      },
      propertyGroup: {
        name: "Tipo 1 - Departamento"
      }
    },
      {
        stage : {
          id: 3, stage: "I"
        },
        propertyGroup: {
          name: "Tipo 1 - Casa"
        },
        architecturalBluetprint: {
          id:2,
          name:"Plano 2"
        },
        formatTemplateLoaded: {
          id:3,
          name:"Plantilla llenado"
        }
      }];
  }
}
