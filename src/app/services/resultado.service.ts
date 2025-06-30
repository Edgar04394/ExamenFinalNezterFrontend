import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RespuestaGuardada {
  mensaje: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ResultadoService {
  private apiUrl = 'http://localhost:5054/api/Resultados';
  constructor(private http: HttpClient) { }

  // Esta función obtiene el token guardado y lo pone en la cabecera
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  guardarRespuesta(respuesta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardarRespuesta`, respuesta, {
      headers: this.getAuthHeaders()
    });
  }

  obtenerReporte(asignacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reportePorCompetencia`, asignacion, {
      headers: this.getAuthHeaders()
    });
  }

  // Nuevo método para obtener resultados históricos
  obtenerResultadosHistoricos(codigoEmpleado: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/resultadosHistoricos`, codigoEmpleado, {
      headers: this.getAuthHeaders()
    });
  }

  // Método para obtener resultados por examen específico
  obtenerResultadosPorExamen(idExamen: number, codigoEmpleado: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/resultadosPorExamen`, { idExamen, codigoEmpleado }, {
      headers: this.getAuthHeaders()
    });
  }

  // Método para guardar resultados en historial
  guardarEnHistorial(idAsignacion: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/guardarEnHistorial/${idAsignacion}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
