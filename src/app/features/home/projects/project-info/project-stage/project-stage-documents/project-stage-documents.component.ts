import {Component, Input} from '@angular/core';
import {
  PropertyDocumentModalComponent
} from '../../../shared/components/title-splits/property-document-modal.component';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StageDocumentCreationModalComponent} from './stage-document-creation-modal.component';
import {StageDocumentListModalComponent} from './stage-document-list-modal.component';
import {CatalogDetailMock} from '../../../../shared/models/catalog-detail.mock.model';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-project-stage-documents',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './project-stage-documents.component.html',
  styleUrl: './project-stage-documents.component.css'
})
export class ProjectStageDocumentsComponent {
  @Input()
  public documentTypes: CatalogDetailMock[] = [];
  @Input()
  isView = false;

  constructor(private readonly modalService: NgbModal) {
  }

  openModalDocumentCreationModal(): void {
    const modalRef = this.modalService.open(StageDocumentCreationModalComponent, { size: 'md'
      , backdrop: 'static' });
    modalRef.componentInstance.documentTypes = this.documentTypes;
  }

  openModalDocumentListModal(): void {
    const modalRef = this.modalService.open(StageDocumentListModalComponent, { size: 'lg'
      , backdrop: 'static' });
    modalRef.componentInstance.isView = this.isView;
  }
}
