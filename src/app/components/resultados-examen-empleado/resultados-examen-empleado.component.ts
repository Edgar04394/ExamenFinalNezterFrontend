import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../services/asignacion.service';
import { ExamenService } from '../../services/examen.service';
import { ResultadoService } from '../../services/resultado.service';
import { DxPolarChartModule, DxIntegrationModule } from 'devextreme-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'resultados-examen-empleado',
  templateUrl: './resultados-examen-empleado.component.html',
  styleUrls: ['./resultados-examen-empleado.component.css'],
  standalone: true,
  imports: [CommonModule, DxPolarChartModule, DxIntegrationModule]
})
export class ResultadosExamenEmpleadoComponent implements OnInit {
  idAsignacion!: number;
  spiderData: any[] = [];
  loading: boolean = true;
  error: string = '';
  isBrowser: boolean = false;
  debugInfo: any = {};
  diagnosticoInfo: any = null;

  // Paleta personalizada (puedes cambiar los colores si quieres)
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
    private route: ActivatedRoute,
    private router: Router,
    private asignacionService: AsignacionService,
    private examenService: ExamenService,
    private resultadoService: ResultadoService,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.idAsignacion = Number(this.route.snapshot.paramMap.get('idAsignacion'));
      console.log('🔍 ResultadosExamenEmpleado - idAsignacion:', this.idAsignacion);
      this.cargarResultados();
    }
  }

  cargarResultados() {
    console.log('🚀 Iniciando carga de resultados para idAsignacion:', this.idAsignacion);
    this.loading = true;
    this.error = '';
    
    this.resultadoService.obtenerReporte({ idAsignacion: this.idAsignacion }).subscribe({
      next: (data: any[]) => {
        console.log('✅ Datos recibidos del servidor:', data);
        console.log('📊 Tipo de datos:', typeof data);
        console.log('📊 Es array:', Array.isArray(data));
        console.log('📊 Longitud:', data?.length);
        
        if (data && Array.isArray(data) && data.length > 0) {
          this.spiderData = data.map(item => {
            console.log('🔄 Procesando item:', item);
            return {
              competencia: item.Competencia || item.competencia,
              promedio: Number(item.Promedio || item.promedio || 0)
            };
          });
          console.log('📈 SpiderData procesado:', this.spiderData);
        } else {
          console.warn('⚠️ No hay datos o datos vacíos');
          this.error = 'No se encontraron resultados para este examen.';
        }
        
        this.loading = false;
        this.debugInfo = {
          idAsignacion: this.idAsignacion,
          datosRecibidos: data,
          spiderData: this.spiderData,
          timestamp: new Date().toISOString()
        };
      },
      error: (err) => {
        console.error('❌ Error al cargar resultados:', err);
        console.error('❌ Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        
        this.error = `Error al cargar los resultados: ${err.message || 'Error desconocido'}`;
        this.loading = false;
        
        this.debugInfo = {
          idAsignacion: this.idAsignacion,
          error: err,
          timestamp: new Date().toISOString()
        };
      }
    });
  }

  volverAExamenes() {
    this.router.navigate(['/empleado-examenes']);
  }

  // Método para debug - mostrar información en consola
  mostrarDebugInfo() {
    console.log('🔍 Debug Info:', this.debugInfo);
    console.log('🔍 SpiderData actual:', this.spiderData);
    console.log('🔍 Loading:', this.loading);
    console.log('🔍 Error:', this.error);
  }

  // Método para ejecutar diagnóstico
  ejecutarDiagnostico() {
    console.log('🔧 Ejecutando diagnóstico para asignación:', this.idAsignacion);
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post(`http://localhost:5054/api/Resultados/diagnostico`, this.idAsignacion, { headers })
      .subscribe({
        next: (data: any) => {
          console.log('🔧 Diagnóstico completado:', data);
          this.diagnosticoInfo = data;
          alert('Diagnóstico completado. Revisa la consola para más detalles.');
        },
        error: (err) => {
          console.error('❌ Error en diagnóstico:', err);
          alert(`Error en diagnóstico: ${err.message}`);
        }
      });
  }
}
