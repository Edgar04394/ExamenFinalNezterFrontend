import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DxPolarChartModule, DxIntegrationModule } from 'devextreme-angular';
import { ResultadoService } from '../../services/resultado.service';

@Component({
  selector: 'historial-examenes',
  templateUrl: './historial-examenes.component.html',
  styleUrls: ['./historial-examenes.component.css'],
  standalone: true,
  imports: [CommonModule, DxPolarChartModule, DxIntegrationModule]
})
export class HistorialExamenesComponent implements OnInit {
  resultadosHistoricos: any[] = [];
  examenesUnicos: any[] = [];
  examenSeleccionado: any = null;
  spiderData: any[] = [];
  loading: boolean = true;
  error: string = '';
  isBrowser: boolean = false;

  // Paleta personalizada
  palette: string[] = [
    '#1976d2', // azul
    '#26a69a', // verde agua
    '#7e57c2', // morado
    '#ff7043', // naranja
    '#8d6e63', // marrón
    '#789262', // verde
    '#d4e157', // lima
    '#ffca28', // amarillo
    '#90a4ae', // gris
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private resultadoService: ResultadoService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarResultadosHistoricos();
    }
  }

  cargarResultadosHistoricos() {
    const codigoEmpleado = Number(localStorage.getItem('codigoEmpleado'));
    
    if (!codigoEmpleado) {
      this.error = 'No se encontró el código del empleado.';
      this.loading = false;
      return;
    }

    this.resultadoService.obtenerResultadosHistoricos(codigoEmpleado).subscribe({
      next: (data: any[]) => {
        this.resultadosHistoricos = data;
        
        // Agrupar por examen
        this.agruparExamenes();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los resultados históricos.';
        this.loading = false;
      }
    });
  }

  agruparExamenes() {
    const examenesMap = new Map();
    
    this.resultadosHistoricos.forEach(resultado => {
      const key = `${resultado.NombreExamen}_${resultado.fechaAsignacion}`;
      
      if (!examenesMap.has(key)) {
        examenesMap.set(key, {
          nombreExamen: resultado.NombreExamen,
          descripcionExamen: resultado.DescripcionExamen,
          tiempoLimite: resultado.TiempoLimite,
          fechaAsignacion: resultado.fechaAsignacion,
          competencias: []
        });
      }
      
      examenesMap.get(key).competencias.push({
        competencia: resultado.Competencia,
        promedio: resultado.Promedio
      });
    });
    
    this.examenesUnicos = Array.from(examenesMap.values());
  }

  seleccionarExamen(examen: any) {
    this.examenSeleccionado = examen;
    this.spiderData = examen.competencias.map((comp: any) => ({
      competencia: comp.competencia,
      promedio: Number(comp.promedio)
    }));
  }

  volverAExamenes() {
    this.router.navigate(['/empleado-examenes']);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return fecha;
    }
  }

  getColorForCompetencia(competencia: string): string {
    const colores: { [key: string]: string } = {
      'Determinación': '#ff4444',
      'Creatividad': '#ff8800',
      'Neutro': '#cccccc',
      'Hermetismo': '#00cc44',
      'Orientación al detalle': '#0088ff'
    };
    
    return colores[competencia] || '#666666';
  }

  getNivelCompetencia(promedio: number): string {
    if (promedio >= 4.5) return 'Excelente';
    if (promedio >= 3.5) return 'Muy Bueno';
    if (promedio >= 2.5) return 'Bueno';
    if (promedio >= 1.5) return 'Regular';
    return 'Necesita Mejorar';
  }
}
