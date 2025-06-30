import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ButtonLoadingComponent} from "@common/components/button-loading.component";
import {FileDropzoneComponent} from "@common/components/file-dropzone.component";
import Swal from "sweetalert2";
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from "@common/dialogs/dialogs-swal.constants";
import {ProjectDocumentMock} from "../../shared/models/project-document.mock.model";
import {ProjectMock} from "../../shared/models/project.mock.model";
import {TypeFileIconGoogleFontsPipe} from "@common/pipes/typefile-icon-googlefonts.pipe";
import {LoadingService} from "@core/services/loading.service";
import {FormUtil} from '@common/utils/form.util';
import {FileUtil} from '@common/utils/file.util';
import {GalleryModule} from '@ks89/angular-modal-gallery';
import {KsModalGalleryService} from '@core/services/ks-modal-gallery.service';
import {Document} from '@core/models/document.model';
import {PdfViewerModalComponent} from '@common/components/pdf-viewer-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectMultimediaComponent} from '../../shared/components/project-multimedia/project-multimedia.component';
import {
  LocationInformationComponent
} from '../../shared/components/location-information/location-information.component';
import {ProjectStoreService} from '../../shared/services/project-store.service';
import {ProjectDraftStatus} from '../../shared/models/project-draft-status';
import {finalize, map, tap} from 'rxjs/operators';
import {Observable, throwError, of, forkJoin,} from "rxjs";
import {ProjectService} from '../../shared/services/project.service';
import {ProjectStageMock} from '../../shared/models/project-stage.mock.model';
import {LocationCode} from '../../shared/models/location-code.mock.model';
import {CatalogDetailCodes} from '../../shared/models/catalog-detail-code-data.type';
import {CatalogDetailMock} from '../../../shared/models/catalog-detail.mock.model';
import {AuthService} from '@core/services/auth.service';

@Component({
  selector: 'app-complementary',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    ButtonLoadingComponent,
    FileDropzoneComponent,
    DatePipe,
    TypeFileIconGoogleFontsPipe,
    GalleryModule,
    ProjectMultimediaComponent,
    LocationInformationComponent
  ],
  templateUrl: './complementary.component.html'
})
export class ComplementaryComponent implements OnInit {
  protected form: FormGroup = new FormGroup({});
  loading:boolean = false;
  blueprintName: string = '';
  blueprintNameError: boolean = false;
  blueprints: ProjectDocumentMock[] = [];
  public project: ProjectMock = { id : 0 };
  @ViewChild(LocationInformationComponent)
  locationCodeComponent!: LocationInformationComponent;
  public taxIdentificationNumber? : string = "";

  constructor(private readonly router: Router,
              private readonly fb: FormBuilder,
              private readonly ksModalGallerySvc: KsModalGalleryService,
              private readonly modalService: NgbModal,
              private readonly loadingService: LoadingService,
              protected readonly projectStore: ProjectStoreService,
              private readonly authService: AuthService,
              private readonly projectService: ProjectService) {
    this.taxIdentificationNumber = this.authService.getTexIdentificationNumber();
    const nav = this.router.getCurrentNavigation();
    this.project = nav?.extras.state?.['project'];
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.loadData().subscribe(() => {
      this.initializeForm();
      if(this.isViewPage) {
        this.form.disable({ emitEvent: false });
      }
      this.loadingService.hide();
    });
  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped :${file.name} - ${file.type}`);
      this.loadBlueprint(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected:${file.name} - ${file.type}`);
      input.value = '';
      this.loadBlueprint(file);
    }
  }


  loadBlueprint(file: File) {
    this.blueprintNameError = false;
    if(!this.blueprintName || this.blueprintName.trim().length === 0) {
      this.blueprintNameError = true;
      Swal.fire(
        DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR]("Debe definir el nombre del plano")).then(r => {}) ;
      return;
    }
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loadingService.show();

    this.createDocumentMock(file, this.blueprints, CatalogDetailCodes.SUBDIVISION_PLAN, this.blueprintName).subscribe({
      next: (document) => {
        document.name = this.blueprintName;
        this.blueprints.push(document);
        this.checkImageInDocument(this.blueprints, 'blueprint');
        this.loadingService.hide();
        this.blueprintName = '';
      },
      error: (err) => console.error('Upload failed', err)
    });
  }


  checkImageInDocument(documents: ProjectDocumentMock[],type: string): void {
    this.ksModalGallerySvc.removeAllImages(type);
    documents.forEach(document => {
      const extension = document.filename?.toLowerCase().split('.').pop();
      if (extension !== 'pdf') {
        this.ksModalGallerySvc.addImage(type, { ...document } as Document);
      }
    })
  }

  createDocumentMock(file: File, documents: ProjectDocumentMock[], catalogCode: string, description: string): Observable<ProjectDocumentMock> {
    let projectId : number;
    if (this.project && this.project.id !== undefined) {
      projectId = this.project.id;
    } else {
      throw new Error('Project or project ID is undefined');
    }

    console.log('createDocumentMock');
    const projectDocumentBase: ProjectDocumentMock = {
      description: description,
      catalogDetail: {
        code: catalogCode
      } as CatalogDetailMock
    } as ProjectDocumentMock;

    return this.projectService.uploadDocument(this.taxIdentificationNumber!, projectId, file, projectDocumentBase).pipe(
      map((uploadedDoc: ProjectDocumentMock) => uploadedDoc)
    );
  }

  onBlueprintNameChange(name: string): void {
    if (name && name.trim().length > 0) {
      this.blueprintNameError = false;
    }
  }

  toGoSection1(): void {
    this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section1`]);
  }

  viewDocument(file: ProjectDocumentMock, type: 'blueprint'): void {
    const extension = file.filename?.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      this.viewPdf(file);
    } else {
      this.ksModalGallerySvc.viewImage(type, { ...file } as Document);
    }
  }

  viewPdf(file: ProjectDocumentMock): void {
    const modalRef = this.modalService.open(PdfViewerModalComponent, {
      size: 'xl',
      backdrop: 'static',
      windowClass: 'pdf-viewer-modal'
    });

    modalRef.componentInstance.title = file.filename ?? '';
    modalRef.componentInstance.pdfUrl = file.path ?? '';
    return;
  }

  deleteBlueprint(file: ProjectDocumentMock) {
    if (file == undefined || file.id == undefined) {
      console.error('Document ID is missing, cannot delete');
      return;
    }

    if (this.project == undefined || this.project.id == undefined) {
      console.error('Project ID is missing, cannot delete');
      return;
    }

    const documentId: number = file.id;
    const projectId: number = this.project.id;

    Swal.fire(
        DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.QUESTION]("¿Desea eliminar el plano?"))
        .then((result) => {
          if (result.isConfirmed) {

            this.loadingService.show();
            this.projectService.removeDocument(this.taxIdentificationNumber!, projectId, documentId).subscribe({
              next: () => {
                this.ksModalGallerySvc.removeImage('blueprint', { ...file } as Document);
                this.blueprints.splice(this.blueprints.indexOf(file), 1);
                this.blueprintNameError = false;
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

  back():void {
    this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/infrastructure-installation`], {state: {project: this.project}});
  }

  next(): void {
    if(this.isViewPage) {
      this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/legal-scope`], {state: {project: this.project}});
      return;
    }
    if (this.form?.invalid) {
      FormUtil.markAllAsTouched(this.form);
      console.log("Form invalid!!");
      return;
    }
    this.loadingService.show();
    this.captureData();
    this.projectService.updateDraft(this.project, this.taxIdentificationNumber!)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (project: ProjectMock) => {
          this.project = project;
          console.log('Project draft complementary successfully:', this.project);
          this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/legal-scope`],
          {state: {project: this.project}});
        },
        error: (err : string) => {
          console.error('Error during project complementary :', err);
        }
      });
  }

  get isViewPage() {
    return this.projectStore.draftStatus() == ProjectDraftStatus.VIEW;
  }

  private loadData(): Observable<void> {
    this.loadingService.show();
    return this.projectService.readDraft(this.taxIdentificationNumber!, this.project).pipe(
      tap((project) => {
        this.project = project as ProjectMock;
      }),
      map(() => void 0)
    );
  }

  private captureData():void {
    const districtCode = this.form.get('district')!.value;

    this.project.projectStages?.forEach((stage: ProjectStageMock) => {
      stage.address = this.form.get('address')!.value;
      stage.addressNumber = this.form.get('address_number')!.value;
      stage.addressReference = this.form.get('address_reference')!.value;
      stage.zipCode = this.form.get('zipcode')!.value;
      stage.kmlKmzUrl = this.form.get('klm_url')!.value;

      const matchedLocationCode = this.locationCodeComponent.districts.find(loc => loc.code === districtCode);
      stage.locationCode = matchedLocationCode ? matchedLocationCode : undefined;
    });
    console.log('captureData project', this.project);
  }

  private initializeForm(): void {
    const projectStageCurrent = this.project?.projectStages?.[0];

    console.log('initializeForm', projectStageCurrent);
    this.form?.reset({
      address: projectStageCurrent?.address || '',
      address_number: projectStageCurrent?.addressNumber || '',
      address_reference: projectStageCurrent?.addressReference || '',
      zipcode: projectStageCurrent?.zipCode || '',
      klm_url: projectStageCurrent?.kmlKmzUrl || ''
    });
    this.locationCodeComponent.setLocationByDistrictCode(projectStageCurrent?.locationCode?.code!);
    this.handleLoadProjectDocuments(this.project)
  }

  private handleLoadProjectDocuments(project: ProjectMock): void {
    console.log('project-handle:', project);
    for (const doc of project.projectDocuments || []) {
      const code = doc.catalogDetail?.code;
      console.log('code-doc:', doc);
      switch (code) {
        case CatalogDetailCodes.SUBDIVISION_PLAN:
          this.blueprints.push(doc);
          this.checkImageInDocument(this.blueprints, 'blueprint');
          break;
      }
    }
  }

}
