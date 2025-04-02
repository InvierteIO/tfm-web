import {Injectable} from '@angular/core';
import {HttpService} from '@core/services/http.service';
import {Membership} from './membership.model';
import {Observable} from 'rxjs';
import {EndPoints} from '@core/end-points';

@Injectable({providedIn: 'root'})
export class MembershipService {
  constructor(private readonly httpService: HttpService) {}

  create(membership: Membership): Observable<Membership> {
    return this.httpService
      .successful("El registro de membresia fue creado con éxito")
      .error("Hubo problemas al crear la membresia")
      .post(EndPoints.MEMBERSHIPS, membership);
  }

  readAll(): Observable<Membership[]> {
    return this.httpService.error("Hubo problemas al listar")
      .get(EndPoints.MEMBERSHIPS );
  }

  update(id: number, membership: Membership): Observable<Membership> {
    return this.httpService
      .successful("El registro de membresia fue actualizado con éxito")
      .error("Hubo problemas al editar la membresia")
      .put(EndPoints.MEMBERSHIPS + '/' + id, membership);
  }

  delete(id: number): Observable<Membership> {
    return this.httpService
      .successful("El registro de membresia fue eliminado con éxito")
      .error("Hubo problemas al eliminar la membresia")
      .delete(EndPoints.MEMBERSHIPS + '/' + id);
  }
}
