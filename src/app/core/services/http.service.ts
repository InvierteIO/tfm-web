import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AppError} from '@core/models/app-error.model';
import Swal from 'sweetalert2';
import {DIALOG_SWAL_KEYS, DIALOG_SWAL_OPTIONS} from '@common/dialogs/dialogs-swal.constants';
import {ToastService} from '@core/services/toast.service';


@Injectable({providedIn: 'root'})
export class HttpService {
    static readonly CONNECTION_REFUSE = 0;
    static readonly UNAUTHORIZED = 401;

    private headers: HttpHeaders = new HttpHeaders();
    private params: HttpParams = new HttpParams();
    private responseType: string = 'json';
    private isToast: boolean = false;
    private isDownloading: boolean = false;
    private successfulNotification:string|undefined = undefined;
    private errorNotification:string|undefined = undefined;

    constructor(private readonly http: HttpClient, private readonly router: Router,
                private readonly toastService: ToastService) {
        this.resetOptions();
    }

    param(key: string, value: string): this {
        if (value != null) {
            this.params = this.params.append(key, value); // This class is immutable
        }
        return this;
    }

    paramsFrom(dto: any): this {
        Object.getOwnPropertyNames(dto)
            .forEach(item => this.param(item, dto[item]));
        return this;
    }

    successful(notification = 'Successful'): this {
        this.successfulNotification = notification;
        return this;
    }

    toast(isToast: boolean = false): this {
      this.isToast = isToast;
      return this;
    }

    error(notification: string): this {
        this.errorNotification = notification;
        return this;
    }

    post(endpoint: string, body?: object): Observable<any> {
        return this.http
            .post(endpoint, body, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    get(endpoint: string): Observable<any> {
        return this.http
            .get(endpoint, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    put(endpoint: string, body?: object): Observable<any> {
        return this.http
            .put(endpoint, body, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    patch(endpoint: string, body?: object): Observable<any> {
        return this.http
            .patch(endpoint, body, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error))
            );
    }

    delete(endpoint: string): Observable<any> {
        return this.http
            .delete(endpoint, this.createOptions())
            .pipe(
                map(response => this.extractData(response)),
                catchError(error => this.handleError(error)));
    }

    authBasic(email: string, password: string): this {
        return this.header('Authorization', 'Basic ' + btoa(email + ':' + password));
    }

    header(key: string, value: string): this {
        if (value != null) {
            this.headers = this.headers.append(key, value); // This class is immutable
        }
        return this;
    }

    pdf(): this {
      this.responseType = 'blob';
      this.header('Accept', 'application/pdf , application/json');
      return this;
    }

    download(): this {
      this.responseType = 'blob';
      this.header('Accept', 'application/octet-stream');
      this.isDownloading = true;
      return this;
    }

    private resetOptions(): void {
        this.headers = new HttpHeaders();
        this.params = new HttpParams();
        this.responseType = 'json';
    }

    private createOptions(): any {
        const options: any = {
            headers: this.headers,
            params: this.params,
            responseType: this.responseType,
            observe: 'response'
        };
        this.resetOptions();
        return options;
    }

    private extractData(response: any): any {
        this.showSuccess();
        const downloadingBody = this.checkDownloadingAndGetBody(response);
        if (downloadingBody) return downloadingBody;
        const contentType = response.headers.get('content-type');
        if (contentType) {
            if (contentType.indexOf('application/pdf') !== -1) {
                const blob = new Blob([response.body], {type: 'application/pdf'});
                window.open(window.URL.createObjectURL(blob));
            } else if (contentType.indexOf('application/json') !== -1) {
                return response.body; // with 'text': JSON.parse(response.body);
            }
        } else {
            return response;
        }
    }

    private checkDownloadingAndGetBody(response: any): any {
      let body: any = undefined;
      if (this.isDownloading) {
        body = response.body;
      }
      this.isDownloading = false;
      return body;
    }

    private showSuccess(): void {
      if (this.successfulNotification) {
        if(!this.isToast) {
          Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.CONFIRMATION](this.successfulNotification));
        } else {
          this.toastService.success(this.successfulNotification);
        }
        this.successfulNotification = undefined;
        this.errorNotification = undefined;
      }
      this.isToast = false;
    }
    private showError(notification: string): void {
        if (this.errorNotification) {
          if(!this.isToast) {
            Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR](this.errorNotification));
          } else {
            this.toastService.error(this.errorNotification);
          }
          this.errorNotification = this.successfulNotification = undefined;
        } else {
          if(!this.isToast) {
            Swal.fire(DIALOG_SWAL_OPTIONS[DIALOG_SWAL_KEYS.ERROR](notification));
          } else {
            this.toastService.error(notification);
          }
        }
      this.isToast = this.isDownloading = false;
    }

    private handleError(response : any): any {
        let error: AppError;
        if (response.status === HttpService.UNAUTHORIZED) {
            this.showError('Unauthorized');
            const loginRoutes = ['/public/auth/login', '/internal/auth/login'];
            if (!loginRoutes.includes(this.router.url)) {
                this.router.navigate(['']);
             }
            return EMPTY;
        } else if (response.status === HttpService.CONNECTION_REFUSE) {
            this.showError('Connection Refuse');
            return EMPTY;
        } else {
            try {
                error = response.error; // with 'text': JSON.parse(response.error);
                this.showError(error.error + ' (' + response.status + '): ' + error.message);
                return throwError(() => error);
            } catch (e) {
                this.showError('Not response');
                return throwError(() => response.error);
            }
        }
    }

}
