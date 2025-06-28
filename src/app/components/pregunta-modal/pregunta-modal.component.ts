import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pregunta } from '../../models/pregunta';

@Component({
  selector: 'pregunta-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './pregunta-modal.component.html',
  styleUrl: './pregunta-modal.component.css',
})
export class PreguntaModalComponent {
  @Input() visible = false;
  @Input() pregunta: Pregunta | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardarPregunta = new EventEmitter<Pregunta>();

  preguntaForm: Pregunta = {
    idPregunta: 0,
    textoPregunta: '',
    idExamen: 0
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pregunta'] && this.pregunta) {
      this.preguntaForm = { ...this.pregunta };
    } else {
      this.preguntaForm = {
        idPregunta: 0,
        textoPregunta: '',
        idExamen: 0
      };
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardar() {
    if (!this.preguntaForm.textoPregunta) {
      alert('Por favor, completa el texto de la pregunta.');
      return;
    }
    this.guardarPregunta.emit({ ...this.preguntaForm });
    this.cerrarModal();
  }
}
