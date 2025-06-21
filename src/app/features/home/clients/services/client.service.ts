import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientMock} from '../models/client.mock.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ClientMock[]> {
    return of([{
      id: 1,
      identityDocument: "47123450",
      fullName: "Juan Perez",
      email: "juan_perez@gmail.com",
      identityDocumentType: "DNI",
      phoneNumber: "971234567"
    },
      {
        id: 2,
        identityDocument: "47123451",
        fullName: "Luz Dary Ramirez",
        email: "luz@gmail.com",
        identityDocumentType: "DNI",
        phoneNumber: "971234568"
      },
      {
        id: 3,
        identityDocument: "47123453",
        fullName: "Santiago Gomez",
        email: "santiago@gmail.com",
        identityDocumentType: "DNI",
        phoneNumber: "971234569"
      },
      {
        id: 3,
        identityDocument: "47123454",
        fullName: "Franco Herrera",
        email: "franco@gmail.com",
        identityDocumentType: "DNI",
        phoneNumber: "971234560"
      }]);
  }

  getById(id: string): Observable<ClientMock> {
    return of();
  }

  create(dto: ClientMock): Observable<ClientMock> {
    return of();
  }

  update(id: string, dto: ClientMock): Observable<ClientMock> {
    return of();
  }
}
