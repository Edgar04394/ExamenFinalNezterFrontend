import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Puesto } from '../../models/puesto';

@Component({
  selector: 'puesto-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './puesto-modal.component.html',
  styleUrl: './puesto-modal.component.css',
})
export class PuestoModalComponent {
  @Input() visible = false;
  @Input() puesto: Puesto | null = null;
  @Output() cerrar = new EventEmitter();
  @Output() guardar = new EventEmitter<any>();


  nombrePuesto: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['puesto'] && this.puesto) {
      this.nombrePuesto = this.puesto.puesto; // Carga el nombre del puesto al campo local
    } else {
      this.nombrePuesto = '';
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarPuesto() {
    if (this.nombrePuesto.trim() === '') {
      alert('El nombre del puesto es obligatorio');
      return;
    }
    if (this.puesto) {
      this.guardar.emit({ ...this.puesto, puesto: this.nombrePuesto });
    } else {
      this.guardar.emit({ idPuesto: 0, puesto: this.nombrePuesto }); // Nuevo puesto
    }
  }
}
