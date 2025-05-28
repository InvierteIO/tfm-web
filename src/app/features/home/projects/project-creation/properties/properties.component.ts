import {Component, OnInit} from '@angular/core';
import {StagePropertyGroupMock} from '../../shared/models/stage-property-group.mock.model';
import {Router} from '@angular/router';
import {DropdownSearchComponent} from '@common/components/dropdown-search.component';
import {PropertyMock} from '../../../shared/models/property.mock.model';
import {CommercializationCycle} from '../../../shared/models/commercialization-cycle.mock.model';
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
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent  implements OnInit {
  rows: PropertyRow[] = [];
  loading:boolean = false;
  propertyType?: StagePropertyGroupMock;
  selectedFilter: string = 'Nombre';
  protected readonly CommercializationCycle = CommercializationCycle;

  constructor(private router: Router,
              private readonly fb: FormBuilder) {
    const nav = this.router.getCurrentNavigation();

    this.propertyType = nav?.extras.state?.["property_type"];
    console.log(this.propertyType);
    if(!this.propertyType || !this.propertyType!.propertyGroup) {
      this.router.navigate(['/public/home/project-new/section1']);
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  toGoPropertyType():void {
    this.router.navigate(['/public/home/project-new/property-type']);
  }

  back(): void {
    this.router.navigate(['/public/home/project-new/section1']);
  }

  search(): void {

  }

  get isShowTable() {
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
  }

  delete(row: PropertyRow): void {
    Swal.fire(
      DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.WARNING]("¿Desea eliminar el inmueble?"))
      .then(r => {
        this.rows.splice(this.rows.indexOf(row), 1);
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

  loadData(): void {
    const data: PropertyMock[] = [
      {
        id: 1,
        codeSystem: '00000001',
        codeEnterprise: 'T1000001',
        name: 'Casa 1',
        isParkingSpace: false,
        isAvailableSale: true,
        price: 120000,
        address: 'Calle ABC',
        commercializationCycle: CommercializationCycle.PRE_SALES
      }
    ];
    this.rows = data.map(p => ({
      property: { ...p },
      form: this.buildForm(p),
      editing: false,
      isNew: false
    }));
  }
}
