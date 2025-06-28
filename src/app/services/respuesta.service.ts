import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RespuestaService {
  private apiUrl = 'http://localhost:5054/api/Respuestas';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  visualizarPorPregunta(pregunta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/VisualizarRespuestaPorPregunta`, pregunta, {
      headers: this.getAuthHeaders()
    });
  }

  crear(respuesta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/crearRespuesta`, respuesta, {
      headers: this.getAuthHeaders()
    });
  }

  actualizar(id: number, respuesta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarRespuesta/${id}`, respuesta, {
      headers: this.getAuthHeaders()
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarRespuesta/${id}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
