import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';
import { EmpleadoUsuarioDTO } from '../models/empleado-usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = 'http://localhost:5054/api/Empleados';

  constructor(private http: HttpClient) { }

  // Esta función obtiene el token guardado y lo pone en la cabecera
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.post<Empleado[]>(`${this.apiUrl}/visualizarEmpleado`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  crearEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearEmpleado`, empleado, {
      headers: this.getAuthHeaders()
    });
  }

  crearEmpleadoConUsuario(empleadoUsuario: EmpleadoUsuarioDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/CrearEmpleadoConUsuario`, empleadoUsuario, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(`${this.apiUrl}/ActualizarEmpleado/${empleado.codigoEmpleado}`, empleado, {
      headers: this.getAuthHeaders()
    });
  }

  eliminarEmpleado(codigoEmpleado: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/EliminarEmpleado/${codigoEmpleado}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
