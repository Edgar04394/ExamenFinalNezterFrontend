import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../../shared/search/search.component';
import { RouterModule } from '@angular/router';
import { EmpleadoModalComponent } from '../empleado-modal/empleado-modal.component';
import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { EmpleadoUsuarioDTO } from '../../models/empleado-usuario.dto';

@Component({
  selector: 'admin-empleados',
  imports: [CommonModule, SearchComponent, RouterModule, EmpleadoModalComponent, FormsModule, MatTooltip],
  templateUrl: './admin-empleados.component.html',
  styleUrl: './admin-empleados.component.css',
})
export class AdminEmpleadosComponent {
  empleados: Empleado[] = [];
  empleadosOriginal: Empleado[] = [];
  modalVisible = false;

  // * Paginación
  currentPage: number = 1;
  rowsPerPage: number = 10;
  totalItems: number = 0;

  empleadoEditando: Empleado | null = null;
  modoEdicion: boolean = false;

  constructor(private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleadosOriginal = data;
        this.empleados = data;
      },
      error: (err) => console.error('Error al cargar empleados', err)
    });
  }

  abrirModal() {
    this.empleadoEditando = null;
    this.modoEdicion = false;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.empleadoEditando = null;
    this.modoEdicion = false;
  }

  AgregarEmpleado(data: any) {
    if (data.modo === 'edicion') {
      // Modo edición - usar el método original
      this.empleadoService.actualizarEmpleado(data.empleado).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarEmpleados();
          this.mostrarMensaje('Empleado actualizado correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar empleado', err);
          this.mostrarMensaje('Error al actualizar empleado', 'error');
        }
      });
    } else if (data.modo === 'creacion') {
      // Modo creación - usar el nuevo método con usuario
      this.empleadoService.crearEmpleadoConUsuario(data.empleadoUsuario).subscribe({
        next: (response) => {
          this.cerrarModal();
          this.cargarEmpleados();
          this.mostrarCredenciales(data.empleadoUsuario);
        },
        error: (err) => {
          console.error('Error al agregar empleado', err);
          this.mostrarMensaje('Error al agregar empleado', 'error');
        }
      });
    }
  }

  mostrarCredenciales(empleadoUsuario: EmpleadoUsuarioDTO) {
    const mensaje = `
¡Empleado creado exitosamente!

📋 Información del empleado:
• Nombre: ${empleadoUsuario.nombre} ${empleadoUsuario.apellidoPaterno} ${empleadoUsuario.apellidoMaterno}

🔐 Credenciales de acceso:
• Usuario: ${empleadoUsuario.usuario}
• Contraseña: ${empleadoUsuario.contrasena}

⚠️ IMPORTANTE: Guarda estas credenciales de forma segura. El empleado podrá iniciar sesión con estos datos.
    `;
    
    alert(mensaje);
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    const icono = tipo === 'success' ? '✅' : '❌';
    alert(`${icono} ${mensaje}`);
  }

  editarEmpleado(empleado: Empleado) {
    this.empleadoEditando = { ...empleado };
    this.modoEdicion = true;
    this.modalVisible = true;
  }

  eliminarEmpleado(codigoEmpleado: number) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(codigoEmpleado).subscribe({
        next: () => {
          this.cargarEmpleados();
          this.mostrarMensaje('Empleado eliminado correctamente', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar empleado', err);
          this.mostrarMensaje('Error al eliminar empleado', 'error');
        }
      });
    }
  }

  filtrarEmpleados(termino: string) {
    const lower = termino.toLowerCase();
    this.empleados = this.empleadosOriginal.filter(emp =>
      emp.nombre.toLowerCase().includes(lower) ||
      emp.apellidoPaterno.toLowerCase().includes(lower) ||
      emp.apellidoMaterno.toLowerCase().includes(lower)
    );
  }

  get paginatedEmpleados(): Empleado[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.empleados.slice(start, end);
  }

  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
  }

  anteriorPagina() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  siguientePagina() {
    if (this.currentPage < this.totalPaginas()) {
      this.currentPage++;
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.empleados.length / this.rowsPerPage);
  }

  mostrarRango(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(start + this.rowsPerPage - 1, this.empleados.length);
    return `${start}-${end}`;
  }
}
