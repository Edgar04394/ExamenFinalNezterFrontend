import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { AsignacionService } from '../../services/asignacion.service';
import { ResultadoService } from '../../services/resultado.service';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'empleado-examenes',
  imports: [CommonModule, FormsModule, SearchComponent, MatTooltipModule],
  templateUrl: './empleado-examenes.component.html',
  styleUrl: './empleado-examenes.component.css',
})
export class EmpleadoExamenesComponent {
  examenes: any[] = [];

  // Dentro de empleado-examenes.component.ts
  currentPage: number = 1;
  rowsPerPage: number = 10;

  // Aquí deberías obtener el código del empleado (por ejemplo, de un servicio de auth)
  codigoEmpleado: number = Number(localStorage.getItem('codigoEmpleado'));

  constructor(
    private asignacionService: AsignacionService, 
    private resultadoService: ResultadoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarExamenesAsignados();
  }

  cargarExamenesAsignados() {
    console.log('codigoEmpleado que se envía:', this.codigoEmpleado);
    this.asignacionService.visualizarPorEmpleado({ codigoEmpleado: this.codigoEmpleado }).subscribe({
      next: (data) => {
        console.log('Exámenes asignados recibidos:', data);
        // Mapeo para asegurar que los campos existan
        this.examenes = (data || []).map((item: any) => ({
          nombre_examen: item.nombre_examen || item.titulo || 'Sin nombre',
          descripcion: item.descripcion || '',
          tiempoLimite: item.tiempoLimite || '',
          idAsignacion: item.idAsignacion,
          idExamen: item.idExamen,
          codigoEmpleado: item.codigoEmpleado,
          fechaAsignacion: item.fechaAsignacion
        }));
      },
      error: (err) => {
        console.error('Error al cargar exámenes asignados', err);
      }
    });
  }

  get paginatedExamenes() {
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

  // Puedes agregar métodos para responder examen y ver resultados
  responderExamen(examen: any) {
    console.log('Responder examen:', examen);
    this.router.navigate(['/empleado-responder-examen', examen.idAsignacion]);
  }

  verResultados(examen: any) {
    console.log('Ver resultados del examen:', examen);
    
    // Obtener resultados históricos para este examen específico
    this.resultadoService.obtenerResultadosPorExamen(examen.idExamen, this.codigoEmpleado).subscribe({
      next: (resultados) => {
        console.log('Resultados obtenidos:', resultados);
        
        if (resultados && Array.isArray(resultados) && resultados.length > 0) {
          // Crear datos para la gráfica spider
          const spiderData = resultados.map((item: any) => ({
            competencia: item.Competencia,
            promedio: Number(item.Promedio)
          }));
          
          // Guardar datos temporalmente y navegar a resultados
          localStorage.setItem('resultadosTemporales', JSON.stringify({
            spiderData: spiderData,
            nombreExamen: examen.nombre_examen,
            descripcionExamen: examen.descripcion,
            fechaAsignacion: examen.fechaAsignacion
          }));
          
          // Navegar a una página de resultados históricos
          this.router.navigate(['/resultados-historicos']);
        } else {
          alert('No se encontraron resultados para este examen.');
        }
      },
      error: (err) => {
        console.error('Error al obtener resultados:', err);
        alert('Error al obtener los resultados del examen.');
      }
    });
  }
}
