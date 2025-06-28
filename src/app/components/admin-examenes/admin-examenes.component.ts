import { Component } from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Examen } from '../../models/examen';
import { ExamenService } from '../../services/examen.service';
import { ExamenModalComponent } from '../examen-modal/examen-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AsignarExamenModalComponent } from "../asignar-examen-modal/asignar-examen-modal.component";
import { Empleado } from '../../models/empleado';
import { EmpleadoService } from '../../services/empleado.service';
import { AsignacionService } from '../../services/asignacion.service';

@Component({
  selector: 'admin-examenes',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    FormsModule,
    SearchComponent,
    ExamenModalComponent,
    AsignarExamenModalComponent,
    MatTooltipModule
  ],
  templateUrl: './admin-examenes.component.html',
  styleUrl: './admin-examenes.component.css',
})
export class AdminExamenesComponent {
  examenes: Examen[] = [];
  examenesOriginal: Examen[] = [];
  modalVisible = false;
  examenEditando: Examen | null = null;

  modalAsignarVisible = false;
  idExamenAAsignar: number | null = null;

  empleados: Empleado[] = [];

  currentPage: number = 1;
  rowsPerPage: number = 10;

  constructor(
    private examenService: ExamenService,
    private empleadoService: EmpleadoService,
    private router: Router,
    private asignacionService: AsignacionService
  ) { }

  ngOnInit(): void {
    this.cargarExamenes();
    this.cargarEmpleados();
  }

  cargarExamenes() {
    this.examenService.visualizar().subscribe({
      next: (data) => {
        this.examenesOriginal = data;
        this.examenes = data;
      },
      error: (err) => console.error('Error al cargar exámenes', err)
    });
  }

  cargarEmpleados() {
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
      },
      error: (err) => console.error('Error al cargar empleados', err)
    });
  }

  abrirModal() {
    this.examenEditando = null;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.examenEditando = null;
  }

  guardarExamen(examen: Examen) {
    if (this.examenEditando) {
      this.examenService.actualizar(this.examenEditando.idExamen, examen).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarExamenes();
        },
        error: (err) => {
          console.error('Error al actualizar examen', err);
          alert('Error al actualizar examen.');
        }
      });
    } else {
      this.examenService.crear(examen).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarExamenes();
        },
        error: (err) => {
          console.error('Error al crear examen', err);
          alert('Error al crear examen.');
        }
      });
    }
  }

  editarExamen(examen: Examen) {
    this.examenEditando = { ...examen };
    this.modalVisible = true;
  }

  eliminarExamen(idExamen: number) {
    if (confirm('¿Estás seguro de eliminar este examen?')) {
      this.examenService.eliminar(idExamen).subscribe({
        next: () => this.cargarExamenes(),
        error: (err) => {
          console.error('Error al eliminar examen', err);
          alert('Error al eliminar examen.');
        }
      });
    }
  }

  abrirModalAsignar(idExamen: number) {
    this.idExamenAAsignar = idExamen;
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.modalAsignarVisible = true; // abrir modal solo cuando empleados ya cargaron
      },
      error: (err) => {
        console.error('Error al cargar empleados', err);
        alert('Error al cargar empleados.');
      }
    });
  }

  cerrarModalAsignar() {
    this.modalAsignarVisible = false;
    this.idExamenAAsignar = null;
  }

  asignarExamenAEmpleados(ids: number[]) {
    if (!this.idExamenAAsignar) return;
    const fechaAsignacion = new Date().toISOString();
    ids.forEach(codigoEmpleado => {
      const asignacion = {
        idExamen: this.idExamenAAsignar,
        codigoEmpleado,
        fechaAsignacion
      };
      this.asignacionService.asignar(asignacion).subscribe({
        next: () => {},
        error: (err) => console.error('Error al asignar examen', err)
      });
    });
    this.cerrarModalAsignar();
  }

  filtrarExamenes(termino: string) {
    const lower = termino.toLowerCase();
    this.examenes = this.examenesOriginal.filter(emp =>
      emp.titulo.toLowerCase().includes(lower) ||
      emp.descripcion.toLowerCase().includes(lower) ||
      emp.tiempoLimite.toLowerCase().includes(lower)
    );
    this.currentPage = 1;
  }

  get paginatedExamenes(): Examen[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.examenes.slice(start, end);
  }

  totalPaginas(): number {
    return Math.ceil(this.examenes.length / this.rowsPerPage);
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
    const end = Math.min(start + this.rowsPerPage - 1, this.examenes.length);
    return `${start}-${end}`;
  }

  verPreguntas(idExamen: number) {
    this.router.navigate(['/preguntas', idExamen]);
  }
}
