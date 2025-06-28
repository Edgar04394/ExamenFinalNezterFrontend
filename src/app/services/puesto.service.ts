import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Puesto } from '../models/puesto';

@Injectable({
  providedIn: 'root'
})

export class PuestoService {
  private apiUrl = 'http://localhost:5054/api/Puestos';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  visualizar(): Observable<Puesto[]> {
    return this.http.post<Puesto[]>(`${this.apiUrl}/visualizarPuesto`, {}, { 
      headers: this.getAuthHeaders() 
    });
  }

  crear(puesto: Puesto): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearPuesto`, puesto, { 
      headers: this.getAuthHeaders() 
    });
  }

  actualizar(id: number, puesto: Puesto): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarPuesto/${id}`, puesto, { 
      headers: this.getAuthHeaders() 
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarPuesto/${id}`, {}, { 
      headers: this.getAuthHeaders() 
    });
  }
}
