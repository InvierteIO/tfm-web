import { Component } from '@angular/core';
import {
  PropertyDocumentModalComponent
} from '../../../shared/components/title-splits/property-document-modal.component';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {StageDocumentCreationModalComponent} from './stage-document-creation-modal.component';
import {StageDocumentListModalComponent} from './stage-document-list-modal.component';

@Component({
  selector: 'app-project-stage-documents',
  imports: [],
  templateUrl: './project-stage-documents.component.html',
  styleUrl: './project-stage-documents.component.css'
})
export class ProjectStageDocumentsComponent {

  constructor(private readonly modalService: NgbModal) {
  }

  openModalDocumentCreationModal(): void {
    const modalRef = this.modalService.open(StageDocumentCreationModalComponent, { size: 'md'
      , backdrop: 'static' });
  }

  openModalDocumentListModal(): void {
    const modalRef = this.modalService.open(StageDocumentListModalComponent, { size: 'lg'
      , backdrop: 'static' });
  }
}
