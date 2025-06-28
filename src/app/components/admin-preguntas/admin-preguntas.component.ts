import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../../shared/search/search.component';
import { PreguntaModalComponent } from '../pregunta-modal/pregunta-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Pregunta } from '../../models/pregunta';
import { PreguntaService } from '../../services/pregunta.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'admin-preguntas',
  imports: [CommonModule, FormsModule, SearchComponent, PreguntaModalComponent, MatTooltipModule],
  templateUrl: './admin-preguntas.component.html',
  styleUrl: './admin-preguntas.component.css',
})
export class AdminPreguntasComponent {
  preguntas: Pregunta[] = [];
  preguntasOriginal: Pregunta[] = [];
  modalVisible = false;
  preguntaEditando: Pregunta | null = null;

  currentPage = 1;
  rowsPerPage = 10;

  idExamen: number = 0; // Guardamos aquí el id del examen actual

  constructor(private preguntaService: PreguntaService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idExamen = Number(params.get('idExamen'));
      if (idExamen) {
        this.idExamen = idExamen;
        this.cargarPreguntasPorExamen(idExamen);
      }
    });
  }

  cargarPreguntasPorExamen(idExamen: number) {
    this.preguntaService.visualizarPorExamen({ idExamen }).subscribe({
      next: (data) => {
        this.preguntasOriginal = data;
        this.preguntas = data;
      },
      error: (err) => console.error('Error al cargar preguntas por examen', err),
    });
  }

  abrirModal() {
    this.preguntaEditando = null;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  guardarPregunta(pregunta: Pregunta) {
    if (this.preguntaEditando) {
      this.preguntaService.actualizar(this.preguntaEditando.idPregunta, pregunta).subscribe({
        next: () => {
          this.cargarPreguntasPorExamen(this.idExamen); // 👈 Mantener el filtro
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Error al actualizar la pregunta');
        },
      });
    } else {
      // 👇 Asignar idExamen antes de crear
      pregunta.idExamen = this.idExamen;
      this.preguntaService.crear(pregunta).subscribe({
        next: () => {
          this.cargarPreguntasPorExamen(this.idExamen); // 👈 Mantener el filtro
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear', err);
          alert('Error al crear la pregunta');
        },
      });
    }
  }

  editarPregunta(pregunta: Pregunta) {
    this.preguntaEditando = { ...pregunta };
    this.modalVisible = true;
  }

  eliminarPregunta(id: number) {
    if (confirm('¿Estás seguro de eliminar esta pregunta?')) {
      this.preguntaService.eliminar(id).subscribe({
        next: () => {
          this.cargarPreguntasPorExamen(this.idExamen); // 👈 Mantener el filtro
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Error al eliminar pregunta');
        },
      });
    }
  }

  filtrarPreguntas(termino: string) {
    const lower = termino.toLowerCase();
    this.preguntas = this.preguntasOriginal.filter(p =>
      p.textoPregunta.toLowerCase().includes(lower)
    );
    this.currentPage = 1;
  }

  get paginatedPreguntas(): Pregunta[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.preguntas.slice(start, end);
  }

  totalPaginas(): number {
    return Math.ceil(this.preguntas.length / this.rowsPerPage);
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
    const end = Math.min(start + this.rowsPerPage - 1, this.preguntas.length);
    return `${start}-${end}`;
  }

  volverAExamenes() {
    this.router.navigate(['/admin-examenes']);
  }

  verRespuestas(pregunta: Pregunta) {
    this.router.navigate(['/respuestas', pregunta.idPregunta], {
      queryParams: { idExamen: this.idExamen }
    });
  }

}
