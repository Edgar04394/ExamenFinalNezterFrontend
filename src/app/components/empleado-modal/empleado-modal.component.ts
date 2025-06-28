import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Puesto } from '../../models/puesto';
import { PuestoService } from '../../services/puesto.service';
import { Empleado } from '../../models/empleado';
import { EmpleadoUsuarioDTO } from '../../models/empleado-usuario.dto';

@Component({
  selector: 'empleado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleado-modal.component.html',
  styleUrls: ['./empleado-modal.component.css']
})
export class EmpleadoModalComponent {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter();
  @Output() guardar = new EventEmitter<any>();

  empleadoForm: EmpleadoUsuarioDTO = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    fechaInicioContrato: '',
    idPuesto: 0,
    usuario: '',
    contrasena: ''
  };

  @Input() empleado: Empleado | null = null;
  @Input() modoEdicion: boolean = false;

  puestos: Puesto[] = [];

  constructor(private puestoService: PuestoService) { }

  ngOnInit(): void {
    this.cargarPuestos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado'] && this.empleado && this.modoEdicion) {
      // En modo edición, solo llenamos los datos del empleado, no los de usuario
      this.empleadoForm = {
        nombre: this.empleado.nombre,
        apellidoPaterno: this.empleado.apellidoPaterno,
        apellidoMaterno: this.empleado.apellidoMaterno,
        fechaNacimiento: this.formatearFecha(this.empleado.fechaNacimiento),
        fechaInicioContrato: this.formatearFecha(this.empleado.fechaInicioContrato),
        idPuesto: this.empleado.idPuesto,
        usuario: '', // No se edita en modo edición
        contrasena: '' // No se edita en modo edición
      };
    } else {
      // En modo creación, limpiamos todo
      this.empleadoForm = {
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: '',
        fechaInicioContrato: '',
        idPuesto: 0,
        usuario: '',
        contrasena: ''
      };
    }
  }

  formatearFecha(fecha: string): string {
    return fecha ? fecha.substring(0, 10) : '';
  }

  cargarPuestos() {
    this.puestoService.visualizar().subscribe({
      next: (data) => this.puestos = data,
      error: (err) => {
        console.error('Error al cargar puestos', err);
        alert('No se pudieron cargar los puestos.');
      }
    });
  }

  cerrarModal() {
    this.visible = false;
    this.cerrar.emit();
  }

  guardarEmpleado() {
    const e = this.empleadoForm;
    
    if (this.modoEdicion) {
      // En modo edición, validamos solo los campos del empleado
    if (e.nombre && e.apellidoPaterno && e.apellidoMaterno && e.fechaNacimiento && e.fechaInicioContrato && e.idPuesto) {
        // Convertimos de vuelta al formato Empleado para la edición
        const empleadoParaEditar: Empleado = {
          codigoEmpleado: this.empleado!.codigoEmpleado,
          nombre: e.nombre,
          apellidoPaterno: e.apellidoPaterno,
          apellidoMaterno: e.apellidoMaterno,
          fechaNacimiento: e.fechaNacimiento,
          fechaInicioContrato: e.fechaInicioContrato,
          idPuesto: e.idPuesto
        };
        this.guardar.emit({ empleado: empleadoParaEditar, modo: 'edicion' });
      this.cerrarModal();
      } else {
        alert('Por favor, completa todos los campos del empleado.');
      }
    } else {
      // En modo creación, validamos todos los campos incluyendo usuario y contraseña
      if (e.nombre && e.apellidoPaterno && e.apellidoMaterno && e.fechaNacimiento && e.fechaInicioContrato && e.idPuesto && e.usuario && e.contrasena) {
        this.guardar.emit({ empleadoUsuario: e, modo: 'creacion' });
        this.cerrarModal();
      } else {
        alert('Por favor, completa todos los campos incluyendo usuario y contraseña.');
    }
  }
  }

  generarUsuarioAutomatico() {
    if (this.empleadoForm.nombre && this.empleadoForm.apellidoPaterno && !this.modoEdicion) {
      const nombre = this.empleadoForm.nombre.toLowerCase().replace(/\s+/g, '');
      const apellido = this.empleadoForm.apellidoPaterno.toLowerCase().replace(/\s+/g, '');
      this.empleadoForm.usuario = `${nombre}.${apellido}`;
    }
  }

  generarContrasenaAutomatica() {
    if (!this.modoEdicion) {
      // Genera una contraseña aleatoria de 8 caracteres
      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let contrasena = '';
      for (let i = 0; i < 8; i++) {
        contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      this.empleadoForm.contrasena = contrasena;
    }
  }

  // Método para generar automáticamente el usuario cuando se complete el nombre y apellido
  onNombreApellidoChange() {
    if (!this.modoEdicion && this.empleadoForm.nombre && this.empleadoForm.apellidoPaterno && !this.empleadoForm.usuario) {
      this.generarUsuarioAutomatico();
    }
  }
}
