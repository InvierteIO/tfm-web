import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Observable, of} from 'rxjs';
import {DocumentMock} from '../models/document.mock.model';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectPropertyTypesService {

  constructor(private readonly httpService: HttpService) {
  }

  downloadFile(file: DocumentMock): Observable<void> {
    const path = file.path!;
    const name = file.name;
    console.log(file)
    return this.httpService.toast(true).download()
      .successful(`¡El archivo '${name}' fue descargado!`)
      .get(path)
      .pipe(map(this.buildBlobAndDownload));
  }

  private buildBlobAndDownload(blob: Blob | undefined): void {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
  }
}
