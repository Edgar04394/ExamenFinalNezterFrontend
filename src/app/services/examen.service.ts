import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExamenService {
  private apiUrl = 'http://localhost:5054/api/Examenes';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  visualizar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/VisualizarExamen`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  crear(examen: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearExamen`, examen, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, examen: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarExamen/${id}`, examen, {
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarExamen/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
