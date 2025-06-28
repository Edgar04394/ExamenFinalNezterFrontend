import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {
  usuario = '';
  contrasena = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: (response: any) => {
        console.log('Token recibido:', response.token);
        this.authService.handleLoginResponse(response.token);

        // Decodificamos el token para obtener el rol
        const decoded: any = jwtDecode(response.token);
        const rol = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (rol === 'Administrador') {
          this.router.navigate(['/admin-dashboard']);
        } else if (rol === 'Empleado') {
          this.router.navigate(['/empleado-dashboard']);
        } else {
          alert('Rol no reconocido.');
        }
      },
      error: err => {
        console.error('Error en login:', err);
        alert('Usuario o contraseña incorrectos.');
      }
    });
  }
}