import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Clasificacion } from '../../models/clasificacion';

@Component({
  selector: 'clasificacion-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './clasificacion-modal.component.html',
  styleUrl: './clasificacion-modal.component.css',
})
export class ClasificacionModalComponent {
  @Input() visible = false;
  @Input() clasificacion: Clasificacion | null = null;
  @Input() clasificacionesExistentes: Clasificacion[] = []; // << para evitar colores repetidos
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Clasificacion>();

  clasificacionForm: Clasificacion = {
    idClasificacion: 0,
    nombre: '',
    color: '',
  };

  colores = [
    { nombre: 'Rojo', codigo: '#FF0000' },
    { nombre: 'Naranja', codigo: '#FFA500' },
    { nombre: 'Amarillo', codigo: '#FFFF00' },
    { nombre: 'Verde', codigo: '#008000' },
    { nombre: 'Azul', codigo: '#0000FF' },
    { nombre: 'Morado', codigo: '#800080' },
    { nombre: 'Rosa', codigo: '#FFC0CB' },
    { nombre: 'Café', codigo: '#A52A2A' },
    { nombre: 'Negro', codigo: '#000000' },
    { nombre: 'Blanco', codigo: '#FFFFFF' },
    { nombre: 'Gris', codigo: '#808080' },
    { nombre: 'Turquesa', codigo: '#40E0D0' },
    { nombre: 'Dorado', codigo: '#FFD700' },
    { nombre: 'Plateado', codigo: '#C0C0C0' },
  ];

  get coloresDisponibles() {
    const usados = this.clasificacionesExistentes.map(c => c.color.toLowerCase());
    return this.colores.filter(c => !usados.includes(c.nombre.toLowerCase()) || c.nombre.toLowerCase() === this.clasificacionForm.color.toLowerCase());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clasificacion'] && this.clasificacion) {
      this.clasificacionForm = { ...this.clasificacion };
    } else {
      this.clasificacionForm = {
        idClasificacion: 0,
        nombre: '',
        color: ''
      };
    }

    // Asignación automática de color según nombre
    const nombre = this.clasificacionForm.nombre.toLowerCase().trim();
    if (!this.clasificacionForm.color) {
      const colorMap: { [key: string]: string } = {
        'determinación': 'Rojo',
        'creatividad': 'Naranja',
        'neutro': 'Blanco',
        'hermetismo': 'Verde',
        'orientación al detalle': 'Azul'
      };
      const asignado = colorMap[nombre];
      if (asignado && !this.colorYaUsado(asignado)) {
        this.clasificacionForm.color = asignado;
      }
    }
  }

  colorYaUsado(nombreColor: string): boolean {
    return this.clasificacionesExistentes.some(c =>
      c.color.toLowerCase() === nombreColor.toLowerCase() &&
      c.idClasificacion !== this.clasificacionForm.idClasificacion
    );
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarClasificacion() {
    const c = this.clasificacionForm;

    if (!c.nombre || !c.color) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (this.colorYaUsado(c.color)) {
      alert(`El color "${c.color}" ya está asignado a otra clasificación.`);
      return;
    }

    this.guardar.emit({ ...c });
    this.cerrarModal();
  }
}
