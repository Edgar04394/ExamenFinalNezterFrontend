import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PreguntaService {
  private apiUrl = 'http://localhost:5054/api/Preguntas';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  visualizarPorExamen(examen: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/visualizarPreguntaPorExamen`, examen, {
      headers: this.getAuthHeaders()
    });
  }

  visualizar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/VisualizarPreguntas`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  crear(pregunta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearPregunta`, pregunta, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, pregunta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarPregunta/${id}`, pregunta, {
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarPregunta/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
