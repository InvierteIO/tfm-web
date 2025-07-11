import {Component, OnInit} from '@angular/core';
import {StagePropertyGroupDtoMock} from '../../models/stage-property-group.dto.mock.model';
import {Router} from '@angular/router';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {PropertyMock} from '../../../../shared/models/property.mock.model';
import {CommercializationCycle} from '../../../../shared/models/commercialization-cycle.mock.model';
import {BooleanLabelPipe} from '@common/pipes/boolean-label.pipe';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {SelectStyleDirective} from '@common/directives/select-style.directive';
import {FormUtil} from '@common/utils/form.util';
import {PropertyRow} from './property-row.model';
import {LowerCasePipe, NgForOf, NgIf} from '@angular/common';
import {LoadingService} from "@core/services/loading.service";
import {ProjectStoreService} from '../../services/project-store.service';
import {ProjectDraftStatus} from '../../models/project-draft-status';
import {ProjectStageMock} from '../../models/project-stage.mock.model';
import {ProjectActionStatus} from '../../models/project-action-status';
import {ProjectMock} from '../../models/project.mock.model';

@Component({
  selector: 'app-properties',
  imports: [
    LowerCasePipe,
    DropdownSearchComponent,
    NgForOf,
    NgIf,
    BooleanLabelPipe,
    ReactiveFormsModule,
    FormErrorMessagesPipe,
    IsInvalidFieldPipe,
    SelectStyleDirective
  ],
  templateUrl: './properties.component.html'
})
export class PropertiesComponent implements OnInit {
  rows: PropertyRow[] = [];
  stagePropertyType?: StagePropertyGroupDtoMock;
  projectStages: ProjectStageMock[]= [];
  selectedFilter: string = 'Nombre';
  isView: boolean = false;
  originFlow?: string;
  project?: ProjectMock;
  protected readonly COMMERCIALIZATION_CYCLE = CommercializationCycle;

  constructor(private router: Router,
              private readonly fb: FormBuilder,
              private readonly loadingService: LoadingService,
              protected readonly projectStore: ProjectStoreService) {
    this.loadInfoFromNavigation();
    if(!this.stagePropertyType || !this.stagePropertyType!.propertyGroup) {
      console.log('back');
      this.back();
    }
  }

  private loadInfoFromNavigation() {
    const nav = this.router.getCurrentNavigation();
    this.stagePropertyType = nav?.extras.state?.["stagePropertyType"];
    this.projectStages = nav?.extras.state?.["projectStages"];
    this.isView = nav?.extras.state?.["view"];
    this.project = nav?.extras.state?.["project"];
    this.originFlow = nav?.extras.state?.["originFlow"];
    console.log('stagePropertyType', this.stagePropertyType?.properties);
    console.log('projectStages', this.projectStages);
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.search();
  }

  toGoPropertyType():void {
    if(this.projectStore.status() !== ProjectActionStatus.NEW) {
      this.router.navigate(['/public/home/project-info/property-type'],
        { state: { view: true, propertyType: this.stagePropertyType?.propertyGroup, projectStages: this.projectStages ?? []} });
    } else {
      this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/property-type`],
        { state: { view: true, propertyType: this.stagePropertyType?.propertyGroup, projectStages: this.projectStages ?? []} });
    }
  }

  goToFlowInit(): void {
    if(this.projectStore.status() === ProjectActionStatus.NEW) {
      this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section1`]);
      return;
    }
    this.router.navigate(['/public/home/project-info/'], {
      state: { project: this.project,  activeId: 'detail' }
    });
  }

  back(): void {
    if(this.projectStore.status() === ProjectActionStatus.NEW) {
      console.log('back new ');
      this.router.navigate([`/public/home/${this.projectStore.draftPathCurrent()}/section2`], {
        state: { project: this.project,  activeId: 'propertytypes' }
      });
      return;
    }
    if(this.originFlow === 'STAGE') {
      console.log('stage ');
      this.router.navigate(['/public/home/project-info/stage'], {
        state: { project: this.project, stage: this.stagePropertyType?.stage, activeId: 'propertytypes'  }
      });
    } else if (this.originFlow === 'PROJECT') {
      console.log('project ');
      this.router.navigate(['/public/home/project-info/'], {
        state: { project: this.project,  activeId: 'propertytypes' }
      });
    }
  }


  get isShowTableEmpty() {
    return !this.rows || this.rows.length === 0;
  }

  add() {
    const property: PropertyMock = {
      codeSystem: this.nextCodeSystem(),
      isAvailableSale: true,
      isParkingSpace: false,
      commercializationCycle: CommercializationCycle.ACTIVE
    };
    const form = this.buildForm(property);
    this.rows.push({ property, form, editing: true, isNew: true, original: { ...property } });
  }

  edit(row: PropertyRow): void {
    row.editing = true;
    row.original = { ...row.property };
    row.form.reset({
      codeEnterprise: row.property.codeEnterprise ?? '',
      name: row.property.name ?? '',
      isAvailableSale: row.property.isAvailableSale ?? true,
      price: row.property.price ?? null,
      isParkingSpace: row.property.isParkingSpace ?? false,
      commercializationCycle: row.property.commercializationCycle ?? CommercializationCycle.ACTIVE,
      address: row.property.address ?? ''
    });
  }

  cancel(row: PropertyRow, index: number): void {
    if (row.isNew) {
      this.rows.splice(index, 1);
      return;
    }
    row.property = { ...row.original! };
    row.form.reset({
      codeEnterprise: row.property.codeEnterprise,
      name: row.property.name,
      isAvailableSale: row.property.isAvailableSale,
      price: row.property.price,
      isParkingSpace: row.property.isParkingSpace,
      commercializationCycle: row.property.commercializationCycle,
      address: row.property.address
    });
    row.editing = false;
  }

  save(row: PropertyRow): void {
    if (row.form.invalid) {
      FormUtil.markAllAsTouched(row.form);
      return;
    }
    this.loadingService.show();
    setTimeout(() => {

      const value = row.form.value;
      row.property.codeEnterprise = value.codeEnterprise;
      row.property.name = value.name;
      row.property.isAvailableSale = value.isAvailableSale;
      row.property.price = value.price ? Number(value.price) : undefined;
      row.property.isParkingSpace = value.isParkingSpace;
      row.property.commercializationCycle = value.commercializationCycle;
      row.property.address = value.address;
      row.editing = false;
      row.isNew = false;
      row.original = undefined;

      this.loadingService.hide();
      }, 1000);

  }

  delete(row: PropertyRow): void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar el inmueble?"))
      .then(r => {
        this.loadingService.show();
        setTimeout(() => {
          this.rows.splice(this.rows.indexOf(row), 1);
          this.loadingService.hide();
          }, 3000);
      }) ;
  }

  private buildForm(property: PropertyMock): FormGroup {
    return this.fb.group({
      codeEnterprise: [property.codeEnterprise ?? '', Validators.required],
      name: [property.name ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      isAvailableSale: [property.isAvailableSale ?? true],
      price: [property.price, [Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)]],
      isParkingSpace: [property.isParkingSpace ?? false, Validators.required],
      commercializationCycle: [property.commercializationCycle ?? CommercializationCycle.ACTIVE, Validators.required],
      address: [property.address ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]]
    });
  }

  private nextCodeSystem(): string {
    const max = this.rows.reduce((p, c) => {
      const num = Number(c.property.codeSystem ?? 0);
      return num > p ? num : p;
    }, 0);
    return String(max + 1).padStart(8, '0');
  }

  search(): void {
    this.loadingService.show();
    console.log('search  - ', this.stagePropertyType?.properties)
    this.rows = (this.stagePropertyType?.properties ?? []).map(p => ({
      property: { ...p },
      form: this.buildForm(p),
      editing: false,
      isNew: false
    }));
    this.loadingService.hide();

  }

  get titleBreadcrumbBase() {
    if(this.projectStore.status() !== ProjectActionStatus.NEW){
      return this.project?.name ?? '';
    }
    return this.projectStore.titleBreadcrumbBase();
  }

  get isViewPage() {
    return this.projectStore.draftStatus() == ProjectDraftStatus.VIEW || this.isView;
  }
}
