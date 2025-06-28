import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private apiUrl = 'http://localhost:5054/api/Auth';

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  login(usuario: string, contrasena: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { usuario, contrasena });
  }

  handleLoginResponse(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);

      const decoded: any = jwtDecode(token);
      const rol = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const codigoEmpleado = decoded['codigoEmpleado'];
      if (codigoEmpleado) {
        localStorage.setItem('codigoEmpleado', codigoEmpleado);
      }

      if (rol === 'Administrador') {
        this.router.navigate(['/admin-dashboard']);
      } else if (rol === 'Empleado') {
        this.router.navigate(['/empleado-dashboard']);
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.toastr.success('Sesión cerrada correctamente', 'Logout');
    this.router.navigate(['/login']);
  }

}
