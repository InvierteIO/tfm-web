import {Injectable} from '@angular/core';
import {CanActivateChild} from '@angular/router';
import {ProjectStoreService} from './project-store.service';
import {ProjectActionStatus} from '../models/project-action-status';

@Injectable({ providedIn: 'root' })
export class ProjectStateGuard implements CanActivateChild {
  constructor(private readonly projectStore: ProjectStoreService) {}

  canActivateChild(): boolean {
    this.projectStore.setStatus(ProjectActionStatus.NEW);
    this.projectStore.setTitleBreadcrumbBase("Crear Proyecto");
    return true;
  }
}
