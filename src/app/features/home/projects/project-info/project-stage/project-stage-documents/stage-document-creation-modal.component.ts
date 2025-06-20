import {Component, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileDropzoneComponent} from '@common/components/file-dropzone.component';
import {LoadingComponent} from '@common/components/loading.component';
import {NgForOf, NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {CatalogDetailMock} from '../../../../shared/models/catalog-detail.mock.model';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {FileUtil} from '@common/utils/file.util';
import {FormUtil} from '@common/utils/form.util'
import {FormErrorMessagesPipe} from '@common/pipes/form-errormessages.pipe';
import {IsInvalidFieldPipe} from '@common/pipes/is-invalid-field.pipe';

@Component({
  selector: 'app-stage-document-creation-modal',
  standalone: true,
  imports: [
    FileDropzoneComponent,
    LoadingComponent,
    NgIf,
    ReactiveFormsModule,
    NgSelectComponent,
    FormsModule,
    FormErrorMessagesPipe,
    IsInvalidFieldPipe,
    NgForOf
  ],
  templateUrl: './stage-document-creation-modal.component.html'
})
export class StageDocumentCreationModalComponent implements OnInit {
  loading: boolean = false;
  documentTypes: CatalogDetailMock[] = [];
  documentSelected?: CatalogDetailMock;
  form: FormGroup;
  constructor(public readonly activeModal: NgbActiveModal,
              private readonly fb: FormBuilder) {
    this.form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      documentType: [null, [Validators.required]],
      name: ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.documentTypes = [{
      id: 1,
      code: '00010001',
      name: 'Plano general del proyecto',
    },
      {
        id: 2,
        code: '00010002',
        name: 'Plano de la etapa del proyecto',
      }];
  }

  onDropFile(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log(`Dropped :${file.name} - ${file.type}`);
      this.loadDocument(file);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log(`Selected :${file.name} - ${file.type}`);
      input.value = '';
      this.submitWithFile(file);
    }
  }

  private submitWithFile(file: File): void {
    if(this.form.invalid) {
      FormUtil.markAllAsTouched(this.form);
      if(this.form.get('documentType')?.invalid ?? false) {
        Swal.fire(
          DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR]("Debe seleccionar el tipo de documento")
        ).then(r => {});
      }
      return;
    }
    this.loadDocument(file);
  }

  loadDocument(file: File) {
    if(!FileUtil.validateFileExtensionMessage(file)) return;

    this.loading = true;
    this.form.disable({ emitEvent: false });
    setTimeout(() => {
      this.documentSelected = undefined;
      this.loading = false;
      this.activeModal.close();
      this.form.enable({ emitEvent: false });
    }, 1000);
  }

}
