import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Respuesta } from '../../models/respuesta';
import { Clasificacion } from '../../models/clasificacion';
import { ClasificacionService } from '../../services/clasificacion.service';

@Component({
  selector: 'respuesta-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './respuesta-modal.component.html',
  styleUrl: './respuesta-modal.component.css'
})
export class RespuestaModalComponent {

  @Input() visible = false;
  @Input() respuesta: Respuesta | null = null;
  @Output() cerrar = new EventEmitter();
  @Output() guardarRespuesta = new EventEmitter<Respuesta>();

  clasificaciones: Clasificacion[] = [];

  respuestaForm = {
    textoRespuesta: '',
    valor: 0,
    idClasificacion: 0
  };

  constructor(private clasificacionService: ClasificacionService) {
    this.cargarClasificaciones();
  }

  cargarClasificaciones() {
    this.clasificacionService.visualizar().subscribe({
      next: (data) => {
        this.clasificaciones = data;
      },
      error: (err) => console.error('Error al cargar clasificaciones', err)
    });
  }

  ngOnChanges() {
    if (this.respuesta) {
      this.respuestaForm.textoRespuesta = this.respuesta.textoRespuesta;
      this.respuestaForm.valor = this.respuesta.valor;
      this.respuestaForm.idClasificacion = this.respuesta.idClasificacion || 0;
    } else {
      this.respuestaForm.textoRespuesta = '';
      this.respuestaForm.valor = 0;
      this.respuestaForm.idClasificacion = 0;
    }
  }

  guardar() {
    if (!this.respuestaForm.textoRespuesta.trim()) {
      alert('El texto de la respuesta es obligatorio');
      return;
    }
    if (!this.respuestaForm.idClasificacion) {
      alert('Selecciona una clasificación para la respuesta');
      return;
    }
    const nuevaRespuesta: Respuesta = {
      idRespuesta: this.respuesta?.idRespuesta || 0,
      idPregunta: this.respuesta?.idPregunta || 0,
      textoRespuesta: this.respuestaForm.textoRespuesta,
      valor: this.respuestaForm.valor,
      idClasificacion: this.respuestaForm.idClasificacion
    };
    this.guardarRespuesta.emit(nuevaRespuesta);
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
