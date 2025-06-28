import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ClasificacionService {
  private apiUrl = 'http://localhost:5054/api/Clasificaciones';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  visualizar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/VisualizarClasificacion`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  crear(clasificacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearClasificacion`, clasificacion, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, clasificacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarClasificacion/${id}`, clasificacion, {
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarClasificacion/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
