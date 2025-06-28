import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RespuestaService } from '../../services/respuesta.service';
import { Respuesta } from '../../models/respuesta';
import { RespuestaModalComponent } from '../respuesta-modal/respuesta-modal.component';
import { SearchComponent } from '../../shared/search/search.component';

@Component({
  selector: 'admin-respuestas',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, RespuestaModalComponent, SearchComponent],
  templateUrl: './admin-respuestas.component.html',
  styleUrl: './admin-respuestas.component.css',
})
export class AdminRespuestasComponent {

  respuestas: Respuesta[] = [];
  respuestasOriginal: Respuesta[] = [];
  modalVisible = false;
  respuestaEditando: Respuesta | null = null;

  idPregunta = 0;
  textoPregunta = '';
  idExamen: number = 0; // Para poder regresar después

  currentPage = 1;
  rowsPerPage = 10;

  constructor(private respuestaService: RespuestaService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idPregunta = Number(params.get('idPregunta'));
      if (idPregunta) {
        this.idPregunta = idPregunta;
        this.cargarRespuestasPorPregunta();
      }
    });

    this.route.queryParamMap.subscribe(params => {
      const idExamen = Number(params.get('idExamen'));
      if (idExamen) {
        this.textoPregunta = params.get('textoPregunta') || '';
        this.idExamen = idExamen;
      }
    });
  }

  cargarRespuestasPorPregunta() {
    this.respuestaService.visualizarPorPregunta({ idPregunta: this.idPregunta }).subscribe({
      next: (data) => {
        this.respuestasOriginal = data;
        this.respuestas = data;
      },
      error: (err) => console.error('Error al cargar respuestas', err)
    });
  }

  abrirModal() {
    this.respuestaEditando = null;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  guardarRespuesta(respuesta: Respuesta) {
    if (this.respuestaEditando) {
      this.respuestaService.actualizar(this.respuestaEditando.idRespuesta, respuesta).subscribe({
        next: () => {
          this.cargarRespuestasPorPregunta();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Error al actualizar la respuesta');
        },
      });
    } else {
      respuesta.idPregunta = this.idPregunta;
      this.respuestaService.crear(respuesta).subscribe({
        next: () => {
          this.cargarRespuestasPorPregunta();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear', err);
          alert('Error al crear la respuesta');
        },
      });
    }
  }

  editarRespuesta(respuesta: Respuesta) {
    this.respuestaEditando = { ...respuesta };
    this.modalVisible = true;
  }

  eliminarRespuesta(id: number) {
    if (confirm('¿Estás seguro de eliminar esta respuesta?')) {
      this.respuestaService.eliminar(id).subscribe({
        next: () => {
          this.cargarRespuestasPorPregunta();
        },
        error: (err) => {
          console.error('Error al eliminar respuesta', err);
          alert('Error al eliminar respuesta');
        },
      });
    }
  }

  filtrarRespuestas(termino: string) {
    const lower = termino.toLowerCase();
    this.respuestas = this.respuestasOriginal.filter(r =>
      r.textoRespuesta.toLowerCase().includes(lower)
    );
    this.currentPage = 1;
  }

  get paginatedRespuestas(): Respuesta[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.respuestas.slice(start, end);
  }

  totalPaginas(): number {
    return Math.ceil(this.respuestas.length / this.rowsPerPage);
  }

  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
  }

  anteriorPagina() {
    if (this.currentPage > 1) this.currentPage--;
  }

  siguientePagina() {
    if (this.currentPage < this.totalPaginas()) this.currentPage++;
  }

  mostrarRango(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(start + this.rowsPerPage - 1, this.respuestas.length);
    return `${start}-${end}`;
  }

  volverAPreguntas() {
    this.router.navigate(['/preguntas', this.idExamen]);
  }
}
