import { Injectable, signal } from '@angular/core';
import { ProjectDraftStatus } from '../models/project-draft-status';
import {ProjectActionStatus} from '../models/project-action-status';

@Injectable({ providedIn: 'root' })
export class ProjectStoreService {
  private readonly _draftStatus = signal<ProjectDraftStatus>(ProjectDraftStatus.NEW);
  private readonly _status = signal<ProjectActionStatus>(ProjectActionStatus.NEW);
  readonly draftStatus = this._draftStatus.asReadonly();

  readonly status = this._status.asReadonly();

  private readonly _draftPathCurrent = signal<string>('project-new');

  readonly draftPathCurrent = this._draftPathCurrent.asReadonly();

  private readonly _titleBreadcrumbBase = signal<string>("Crear Proyecto");

  readonly titleBreadcrumbBase = this._titleBreadcrumbBase.asReadonly();

  private readonly _projectId = signal<number | null>(null);

  readonly projectId = this._projectId.asReadonly();


  setDraftStatus(status: ProjectDraftStatus): void {
    this._draftStatus.set(status);
    this._status.set(ProjectActionStatus.NEW);
    if (status === ProjectDraftStatus.EDIT || status === ProjectDraftStatus.VIEW) {
      this._draftPathCurrent.set('project-draft');
    } else {
      this._draftPathCurrent.set('project-new');
    }
  }

  setStatus(status: ProjectActionStatus): void {
    this._draftStatus.set(ProjectDraftStatus.NEW);
    this._status.set(status);
  }

  setTitleBreadcrumbBase(title: string): void {
    this._titleBreadcrumbBase.set(title);
  }

  setProjectId(id: number): void {
    this._projectId.set(id);
  }
}
