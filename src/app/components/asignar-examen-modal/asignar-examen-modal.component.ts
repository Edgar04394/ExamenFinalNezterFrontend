import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'asignar-examen-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './asignar-examen-modal.component.html',
  styleUrl: './asignar-examen-modal.component.css',
})
export class AsignarExamenModalComponent {
  @Input() visible: boolean = false;
  @Input() empleados: Empleado[] = [];

  @Output() cerrar = new EventEmitter<void>();
  @Output() asignar = new EventEmitter<number[]>(); // IDs de empleados seleccionados

  empleadosSeleccionados: { [codigoEmpleado: number]: boolean } = {};

  cerrarModal() {
    this.cerrar.emit();
  }

  asignarExamen() {
    const seleccionados = Object.entries(this.empleadosSeleccionados)
      .filter(([_, seleccionado]) => seleccionado)
      .map(([codigoEmpleado, _]) => +codigoEmpleado);

    this.asignar.emit(seleccionados);
  }

  toggleSeleccion(id: number, checked: boolean) {
    this.empleadosSeleccionados[id] = checked;
  }
}
