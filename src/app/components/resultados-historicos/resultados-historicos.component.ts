import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { DxPolarChartModule, DxIntegrationModule } from 'devextreme-angular';

@Component({
  selector: 'resultados-historicos',
  templateUrl: './resultados-historicos.component.html',
  styleUrls: ['./resultados-historicos.component.css'],
  standalone: true,
  imports: [CommonModule, DxPolarChartModule, DxIntegrationModule]
})
export class ResultadosHistoricosComponent implements OnInit {
  spiderData: any[] = [];
  nombreExamen: string = '';
  descripcionExamen: string = '';
  fechaAsignacion: string = '';
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
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.cargarResultadosTemporales();
    }
  }

  cargarResultadosTemporales() {
    try {
      const datosTemporales = localStorage.getItem('resultadosTemporales');
      
      if (datosTemporales) {
        const datos = JSON.parse(datosTemporales);
        this.spiderData = datos.spiderData || [];
        this.nombreExamen = datos.nombreExamen || 'Examen';
        this.descripcionExamen = datos.descripcionExamen || '';
        this.fechaAsignacion = datos.fechaAsignacion || '';
        
        console.log('Datos cargados:', datos);
        console.log('SpiderData:', this.spiderData);
        
        this.loading = false;
        
        // Limpiar datos temporales
        localStorage.removeItem('resultadosTemporales');
      } else {
        this.error = 'No se encontraron datos de resultados.';
        this.loading = false;
      }
    } catch (err) {
      console.error('Error al cargar resultados temporales:', err);
      this.error = 'Error al cargar los resultados.';
      this.loading = false;
    }
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