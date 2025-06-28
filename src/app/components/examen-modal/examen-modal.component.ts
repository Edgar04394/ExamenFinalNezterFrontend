import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Examen } from '../../models/examen';


@Component({
  selector: 'examen-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './examen-modal.component.html',
  styleUrl: './examen-modal.component.css',
})
export class ExamenModalComponent {
  @Input() visible = false;
  @Output() cerrar = new EventEmitter();
  @Output() guardar = new EventEmitter<Examen>();
  @Input() examen: Examen | null = null;

  examenForm = {
    idExamen: 0,
    titulo: '',
    descripcion: '',
    tiempoLimite: '00:00:00'  // Aquí debe ser string, no un objeto
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['examen'] && this.examen) {
      this.examenForm = {
        ...this.examen
      };
    } else {
      this.examenForm = {
        idExamen: 0,
        titulo: '',
        descripcion: '',
        tiempoLimite: '00:00:00'
      };
    }
  }

  cerrarModal() {
    this.visible = false;
    this.cerrar.emit();
  }

  guardarExamen() {
    const e = this.examenForm;

    const regexHora = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    if (e.titulo && e.descripcion && regexHora.test(e.tiempoLimite)) {
      this.guardar.emit({ ...e });
      this.cerrarModal();
    } else {
      alert('Por favor, completa todos los campos y asegúrate que el tiempo límite tenga el formato HH:mm:ss (Ej: 01:30:00)');
    }
  }
}
