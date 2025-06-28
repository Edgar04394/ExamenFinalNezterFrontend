import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionService } from '../../services/asignacion.service';
import { ExamenService } from '../../services/examen.service';
import { PreguntaService } from '../../services/pregunta.service';
import { RespuestaService } from '../../services/respuesta.service';
import { ClasificacionService } from '../../services/clasificacion.service';
import { ResultadoService } from '../../services/resultado.service';
import { Asignacion } from '../../models/asignacion';
import { Examen } from '../../models/examen';
import { Pregunta } from '../../models/pregunta';
import { Respuesta } from '../../models/respuesta';
import { Clasificacion } from '../../models/clasificacion';
import { DxPolarChartModule, DxIntegrationModule } from 'devextreme-angular';

@Component({
  selector: 'empleado-responder-examen',
  imports: [CommonModule, DxPolarChartModule, DxIntegrationModule],
  templateUrl: './empleado-responder-examen.component.html',
  styleUrl: './empleado-responder-examen.component.css',
})
export class EmpleadoResponderExamenComponent implements OnInit {
  idAsignacion!: number;
  asignacion!: Asignacion;
  examen!: Examen;
  preguntas: Pregunta[] = [];
  respuestasPorPregunta: { [idPregunta: number]: Respuesta[] } = {};
  clasificaciones: Clasificacion[] = [];
  respuestasSeleccionadas: { [idPregunta: number]: number } = {};

  tiempoRestante: number = 0; // en segundos
  timerInterval: any;
  tiempoFormateado: string = '';
  examenFinalizado: boolean = false;

  loading: boolean = true;
  spiderData: any[] = [];
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private asignacionService: AsignacionService,
    private examenService: ExamenService,
    private preguntaService: PreguntaService,
    private respuestaService: RespuestaService,
    private clasificacionService: ClasificacionService,
    private resultadoService: ResultadoService
  ) {}

  ngOnInit(): void {
    this.idAsignacion = Number(this.route.snapshot.paramMap.get('idAsignacion'));
    this.cargarDatos();
  }

  async cargarDatos() {
    this.loading = true;
    // 1. Obtener la asignación (para idExamen)
    // No hay método directo, así que obtenemos todas las asignaciones del empleado y filtramos
    const codigoEmpleado = Number(localStorage.getItem('codigoEmpleado'));
    this.asignacionService.visualizarPorEmpleado({ codigoEmpleado }).subscribe({
      next: (asignaciones) => {
        this.asignacion = asignaciones.find((a: Asignacion) => a.idAsignacion === this.idAsignacion);
        if (!this.asignacion) {
          this.router.navigate(['/empleado-examenes']);
          return;
        }
        // 2. Obtener el examen
        this.examenService.visualizar().subscribe({
          next: (examenes) => {
            this.examen = examenes.find((e: Examen) => e.idExamen === this.asignacion.idExamen);
            // 3. Obtener preguntas
            this.preguntaService.visualizarPorExamen({ idExamen: this.examen.idExamen }).subscribe({
              next: (preguntas) => {
                this.preguntas = preguntas;
                // 4. Obtener respuestas para cada pregunta
                let pendientes = this.preguntas.length;
                this.preguntas.forEach((pregunta) => {
                  this.respuestaService.visualizarPorPregunta({ idPregunta: pregunta.idPregunta }).subscribe({
                    next: (respuestas) => {
                      this.respuestasPorPregunta[pregunta.idPregunta] = respuestas;
                      pendientes--;
                      if (pendientes === 0) {
                        // 5. Obtener clasificaciones
                        this.clasificacionService.visualizar().subscribe({
                          next: (clasificaciones) => {
                            this.clasificaciones = clasificaciones;
                            this.iniciarTemporizador();
                            this.loading = false;
                          }
                        });
                      }
                    }
                  });
                });
              }
            });
          }
        });
      }
    });
  }

  iniciarTemporizador() {
    // tiempoLimite formato 'HH:mm:ss'
    const partes = this.examen.tiempoLimite.split(':');
    this.tiempoRestante = (+partes[0]) * 3600 + (+partes[1]) * 60 + (+partes[2]);
    this.actualizarTiempoFormateado();
    this.timerInterval = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
        this.actualizarTiempoFormateado();
      } else {
        this.finalizarExamen(true);
      }
    }, 1000);
  }

  actualizarTiempoFormateado() {
    const h = Math.floor(this.tiempoRestante / 3600).toString().padStart(2, '0');
    const m = Math.floor((this.tiempoRestante % 3600) / 60).toString().padStart(2, '0');
    const s = (this.tiempoRestante % 60).toString().padStart(2, '0');
    this.tiempoFormateado = `${h}:${m}:${s}`;
  }

  seleccionarRespuesta(idPregunta: number, idRespuesta: number) {
    console.log('seleccionarRespuesta llamado:', { idPregunta, idRespuesta });
    this.respuestasSeleccionadas[idPregunta] = idRespuesta;
    console.log('respuestasSeleccionadas actualizado:', this.respuestasSeleccionadas);
  }

  finalizarExamen(tiempoAgotado = false) {
    // Detener el timer
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    // Verificar si hay respuestas seleccionadas
    const respuestasCount = Object.keys(this.respuestasSeleccionadas).length;
    
    if (respuestasCount === 0) {
      alert('No has seleccionado ninguna respuesta. Por favor, responde al menos una pregunta.');
      return;
    }
    
    // Marcar como finalizado
    this.examenFinalizado = true;
    
    // Crear array de respuestas
    const respuestasEmpleado = Object.entries(this.respuestasSeleccionadas).map(([idPregunta, idRespuesta]) => ({
      idAsignacion: this.idAsignacion,
      idPregunta: Number(idPregunta),
      idRespuesta: idRespuesta
    }));
    
    // Guardar respuestas una por una
    let guardadas = 0;
    const totalRespuestas = respuestasEmpleado.length;
    
    respuestasEmpleado.forEach((respuesta, index) => {
      this.resultadoService.guardarRespuesta(respuesta).subscribe({
        next: (result: any) => {
          guardadas++;
          
          if (guardadas === totalRespuestas) {
            // Mostrar mensaje
            if (tiempoAgotado) {
              alert('¡Se ha agotado el tiempo del examen! Tus respuestas han sido guardadas.');
            } else {
              alert('¡Examen completado exitosamente!');
            }
            
            // Esperar un momento para que la base de datos se actualice
            setTimeout(() => {
              this.cargarResultados();
            }, 2000);
          }
        },
        error: (err: any) => {
          alert(`Error al guardar respuesta ${index + 1}: ${err.message}`);
        }
      });
    });
  }

  cargarResultados() {
    this.loading = true;
    this.error = '';
    
    const requestData = { idAsignacion: this.idAsignacion };
    
    this.resultadoService.obtenerReporte(requestData).subscribe({
      next: (data: any[]) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.spiderData = data.map((item, index) => {
            return {
              competencia: item.Competencia || item.competencia || `Competencia ${index + 1}`,
              promedio: Number(item.Promedio || item.promedio || 0)
            };
          });
        } else {
          this.error = 'No se encontraron resultados para este examen.';
          this.spiderData = [];
        }
        
        this.loading = false;
      },
      error: (err) => {
        this.error = `Error al cargar los resultados: ${err.message || 'Error desconocido'}`;
        this.loading = false;
        this.spiderData = [];
      }
    });
  }

  volverAExamenes() {
    // Primero verificar si tenemos resultados para guardar
    if (this.spiderData.length > 0) {
      // Guardar resultados en el historial antes de eliminar la asignación
      this.resultadoService.guardarEnHistorial(this.idAsignacion).subscribe({
        next: (result: any) => {
          // Ahora eliminar la asignación
          this.eliminarAsignacionYRegresar();
        },
        error: (err: any) => {
          alert('Error al guardar resultados en historial, pero continuando...');
          // Continuar con la eliminación de la asignación
          this.eliminarAsignacionYRegresar();
        }
      });
    } else {
      this.eliminarAsignacionYRegresar();
    }
  }

  eliminarAsignacionYRegresar() {
    this.asignacionService.eliminarAsignacion(this.idAsignacion).subscribe({
      next: (result: any) => {
        alert('Asignación eliminada. Regresando a la lista de exámenes.');
        this.router.navigate(['/empleado-examenes']);
      },
      error: (err: any) => {
        alert('Error al eliminar la asignación, pero regresando a la lista de exámenes.');
        this.router.navigate(['/empleado-examenes']);
      }
    });
  }

  cancelar() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.router.navigate(['/empleado-examenes']);
  }

  getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'naranja': '#FFA500',
      'azul': '#0000FF',
      'amarillo': '#FFFF00',
      'rojo': '#FF0000',
      'verde': '#008000',
      'negro': '#000000',
      'blanco': '#FFFFFF',
      'gris': '#808080',
      'beige': '#F5F5DC',
      'veige': '#F5F5DC',
      'plateado': '#C0C0C0',
      'dorado': '#FFD700',
      'morado': '#800080',
      'lila': '#C8A2C8',
      'rosa': '#FFC0CB',
      'rosado': '#FFC0CB',
      'cafe': '#A52A2A',
      'marron': '#A52A2A',
      'turquesa': '#40E0D0',
      'verde lima': '#00FF00',
      'verde oliva': '#808000',
      'vino': '#722F37',
      'azul marino': '#000080',
      'azul cielo': '#87CEEB',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'oro': '#FFD700',
      'bronce': '#CD7F32'
    };
    const normalizedColor = colorName.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');
    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor];
    }
    const foundColor = Object.keys(colorMap).find(key =>
      normalizedColor.includes(key)
    );
    if (foundColor) {
      return colorMap[foundColor];
    }
    if (/^#([0-9A-F]{3}){1,2}$/i.test(normalizedColor)) {
      return normalizedColor;
    }
    return this.generateRandomColor();
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getColorClasificacion(idClasificacion: number): string {
    const clasif = this.clasificaciones.find(c => c.idClasificacion === idClasificacion);
    if (clasif) {
      return this.getColorCode(clasif.color);
    }
    return '#888';
  }
}
