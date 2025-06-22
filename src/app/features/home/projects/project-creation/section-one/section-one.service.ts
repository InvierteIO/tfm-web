import {Injectable} from '@angular/core';
import {HttpService} from "@core/services/http.service";
import {Observable, throwError} from "rxjs";
import { environment } from "@env";
import { catchError, map } from 'rxjs/operators';
import { Project } from '@core/models/project.model';

@Injectable({
    providedIn: 'root'
})

export class SectionOneService {

    static readonly END_POINT_COMPANY = environment.REST_CORE + '/real-estate-companies';

    constructor(private readonly httpService: HttpService) {
    }

    createProject(project: Project, taxIdentificationNumber: string): Observable<void> {
        const url = `${SectionOneService.END_POINT_COMPANY}/${encodeURIComponent(taxIdentificationNumber)}/projects`;
        return this.httpService
        .error("Error guardando información del proyecto")
        .post(url, project)
        .pipe(
          map(() => {
            console.log("Project created successfully as Draft");
          }),
          catchError(error => {
            console.error("create project failed", error);
            return throwError(() => new Error('Create project failed'));
          })
        );
    }

}
