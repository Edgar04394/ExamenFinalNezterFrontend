import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AsignacionService {
  private apiUrl = 'http://localhost:5054/api/Asignaciones';
  constructor(private http: HttpClient) { }

  // Esta función obtiene el token guardado y lo pone en la cabecera
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  asignar(asignacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/AsignarExamenAEmpleado`, asignacion, {
      headers: this.getAuthHeaders()
    });
  }

  visualizarPorEmpleado(empleado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/VisualizarAsignacionesPorEmpleado`, empleado, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarAsignacion(idAsignacion: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/eliminarAsignacion`, idAsignacion, {
      headers: this.getAuthHeaders()
    });
  }
}
